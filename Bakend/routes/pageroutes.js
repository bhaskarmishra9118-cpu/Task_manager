const express = require('express')
const pageRouter = express.Router()
const Task = require('../model/taskmodel')
const { auth_middleware } = require('../Middleware/authmiddleware')

pageRouter.get('/login', (req, res) => {
  res.render('login')
})

pageRouter.get('/register', (req, res) => {
  res.render('register')
})

pageRouter.get('/dashboard', auth_middleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 })

    res.render('dashboard', {
      userName: req.user.name || 'User',
      tasks
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Unable to load dashboard')
  }
})

pageRouter.get('/createtask', (req, res) => {
  console.log('Create task page requested')
  res.render('createtask')
})

pageRouter.get('/viewtask', auth_middleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 })

    res.render('viewtask', {
      userName: req.user.name || 'User',
      tasks
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Unable to load tasks')
  }
})

module.exports = pageRouter
