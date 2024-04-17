// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./models/Task');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/task-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Routes
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;
    const task = new Task({ title, description, priority, category });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ priority: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { title, description, priority, category }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
