const express = require('express')
const app = express()
const mongoose = require('mongoose')

exports.Database_connection = async(req, res) =>{
  try{
  const is_connect = await mongoose.connect(process.env.DATABASE_URI)
    if(is_connect)
      {console.log(`database connected successfully `)}
  

}
  catch(err){
    console.log(`database connection failed due to  ${err.message}`)
  }
}