const express = require("express");
const bodyParser=require("body-parser")
const cors=require("cors")
const mongoose=require("mongoose")
const { questionnaireModel } = require("./Model/QuestionnaireModel");
const { adminLoginModel } = require("./Model/AdminLoginModel");
const { studentLoginModel } = require("./Model/StudentLoginModel");

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

//Route for add student  (add email and password to db )
// app.post("/addStudent",async(req,res)=>{
//   var data=req.body
//   let studentLogin=new studentLoginModel(data)
//   let result=await studentLogin.save()
// res.json({"status":"success","data":result})
// })

//Route for add Admin(add email, password,stream to db )
// app.post("/addAdmin",async(req,res)=>{
//   var data=req.body
//   let adminLogin=new adminLoginModel(data)
//   let result=await adminLogin.save()
// res.json({"status":"success","data":result})
// })


// //view all student data from db
// app.post("/viewAllStudents", async(req,res)=>{
//  let result=await studentLoginModel.find()
// res.json({"status":"success","data":result})
// })
// //view all placement officers data from db
// app.post("/viewAllAdmins", async(req,res)=>{
//  let result=await adminLoginModel.find()
// res.json({"status":"success","data":result})
// })






// login  for student
app.post("/studentLogin", async (req, res) => {
  try {
    var { email, password } = req.body;

    // Find student by email
    let result = await studentLoginModel.findOne({ email });

    // If student not found, return error
    if (!result) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if password matches
    if (result.password !== password) {
      return res.status(404).json({ error: "Incorrect password" });
    }

    // Return success response
    res.json({ status: "success", data: result });

  } catch (error) {
    console.log("error during login", error);
    res.status(500).json({ error: "internal server error" });
  }
});




// login  for Placement officer
app.post("/adminLogin", async (req, res) => {
  try {
    var { email, password, stream } = req.body;

    // Find placement officer by email
    let result = await adminLoginModel.findOne({ email });

    // If placement officer not found, return error
    if (!result) {
      return res.status(404).json({ error: "Placement officer not found" });
    }

    // Check if password matches
    if (result.password !== password) {
      return res.status(404).json({ error: "Incorrect password" });
    }

    // Check if stream matches
    if (result.stream!== stream) {
      return res.status(404).json({ error: "Incorrect stream" });
    }

    // Return success response
    res.json({ status: "success", data: result });
  } catch (error) {
    console.log("error during login", error);
    res.status(500).json({ error: "internal server error" });
  }
});












//server                                                                                                            
app.listen(4000,()=>{
    console.log("server running on port 4000....")
})
