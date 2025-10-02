const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const cors = require("cors");

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb+srv://shalinisharma31102_db_user:Avi1028@cluster0.5qmnht0.mongodb.net/studentAttendanceDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

// Import Models
const Student = require("./models/student");
const Attendance = require("./models/attendance");

// ROUTES

// Endpoint to register a student
app.post('/addStudent', async (req, res) => {
  try {
    const {
      studentId,
      studentName,  // MAKE SURE THIS LINE IS HERE
      rollNo,
      qrCode,
      class: studentClass,
      section,
      academicYear,
      dateOfBirth,
      gender,
      interestProfile
    } = req.body;

    const newStudent = new Student({
      studentId,
      studentName,  // MAKE SURE THIS LINE IS HERE
      rollNo,
      qrCode,
      class: studentClass,
      section,
      academicYear,
      dateOfBirth,
      gender,
      interestProfile
    });

    await newStudent.save();

    res
      .status(201)
      .json({ message: "Student saved successfully", student: newStudent });
  } catch (error) {
    console.log("Error creating student", error);
    res.status(500).json({ message: "Failed to add a student" });
  }
});

// Endpoint to fetch all the students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the students" });
  }
});

// Submit attendance
app.post("/attendance", async (req, res) => {
  try {
    const { studentId, studentName, date, status } = req.body;

    const existingAttendance = await Attendance.findOne({ studentId, date });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();
      res.status(200).json(existingAttendance);
    } else {
      const newAttendance = new Attendance({
        studentId,
        studentName,
        date,
        status,
      });
      await newAttendance.save();
      res.status(200).json(newAttendance);
    }
  } catch (error) {
    res.status(500).json({ message: "Error submitting attendance" });
  }
});

// Get attendance by date
app.get("/attendance", async (req, res) => {
  try {
    const { date } = req.query;

    // Find attendance records for the specified date
    const attendanceData = await Attendance.find({ date: date });

    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance data" });
  }
});

// Attendance report for all students for a month
app.get("/attendance-report-all-students", async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = moment(`${year}-${month}-01`, "YYYY-MM-DD")
      .startOf("month")
      .toDate();
    const endDate = moment(startDate).endOf("month").toDate();

    const report = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$studentId",
          present: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
          absent: {
            $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] },
          },
          halfday: {
            $sum: { $cond: [{ $eq: ["$status", "halfday"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      { $unwind: "$studentDetails" },
      {
        $project: {
          _id: 1,
          present: 1,
          absent: 1,
          halfday: 1,
          rollNo: "$studentDetails.rollNo",
          class: "$studentDetails.class",
          section: "$studentDetails.section",
        },
      },
    ]);

    res.status(200).json({ report });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    res.status(500).json({ message: "Error generating the report", error });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});