
const express = require("express")
const taskrouter = express.Router()
const {auth_middleware} = require('../Middleware/authmiddleware')
const {createTask , getAllTasks, getTaskById, updateTask, deleteTask} = require('../Controller/taskcontroller')

console.log("controllers",{createTask , getAllTasks, getTaskById, deleteTask, updateTask})

taskrouter.post("/createtask" , auth_middleware, createTask)
taskrouter.post("/createTask" , auth_middleware, createTask)
taskrouter.get("/getalltask" ,auth_middleware, getAllTasks)
taskrouter.get('/getsingletask',auth_middleware, getTaskById)
taskrouter.delete('/deletetask/:id' , auth_middleware,deleteTask)
taskrouter.put('/updatetask/:id', auth_middleware,updateTask)



module.exports = taskrouter