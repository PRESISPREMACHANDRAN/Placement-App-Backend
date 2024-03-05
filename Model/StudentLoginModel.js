const mongoose = require("mongoose");

const studentLoginSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  stream: { type: String, required: true },
  studentID: { type: String, required: true },
photo: { type: String, required: true },  // 
  role: { type: String, default: "student", required: false },
});

var studentLoginModel = mongoose.model("studentLogin", studentLoginSchema);

module.exports = { studentLoginModel };
