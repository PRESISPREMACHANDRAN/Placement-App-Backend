const mongoose = require("mongoose");

const questionnaireSchema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  studentID: { type: String, required: true },
  stream: { type: String, required: true },
  photo: { type: String, required: true }, // Assuming the photo will be stored as a file path

  registeredInPlacementPortal: { type: Boolean, required: true },
  placementID: { type: String },

  attendedInterviews: { type: Boolean },

  areaOfInterest: { type: [String], required: true },

  receivedJobOffers: { type: Boolean, required: true },
  jobOfferDocument: { type: String } // Assuming the document will be stored as a file path
});


var questionnaireModel = mongoose.model("questionnaire", questionnaireSchema);

module.exports={questionnaireModel}
