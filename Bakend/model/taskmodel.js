const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskName: {
      type: String,
      required: [true, 'Task name is required'],
      minlength: [5, 'Please provide a task name with at least 5 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: [true, 'Priority is required'],
    },
    pending: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'inprogress'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

const Task = mongoose.model('Task', taskSchema)

module.exports = Task