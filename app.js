const express = require("express");
const bodyParser=require("body-parser")
const cors=require("cors")

const app=express()


//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())


app.post("/submitQuestionnaire",(req,res)=>{
    var data=req.body
    res.json({"status":"success","data":data})
}

)


app.listen(4000,()=>{
    console.log("server running on port 4000....")
})
