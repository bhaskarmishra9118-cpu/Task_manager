const Task = require('../model/taskmodel')

const isHtmlRequest = (req) => req.headers.accept && req.headers.accept.includes('text/html')

// =========================
// Create Task
// =========================

exports.createTask = async (req, res) => {
  try {
    const { taskName, description, priority, status } = req.body;

    // Validation
    if (!taskName || !description || !priority) {
      const message = 'All fields are required';
      if (isHtmlRequest(req)) {
        return res.redirect(`/createtask?message=${encodeURIComponent(message)}`);
      }
      return res.status(400).json({
        success: false,
        message,
      });
    }

    // Create Task
    const task = await Task.create({
      user: req.user._id,
      taskName,
      description,
      priority,
      status: status || 'pending',
    });

    if (isHtmlRequest(req)) {
      return res.redirect(`/viewtask?message=${encodeURIComponent('Task created successfully')}`);
    }

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });

  } catch (error) {
    if (isHtmlRequest(req)) {
      return res.redirect(`/createtask?message=${encodeURIComponent(error.message)}`);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Tasks of Logged-in User
// =========================

exports.getAllTasks = async (req, res) => {
  try {

    const tasks = await Task.find({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      totalTasks: tasks.length,
      tasks,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Single Task
// =========================

exports.getTaskById = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Security: User sirf apna task dekh sake
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Task
// =========================

exports.updateTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      const message = 'Task not found';
      if (isHtmlRequest(req)) {
        return res.redirect(`/viewtask?message=${encodeURIComponent(message)}`);
      }
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      const message = 'Access denied';
      if (isHtmlRequest(req)) {
        return res.redirect(`/viewtask?message=${encodeURIComponent(message)}`);
      }
      return res.status(403).json({
        success: false,
        message,
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    const message = 'Task updated successfully';
    if (isHtmlRequest(req)) {
      return res.redirect(`/viewtask?message=${encodeURIComponent(message)}`);
    }

    return res.status(200).json({
      success: true,
      message,
      task: updatedTask,
    });

  } catch (error) {
    if (isHtmlRequest(req)) {
      return res.redirect(`/viewtask?message=${encodeURIComponent(error.message)}`);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Task
// =========================

exports.deleteTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      const message = 'Task not found';
      if (isHtmlRequest(req)) {
        return res.redirect(`/viewtask?message=${encodeURIComponent(message)}`);
      }
      return res.status(404).json({
        success: false,
        message,
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      const message = 'Access denied';
      if (isHtmlRequest(req)) {
        return res.redirect(`/viewtask?message=${encodeURIComponent(message)}`);
      }
      return res.status(403).json({
        success: false,
        message,
      });
    }

    await task.deleteOne();

    const message = 'Task deleted successfully';
    if (isHtmlRequest(req)) {
      return res.redirect(`/viewtask?message=${encodeURIComponent(message)}`);
    }

    return res.status(200).json({
      success: true,
      message,
    });

  } catch (error) {
    if (isHtmlRequest(req)) {
      return res.redirect(`/viewtask?message=${encodeURIComponent(error.message)}`);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};