const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  studentID: { type: String, required: true },
  stream: { type: String, required: true },
  registeredInPlacementPortal: { type: String, required: true },
  placementID: { type: String },
  attendedInterviews: { type: String, required: true },
  areaOfInterest: { type: String, required: true },
  receivedJobOffers: { type: String, required: true },
  jobOfferDocument: { type: Buffer }, // Store PDF as Buffer,
  // role: { type: String, default: "student", required: false },
});

const studentModel = mongoose.model("student", studentSchema);

module.exports = studentModel;
