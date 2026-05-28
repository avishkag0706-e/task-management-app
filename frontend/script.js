const taskList = document.getElementById("taskList");

const API = "http://localhost:5000";

let token = localStorage.getItem("token");

async function signup(){

  const username = document.getElementById("username").value;

  const password = document.getElementById("password").value;

  const response = await fetch(`${API}/signup`, {

    method: "POST",

    headers:{
      "Content-Type":"application/json"
    },

    body: JSON.stringify({
      username,
      password
    })
  });

  const data = await response.json();

  alert(data.message);
}

async function login(){

  const username = document.getElementById("username").value;

  const password = document.getElementById("password").value;

  const response = await fetch(`${API}/login`, {

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body: JSON.stringify({
      username,
      password
    })
  });

  const data = await response.json();

  if(data.token){

    localStorage.setItem("token", data.token);

    token = data.token;

    alert("Login successful");

    loadTasks();

  }else{
    alert(data.message);
  }
}

async function loadTasks(){

  if(!token) return;

  const response = await fetch(`${API}/tasks`, {

    headers:{
      authorization: token
    }
  });

  const tasks = await response.json();

  taskList.innerHTML = "";

  tasks.forEach(task => {

    const div = document.createElement("div");

    div.classList.add("task");

    div.innerHTML = `
      <span>${task.text}</span>

      <button onclick="deleteTask('${task._id}')">
        Delete
      </button>
    `;

    taskList.appendChild(div);
  });
}

async function addTask(){
if(!token){
  alert("Please login first");
  return;
}
  const taskInput = document.getElementById("taskInput");

  await fetch(`${API}/tasks`, {

    method:"POST",

    headers:{
      "Content-Type":"application/json",
      authorization: token
    },

    body: JSON.stringify({
      text: taskInput.value
    })
  });

  taskInput.value = "";

  loadTasks();
}

async function deleteTask(id){

  await fetch(`${API}/tasks/${id}`, {

    method:"DELETE",

    headers:{
      authorization: token
    }
  });

  loadTasks();
}

loadTasks();

function logout(){

  localStorage.removeItem("token");

  token = null;

  taskList.innerHTML = "";

  alert("Logged out");
}