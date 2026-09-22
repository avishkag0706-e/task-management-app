import { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";

function App() {
  // =========================
  // AUTH STATE
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const [authMode, setAuthMode] = useState("login");

  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  const [authMessage, setAuthMessage] = useState("");

  // =========================
  // TASK STATE
  // =========================

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [editingId, setEditingId] = useState(null);

  // =========================
  // TASK PROGRESS
  // =========================

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const totalTasks = tasks.length;

  const progressPercentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // =========================
  // AUTH INPUT CHANGE
  // =========================

  const handleAuthChange = (e) => {
    setAuthData({
      ...authData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LOGIN / REGISTER
  // =========================

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    try {
      setAuthMessage("");

      // =========================
      // REGISTER
      // =========================

      if (authMode === "register") {
        const response = await API.post("/auth/register", authData);

        setAuthMessage(response.data.message);

        setAuthMode("login");

        setAuthData({
          name: "",
          email: "",
          password: "",
        });
      } else {
        // =========================
        // LOGIN
        // =========================

        const response = await API.post("/auth/login", {
          email: authData.email,
          password: authData.password,
        });

        localStorage.setItem("token", response.data.token);

        localStorage.setItem("user", JSON.stringify(response.data.user));

        setUser(response.data.user);

        setIsLoggedIn(true);

        setAuthData({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      setAuthMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setIsLoggedIn(false);

    setUser(null);

    setTasks([]);

    setEditingId(null);

    setFormData({
      title: "",
      description: "",
      priority: "medium",
    });
  };

  // =========================
  // GET TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      setLoading(true);

      setErrorMessage("");

      const response = await API.get("/tasks");

      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);

      setErrorMessage("Unable to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD TASKS AFTER LOGIN
  // =========================

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  // =========================
  // TASK INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE / UPDATE TASK
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setErrorMessage("");

      // =========================
      // UPDATE TASK
      // =========================

      if (editingId) {
        const response = await API.put(`/tasks/${editingId}`, formData);

        setTasks(
          tasks.map((task) => (task._id === editingId ? response.data : task)),
        );

        setEditingId(null);
      } else {
        // =========================
        // CREATE TASK
        // =========================

        const response = await API.post("/tasks", formData);

        setTasks([...tasks, response.data]);
      }

      // Clear form

      setFormData({
        title: "",
        description: "",
        priority: "medium",
      });
    } catch (error) {
      console.error("Failed to save task:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save task. Please try again.",
      );
    }
  };

  // =========================
  // EDIT TASK
  // =========================

  const handleEdit = (task) => {
    setEditingId(task._id);

    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
    });

    // Scroll to form

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      title: "",
      description: "",
      priority: "medium",
    });

    setErrorMessage("");
  };

  // =========================
  // COMPLETE TASK
  // =========================

  const handleComplete = async (id) => {
    try {
      setErrorMessage("");

      const response = await API.put(`/tasks/${id}`, {
        status: "completed",
      });

      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error("Failed to complete task:", error);

      setErrorMessage("Failed to complete task. Please try again.");
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDelete = async (id) => {
    try {
      setErrorMessage("");

      await API.delete(`/tasks/${id}`);

      setTasks(tasks.filter((task) => task._id !== id));

      // If deleting the task being edited

      if (editingId === id) {
        setEditingId(null);

        setFormData({
          title: "",
          description: "",
          priority: "medium",
        });
      }
    } catch (error) {
      console.error("Failed to delete task:", error);

      setErrorMessage("Failed to delete task. Please try again.");
    }
  };

  // =====================================================
  // LOGIN / REGISTER SCREEN
  // =====================================================

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Taskbuddy</h1>

          <h2>{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {/* NAME */}

            {authMode === "register" && (
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={authData.name}
                onChange={handleAuthChange}
                required
              />
            )}

            {/* EMAIL */}

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={authData.email}
              onChange={handleAuthChange}
              required
            />

            {/* PASSWORD */}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={authData.password}
              onChange={handleAuthChange}
              required
            />

            {/* SUBMIT */}

            <button className="primary-button" type="submit">
              {authMode === "login" ? "Login" : "Create Account"}
            </button>
          </form>

          {/* AUTH MESSAGE */}

          {authMessage && <p className="auth-message">{authMessage}</p>}

          {/* SWITCH LOGIN / REGISTER */}

          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");

              setAuthMessage("");

              setAuthData({
                name: "",
                email: "",
                password: "",
              });
            }}
          >
            {authMode === "login"
              ? "Don't have an account? Create one"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // TASK MANAGER
  // =====================================================

  return (
    <div className="app-container">
      {/* =========================
          HEADER
      ========================= */}

      <header className="header">
        <h1>Taskbuddy</h1>

        <div className="user-section">
          <span>Welcome, {user?.name}</span>

          <button className="secondary-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* =========================
          TASK PROGRESS
      ========================= */}

      <div className="progress-card">
        <div className="progress-header">
          <div>
            <h2>Task Progress</h2>

            <p>
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>

          <div className="progress-percentage">{progressPercentage}%</div>
        </div>

        {/* PROGRESS BAR */}

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progressPercentage}%`,
            }}
          ></div>
        </div>

        {/* PROGRESS FOOTER */}

        <div className="progress-footer">
          <span>
            {totalTasks === 0
              ? "Start by creating your first task"
              : progressPercentage === 100
                ? "All tasks completed!"
                : "Keep going! You're doing great."}
          </span>

          <span>{completedTasks} completed</span>
        </div>
      </div>

      {/* =========================
          ERROR MESSAGE
      ========================= */}

      {errorMessage && <p className="auth-message">{errorMessage}</p>}

      {/* =========================
          ADD / EDIT FORM
      ========================= */}

      <div className="form-card">
        <h2>{editingId ? "Edit Task" : "Add New Task"}</h2>

        <form className="task-form" onSubmit={handleSubmit}>
          {/* TITLE */}

          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* DESCRIPTION */}

          <textarea
            name="description"
            placeholder="Task description"
            value={formData.description}
            onChange={handleChange}
          />

          {/* PRIORITY */}

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>

            <option value="medium">Medium</option>

            <option value="high">High</option>
          </select>

          {/* SUBMIT */}

          <button className="primary-button" type="submit">
            {editingId ? "Update Task" : "Add Task"}
          </button>

          {/* CANCEL */}

          {editingId && (
            <button
              className="secondary-button"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* =========================
          TASK LIST
      ========================= */}

      <h2>My Tasks</h2>

      {/* LOADING */}

      {loading && <p>Loading tasks...</p>}

      {/* ERROR */}

      {!loading && errorMessage && (
        <p>Unable to load tasks. Please try again.</p>
      )}

      {/* EMPTY */}

      {!loading && !errorMessage && tasks.length === 0 && (
        <p>No tasks found. Create your first task!</p>
      )}

      {/* TASKS */}

      {!loading && !errorMessage && tasks.length > 0 && (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div className="task-card" key={task._id}>
              {/* TASK TITLE */}

              <h3>{task.title}</h3>

              {/* DESCRIPTION */}

              <p>{task.description || "No description"}</p>

              {/* STATUS */}

              <p className="status">Status: {task.status}</p>

              {/* PRIORITY */}

              <p>Priority: {task.priority}</p>

              {/* ACTIONS */}

              <div className="task-actions">
                {/* EDIT */}

                <button
                  className="edit-button"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>

                {/* COMPLETE */}

                {task.status !== "completed" && (
                  <button
                    className="complete-button"
                    onClick={() => handleComplete(task._id)}
                  >
                    Complete
                  </button>
                )}

                {/* DELETE */}

                <button
                  className="delete-button"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
