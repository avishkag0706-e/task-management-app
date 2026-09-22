const express = require("express");

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All task routes require authentication

// Create task
router.post("/", protect, createTask);

// Get all user's tasks
router.get("/", protect, getTasks);

// Get one user's task
router.get("/:id", protect, getTask);

// Update user's task
router.put("/:id", protect, updateTask);

// Delete user's task
router.delete("/:id", protect, deleteTask);

module.exports = router;