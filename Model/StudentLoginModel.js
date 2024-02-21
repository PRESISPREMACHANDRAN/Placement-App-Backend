const mongoose = require("mongoose");

const studentLoginSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

var studentLoginModel = mongoose.model("studentLogin", studentLoginSchema);

module.exports = { studentLoginModel };
