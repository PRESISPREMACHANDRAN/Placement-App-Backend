const mongoose=require("mongoose")

const adminLoginSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  stream: { type: String, required: true }
});

let adminLoginModel=mongoose.model("adminLogin",adminLoginSchema)

module.exports={adminLoginModel}

