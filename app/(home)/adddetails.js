import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const AddStudent = () => {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState(""); // ADDED
  const [rollNo, setRollNo] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("A");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [subjects, setSubjects] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState("");
  const [learningPace, setLearningPace] = useState("");
  const [learningStyle, setLearningStyle] = useState("");

  const handleRegister = () => {
    console.log("=== STARTING REGISTRATION ===");
    
    const studentData = {
      studentId: studentId.trim(),
      studentName: studentName.trim(), // ADDED
      rollNo: rollNo.trim(),
      qrCode: `STUDENT-${studentId.trim()}-${Date.now()}`,
      class: studentClass.trim(),
      section: section.trim().toUpperCase(),
      academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      dateOfBirth,
      gender: gender.trim(),
      interestProfile: {
        subjects: subjects.split(",").map((s) => s.trim()).filter(s => s),
        hobbies: hobbies.split(",").map((h) => h.trim()).filter(h => h),
        careerGoals: careerGoals.trim(),
        skillsToLearn: skillsToLearn.split(",").map((s) => s.trim()).filter(s => s),
        learningPace: learningPace.trim().toLowerCase(),
        learningStyle: learningStyle.trim().toLowerCase(),
      },
    };

    console.log("Student Data:", JSON.stringify(studentData, null, 2));

    axios.post(API_ENDPOINTS.addStudent, studentData)
      .then((response) => {
        console.log("SUCCESS!", response.data);
        Alert.alert("Success", "Student added successfully");
        setStudentId("");
        setStudentName(""); // ADDED
        setRollNo("");
        setStudentClass("");
        setSection("A");
        setDateOfBirth("");
        setGender("");
        setSubjects("");
        setHobbies("");
        setCareerGoals("");
        setSkillsToLearn("");
        setLearningPace("");
        setLearningStyle("");
      })
      .catch((error) => {
        console.log("=== ERROR ===");
        console.log("Error:", error.response?.data);
        Alert.alert("Error", error.response?.data?.message || error.message);
      });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ padding: 40 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Add a New Student
        </Text>

        <TextInput
          value={studentId}
          onChangeText={setStudentId}
          style={styles.input}
          placeholder="Student ID"
        />
        <TextInput
          value={studentName}
          onChangeText={setStudentName}
          style={styles.input}
          placeholder="Student Name"
        />
        <TextInput
          value={rollNo}
          onChangeText={setRollNo}
          style={styles.input}
          placeholder="Roll Number"
        />
        <TextInput
          value={studentClass}
          onChangeText={setStudentClass}
          style={styles.input}
          placeholder="Class"
        />
        <TextInput
          value={section}
          onChangeText={setSection}
          style={styles.input}
          placeholder="Section (A, B, C)"
        />
        <TextInput
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
        />
        <TextInput
          value={gender}
          onChangeText={setGender}
          style={styles.input}
          placeholder="Gender (Male/Female/Other)"
        />

        <TextInput
          value={subjects}
          onChangeText={setSubjects}
          style={styles.input}
          placeholder="Subjects (comma separated)"
        />
        <TextInput
          value={hobbies}
          onChangeText={setHobbies}
          style={styles.input}
          placeholder="Hobbies (comma separated)"
        />
        <TextInput
          value={careerGoals}
          onChangeText={setCareerGoals}
          style={styles.input}
          placeholder="Career Goals"
        />
        <TextInput
          value={skillsToLearn}
          onChangeText={setSkillsToLearn}
          style={styles.input}
          placeholder="Skills to Learn (comma separated)"
        />
        <TextInput
          value={learningPace}
          onChangeText={setLearningPace}
          style={styles.input}
          placeholder="Learning Pace (slow, medium, fast)"
        />
        <TextInput
          value={learningStyle}
          onChangeText={setLearningStyle}
          style={styles.input}
          placeholder="Learning Style (visual, auditory, reading, kinesthetic)"
        />

        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Add Student
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddStudent;

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#ABCABA",
    padding: 12,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
  },
});