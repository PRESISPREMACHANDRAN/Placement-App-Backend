const express = require("express");
const bodyParser=require("body-parser")
const cors=require("cors")

const app=express()


//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())



app.listen(4000,()=>{
    console.log("server running on port 4000....")
})
