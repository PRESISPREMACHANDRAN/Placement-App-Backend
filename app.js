const express = require("express");
const bodyParser=require("body-parser")
const cors=require("cors")
const mongoose=require("mongoose")
const { questionnaireModel } = require("./Model/QuestionnaireModel");

const app=express()


//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())


// MongoDB Connection
mongoose.connect(
  "mongodb+srv://presi123:presi123@cluster0.dfo33ti.mongodb.net/PlacementDB?retryWrites=true&w=majority"
);

//Route for submitQuestionnaire
app.post("/submitQuestionnaire",async(req,res)=>{
    var data=req.body
    let questionnaire=new questionnaireModel(data)
    let result=await questionnaire.save()
    res.json({"status":"success","data":result})
}

)


//server
app.listen(4000,()=>{
    console.log("server running on port 4000....")
})
