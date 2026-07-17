const express = require('express')
const pageRouter = express.Router()
const Task = require('../model/taskmodel')
const { auth_middleware } = require('../Middleware/authmiddleware')

pageRouter.get('/', (req, res) => {
  res.redirect('/login')
})

pageRouter.get('/login', (req, res) => {
  res.render('login', { message: req.query.message || '' })
})

pageRouter.get('/register', (req, res) => {
  res.render('register', { message: req.query.message || '' })
})

pageRouter.get('/dashboard', auth_middleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 })
    const totalTasks = tasks.length
    const pendingTasks = tasks.filter((task) => (task.status || 'pending').toLowerCase() === 'pending').length
    const completedTasks = tasks.filter((task) => (task.status || 'pending').toLowerCase() === 'completed').length

    res.render('dashboard', {
      userName: req.user.name || 'User',
      tasks,
      totalTasks,
      pendingTasks,
      completedTasks,
      message: req.query.message || ''
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Unable to load dashboard')
  }
})

pageRouter.get('/createtask', auth_middleware, (req, res) => {
  res.render('createtask', {
    userName: req.user.name || 'User',
    message: req.query.message || ''
  })
})

pageRouter.get('/viewtask', auth_middleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 })

    res.render('viewtask', {
      userName: req.user.name || 'User',
      tasks,
      message: req.query.message || ''
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Unable to load tasks')
  }
})

pageRouter.get('/logout', (req, res) => {
  res.clearCookie('token')
  res.redirect('/login?message=' + encodeURIComponent('Logged out successfully'))
})

pageRouter.post('/task/delete/:id', auth_middleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.redirect('/viewtask?message=' + encodeURIComponent('Task not found or access denied'))
    }

    await task.deleteOne()
    return res.redirect('/viewtask?message=' + encodeURIComponent('Task deleted successfully'))
  } catch (error) {
    return res.redirect('/viewtask?message=' + encodeURIComponent(error.message))
  }
})

pageRouter.post('/task/update-status/:id', auth_middleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task || task.user.toString() !== req.user._id.toString()) {
      return res.redirect('/viewtask?message=' + encodeURIComponent('Task not found or access denied'))
    }

    const status = ['completed', 'pending', 'inprogress'].includes(req.body.status) ? req.body.status : 'pending'
    await Task.findByIdAndUpdate(req.params.id, { status }, { runValidators: true })
    return res.redirect('/viewtask?message=' + encodeURIComponent('Task updated successfully'))
  } catch (error) {
    return res.redirect('/viewtask?message=' + encodeURIComponent(error.message))
  }
})

module.exports = pageRouter
