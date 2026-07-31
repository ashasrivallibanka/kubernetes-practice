const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Task = require("./models/Task");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27018/taskmanager";

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Task Manager Backend API is running",
  });
});

// Health-check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
  });
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve tasks",
      error: error.message,
    });
  }
});

// Create a task
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Unable to create task",
      error: error.message,
    });
  }
});

// Update a task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Unable to update task",
      error: error.message,
    });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete task",
      error: error.message,
    });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("Connected to MongoDB");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
