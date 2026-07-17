const express  = require('express');
const app = express()
const dotenv = require('dotenv').config()
const {Database_connection} = require('./model/database')
//const cors = require('cors')
const router = require("./routes/authRoutes")
const taskrouter = require('./routes/taskRoute')
const pageRouter = require('./routes/pageroutes')
const cookie_parser = require('cookie-parser')
const path = require('path')

//app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookie_parser())
app.use(express.static(path.join(__dirname, "public")))
Database_connection()



app.get('/', (req, res) =>{
  res.send('this is home page')
  console.log("new user")

})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "View"))

app.use('/', pageRouter)

app.use("/api/auth" , router)

app.use('/api/task' , taskrouter)

app.use((req, res)=>{
  res.status(404).send("Not found")
})
const port = Number(process.env.PORT) || 5000

app.listen(port, '0.0.0.0', () => {
  console.log(`server is running on ${port}`)
})
