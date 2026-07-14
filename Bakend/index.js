const express  = require('express');
const app = express()
const dotenv = require('dotenv').config()
const {Database_connection} = require('./model/database')


Database_connection()




app.get('/', (req, res) =>{
  res.send('this is home page')

})

const port = process.env.PORT || 3001
app.listen(port, ()=>{
  console.log(`server is running on port  ${port}`
  )
})
