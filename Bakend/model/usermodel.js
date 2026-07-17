
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      minlength: [5, "length should be greater than 5"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "length should be greater than 8"],
    },
  },
  {
    timestamps: true,
  }
)

const user_model = mongoose.model('User', userSchema)

module.exports = user_model