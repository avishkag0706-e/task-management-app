
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
"mongodb+srv://avishkag0706_db_user:avi123@cluster0.nnsemx0.mongodb.net/taskdb?retryWrites=true&w=majority")
  

.then(() => {
  console.log("MongoDB Connected");
})

.catch((error) => {
  console.log(error);
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const taskSchema = new mongoose.Schema({
  text: String,
  userId: String
});

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);

app.post("/signup", async (req, res) => {

  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword
  });

  await user.save();

  res.json({
    message: "User created"
  });
});

app.post("/login", async (req, res) => {

  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if(!user){
    return res.status(400).json({
      message: "User not found"
    });
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if(!isMatch){
    return res.status(400).json({
      message: "Wrong password"
    });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET
  );

  res.json({
    token,
    userId: user._id
  });
});

function auth(req, res, next){

  const token = req.headers.authorization;

  if(!token){
    return res.status(401).json({
      message: "No token"
    });
  }

  try{

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;

    next();

  }catch(error){

    res.status(401).json({
      message: "Invalid token"
    });
  }
}

app.get("/tasks", auth, async (req, res) => {

  const tasks = await Task.find({
    userId: req.user.id
  });

  res.json(tasks);
});

app.post("/tasks", auth, async (req, res) => {

  const newTask = new Task({
    text: req.body.text,
    userId: req.user.id
  });

  await newTask.save();

  res.json(newTask);
});

app.delete("/tasks/:id", auth, async (req, res) => {

  await Task.findByIdAndDelete(req.params.id);

  res.json({
    message: "Task deleted"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});