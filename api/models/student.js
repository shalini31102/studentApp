// backend/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // ============ CORE IDENTITY ============
  studentId: { 
        type:String,
        required:true,
        unique:true, 
  },
    
  studentName: {  // ADD THIS FIELD
    type: String,
    required: true,
    trim: true
  },
  
  rollNo: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  
  // ============ QR CODE (CRITICAL FOR ATTENDANCE) ============
  qrCode: { 
    type: String, 
    required: true, 
    unique: true,
    // Format: STUDENT-{userId}-{timestamp} or custom format
  },
  
  // ============ ACADEMIC DETAILS ============
  class: { 
    type: String, 
    required: true,
    trim: true
    // Example: "10", "11", "12"
  },
  
  section: { 
    type: String, 
    default: 'A',
    trim: true,
    uppercase: true
    // Example: "A", "B", "C"
  },
  
  
  academicYear: {
    type: String,
    default: () => {
      const year = new Date().getFullYear();
      return `${year}-${year + 1}`;
    }
    // Example: "2024-2025"
  },
  
  
  // ============ PERSONAL INFORMATION ============
  dateOfBirth: {
    type: String,
    required: true
  },
  
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  
  
  // ============ INTEREST PROFILE (FOR PERSONALIZED TASKS) ============
  interestProfile: {
    // Academic interests
    subjects: [{
      type: String,
      // Example: ['Mathematics', 'Science', 'English']
    }],
    
    // Extra-curricular interests
    hobbies: [{
      type: String,
      // Example: ['Coding', 'Art', 'Sports', 'Music']
    }],
    
    // Career aspirations
    careerGoals: {
      type: String,
      // Example: "Software Engineer", "Doctor", "Artist"
    },
    
    // Skills they want to develop
    skillsToLearn: [{
      type: String,
      // Example: ['Web Development', 'Public Speaking', 'Leadership']
    }],
    
    // Learning pace
    learningPace: {
      type: String,
      enum: ['slow', 'medium', 'fast'],
      default: 'medium'
    },
    
    // Preferred learning style
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'reading', 'kinesthetic'],
      default: 'visual'
    }
  },
})  


const Student = mongoose.model("Student",studentSchema);

module.exports = Student;