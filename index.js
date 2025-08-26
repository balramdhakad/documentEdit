const express = require("express")
const connectDB = require("./backend/Config/dbConfig")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

//DATABASE CONNECTION
connectDB()

//body parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//router
app.use("/api/auth",require("./backend/Routes/authRoutes"))
app.use("/api/doc",require("./backend/Routes/documentRoutes"))
app.use("/api/version",require("./backend/Routes/versionRoutes"))

app.listen(PORT,()=>{
    console.log(`server is running at PORT : ${PORT}`)
})