const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { adminLoginModel } = require("./Model/AdminLoginModel");
const { studentLoginModel } = require("./Model/StudentLoginModel");
const studentModel = require("./Model/StudentModel");
const Student = require("./Model/StudentModel");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://presi123:presi123@cluster0.dfo33ti.mongodb.net/PlacementDB?retryWrites=true&w=majority"
);

// Route for student login
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


// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Destination folder for storing uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)); // File naming with original extension
  },
});

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
}).single("photo"); // Corrected to "photo"

// Endpoint to add student details with photo
app.post("/addStudent", (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(500).json({ status: "error", message: err.message });
      } else if (err) {
        // An unknown error occurred when uploading
        return res.status(500).json({ status: "error", message: err.message });
      }

      var data = req.body;
      data.photo = req.file.filename; // Add the filename to the student data
      let student = new studentModel(data);
      let result = await student.save();
      res.json({ status: "success", data: data });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });
});

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// view student by stream
app.post("/viewStudent", async (req, res) => {
  try {
    const { stream } = req.body;
    let students;
    if (stream) {
      students = await studentModel.find({ stream });
    } else {
      students = await studentModel.find();
    }
    res.json({ status: "success", data: students });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// //add student details
// app.post("/addStudent",async(req,res)=>{
//     var data=req.body
//     let student=new studentModel(data)
// let result=await student.save()
//     res.json({"status":"success","data":data})

// })

// // view student by stream
// app.post("/viewStudent", async (req, res) => {
//   try {
//     const { stream } = req.body;
//     let students;
//     if (stream) {
//       students = await studentModel.find({ stream });
//     } else {
//       students = await studentModel.find();
//     }
//     res.json({ status: "success", data: students });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

// Route for placement officer login
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
    if (result.stream !== stream) {
      return res.status(404).json({ error: "Incorrect stream" });
    }

    // Return success response
    res.json({ status: "success", data: result });
  } catch (error) {
    console.log("error during login", error);
    res.status(500).json({ error: "internal server error" });
  }
});



// Calculate score for a single student based on criteria
const calculateScore = (student) => {
  let score = 0;

  // Assuming the provided fields are numerical values
  if (parseInt(student.registeredInPlacementPortal) >= 90) score += 1000;
  else if (parseInt(student.registeredInPlacementPortal) >= 60) score += 750;
  else if (parseInt(student.registeredInPlacementPortal) >= 30) score += 500;
  else if (parseInt(student.registeredInPlacementPortal) >= 10) score += 250;

  if (parseInt(student.attendedInterviews) >= 90) score += 1000;
  else if (parseInt(student.attendedInterviews) >= 60) score += 750;
  else if (parseInt(student.attendedInterviews) >= 30) score += 500;
  else if (parseInt(student.attendedInterviews) >= 10) score += 250;

  // Adjust the scoring logic for other fields (areaOfInterest, receivedJobOffers) if needed

  return score;
};

// Calculate total score for a stream
const calculateStreamScore = async (stream) => {
  try {
    const students = await Student.find({ stream });
    let totalScore = 0;

    for (const student of students) {
      totalScore += calculateScore(student);
    }

    return totalScore;
  } catch (error) {
    console.error("Error calculating stream score:", error);
    throw error;
  }
};

// Calculate scores for all streams and determine ranks
const calculateStreamRanks = async () => {
  try {
    const streams = ["IT", "MCA", "Electronics"]; // Define your streams
    const streamScores = [];

    for (const stream of streams) {
      const score = await calculateStreamScore(stream);
      streamScores.push({ stream, score });
    }

    // Sort streamScores based on score in descending order
    streamScores.sort((a, b) => b.score - a.score);

    // Add rank to each stream
    for (let i = 0; i < streamScores.length; i++) {
      streamScores[i].rank = i + 1;
    }

    return streamScores;
  } catch (error) {
    console.error("Error calculating stream ranks:", error);
    throw error;
  }
};

// Endpoint to calculate stream ranks
app.post("/streamRanks", async (req, res) => {
  try {
    const streamRanks = await calculateStreamRanks();
    res.json(streamRanks);
  } catch (error) {
    console.error("Error calculating stream ranks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



//server
app.listen(4000, () => {
  console.log("server running on port 4000....");
});
