const Task = require("../models/Task");

// CREATE a task
const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      user: req.user
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message
    });
  }
};

// READ all tasks for logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get tasks",
      error: error.message
    });
  }
};

// READ one task
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get task",
      error: error.message
    });
  }
};

// UPDATE a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message
    });
  }
};

// DELETE a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
};