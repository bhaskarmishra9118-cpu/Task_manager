
const mongoose = require('mongoose')

const user_model = async(req, res) =>{
  new mongoose.Schema({
    name: {
      type:" string", 
      required: true,
    },
    email: {
      type: "string",
      required: true,
      minlength: [
        5 , "length should be greater then 5",       
      ],
      unique: true,
    },
    password: {
      type: "string",
      unique: true,
      required : true,
      minlength: [
        8 , "length should be greater then 8"
      ]
    }
  

  })
  timestamps: true
}
module.exports = user_model