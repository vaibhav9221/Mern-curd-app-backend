const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: { type: String, enum: ['High', 'Medium', 'Low'] },
  category: String
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;