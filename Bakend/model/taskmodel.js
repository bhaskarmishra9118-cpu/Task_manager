const mongoose = require('mongoose')

const task_schema = async(req , res )=>{
 new mongoose.Schema({
  user:{
    type: mongoose.Schema.ObjectId,
    ref: user_model,
  },
  taskName: {
    type: "string", 
    required: "true",
    minlength: [
      5 , "please provide taskLength greater then 5 "
    ]
  },
  description: {
    type: "string", 
    required: 'true',
    minlength: [10 , "this field must be greater then 10 characters"]
  },
  createdAt: {
    type: "Date",
    unique: true,

  },
  priority: {
    type: 'string',
    enum: ["high" , "medium", "low"],

  },
  pending: {
    type: "Number",
    default: 0
  },
  dueDate: {
    type: "Date", 
    
  },
  status: {
    type: "string",
    enum: ['comleted' , 'pending' , 'inprogress'],
    default: 'pending'
  }

 })
 timestamps: true
}
module.exports = task_schema