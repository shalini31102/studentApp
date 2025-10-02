// API Configuration
   export const API_BASE_URL = "http://192.170.0.79:8000";
   
   // For Android Emulator, use: "http://10.0.2.2:8000"
   // For Real Device, use your computer's IP: "http://192.168.x.x:8000"
   
   export const API_ENDPOINTS = {
     students: `${API_BASE_URL}/students`,
     addStudent: `${API_BASE_URL}/addStudent`,
     attendance: `${API_BASE_URL}/attendance`,
     attendanceReport: `${API_BASE_URL}/attendance-report-all-students`,
   };