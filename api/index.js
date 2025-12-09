const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (untuk Vercel serverless - data akan reset setiap deployment)
let studentsData = [
  { id: 1, name: "Ahmad Rifai", username: "ahmad.rifai", class: "XII IPA 1", active: true },
  { id: 2, name: "Siti Nurhaliza", username: "siti.nurhaliza", class: "XII IPA 1", active: true },
  { id: 3, name: "Budi Santoso", username: "budi.santoso", class: "XII IPA 2", active: true },
  { id: 4, name: "Dewi Lestari", username: "dewi.lestari", class: "XII IPS 1", active: true },
  { id: 5, name: "Eko Prasetyo", username: "eko.prasetyo", class: "XII IPS 2", active: true },
  { id: 6, name: "Rina Wati", username: "rina.wati", class: "XII IPA 1", active: true },
  { id: 7, name: "Joko Widodo", username: "joko.widodo", class: "XII IPA 2", active: true },
  { id: 8, name: "Maya Sari", username: "maya.sari", class: "XII IPS 1", active: true },
  { id: 9, name: "Agus Salim", username: "agus.salim", class: "XII IPS 2", active: true },
  { id: 10, name: "Putri Ayu", username: "putri.ayu", class: "XII IPA 1", active: true }
];

let loginLogs = [];
let activeSessions = {}; // { studentId: { deviceId, timestamp, sessionId } }

// Helper functions
const readStudents = () => studentsData;
const writeStudents = (students) => { studentsData = students; };
const readLogs = () => loginLogs;
const writeLogs = (logs) => { loginLogs = logs; };

// API Routes

// Get all students
app.get('/api/students', (req, res) => {
  try {
    const students = readStudents();
    const search = req.query.search?.toLowerCase() || '';
    
    let filtered = students;
    if (search) {
      filtered = students.filter(s => 
        s.name.toLowerCase().includes(search) || 
        s.username.toLowerCase().includes(search) ||
        s.class.toLowerCase().includes(search)
      );
    }
    
    res.json({ success: true, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get active students only (for APK)
app.get('/api/students/active', (req, res) => {
  try {
    const students = readStudents();
    const active = students.filter(s => s.active);
    res.json({ success: true, data: active });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single student
app.get('/api/students/:id', (req, res) => {
  try {
    const students = readStudents();
    const student = students.find(s => s.id === parseInt(req.params.id));
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new student
app.post('/api/students', (req, res) => {
  try {
    const students = readStudents();
    const { name, username, class: studentClass } = req.body;
    
    if (!name || !username || !studentClass) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Check duplicate username
    if (students.find(s => s.username === username)) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    const newStudent = {
      id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
      name,
      username,
      class: studentClass,
      active: true
    };
    
    students.push(newStudent);
    writeStudents(students);
    
    res.json({ success: true, data: newStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update student
app.put('/api/students/:id', (req, res) => {
  try {
    const students = readStudents();
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    const { name, username, class: studentClass, active } = req.body;
    
    // Check duplicate username (excluding current student)
    if (username && students.find((s, i) => s.username === username && i !== index)) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    students[index] = {
      ...students[index],
      name: name || students[index].name,
      username: username || students[index].username,
      class: studentClass || students[index].class,
      active: active !== undefined ? active : students[index].active
    };
    
    writeStudents(students);
    
    res.json({ success: true, data: students[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete student
app.delete('/api/students/:id', (req, res) => {
  try {
    const students = readStudents();
    const filtered = students.filter(s => s.id !== parseInt(req.params.id));
    
    if (filtered.length === students.length) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    writeStudents(filtered);
    
    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Record student login with session management
app.post('/api/login-logs', (req, res) => {
  try {
    const logs = readLogs();
    const { studentId, studentName, username, timestamp, deviceInfo, deviceId } = req.body;
    
    // Generate unique session ID
    const sessionId = `${studentId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if student already has active session on different device
    const existingSession = activeSessions[studentId];
    if (existingSession && existingSession.deviceId !== deviceId) {
      // Force logout previous device
      console.log(`Force logout student ${studentId} from device ${existingSession.deviceId}`);
    }
    
    // Create new session
    activeSessions[studentId] = {
      deviceId: deviceId || 'unknown',
      timestamp: new Date().toISOString(),
      sessionId: sessionId,
      studentName: studentName
    };
    
    const newLog = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      studentId,
      studentName,
      username,
      timestamp: timestamp || new Date().toISOString(),
      deviceInfo: deviceInfo || 'Unknown Device',
      deviceId: deviceId || 'unknown',
      sessionId: sessionId,
      action: 'login'
    };
    
    logs.push(newLog);
    writeLogs(logs);
    
    res.json({ 
      success: true, 
      data: newLog,
      sessionId: sessionId,
      lmsUrl: 'https://lms.mtsn2kebumen.sch.id/login/index.php'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get login logs
app.get('/api/login-logs', (req, res) => {
  try {
    const logs = readLogs();
    const limit = parseInt(req.query.limit) || 100;
    const filtered = logs.slice(-limit).reverse(); // Get latest logs
    
    res.json({ success: true, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check session status
app.post('/api/check-session', (req, res) => {
  try {
    const { studentId, deviceId, sessionId } = req.body;
    
    const activeSession = activeSessions[studentId];
    
    if (!activeSession) {
      return res.json({ 
        success: false, 
        active: false, 
        message: 'No active session' 
      });
    }
    
    // Check if this device's session is still active
    if (activeSession.sessionId === sessionId && activeSession.deviceId === deviceId) {
      return res.json({ 
        success: true, 
        active: true,
        session: activeSession
      });
    } else {
      return res.json({ 
        success: false, 
        active: false, 
        message: 'Session expired or logged in from another device',
        currentDevice: activeSession.deviceId
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Logout student
app.post('/api/logout', (req, res) => {
  try {
    const { studentId, sessionId, deviceId } = req.body;
    
    const activeSession = activeSessions[studentId];
    
    if (activeSession && activeSession.sessionId === sessionId) {
      delete activeSessions[studentId];
      
      // Log logout event
      const logs = readLogs();
      logs.push({
        id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
        studentId,
        studentName: activeSession.studentName,
        timestamp: new Date().toISOString(),
        deviceInfo: deviceId || 'unknown',
        deviceId: deviceId || 'unknown',
        sessionId: sessionId,
        action: 'logout'
      });
      writeLogs(logs);
      
      return res.json({ success: true, message: 'Logged out successfully' });
    }
    
    res.json({ success: false, message: 'No active session found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get active sessions
app.get('/api/active-sessions', (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: Object.entries(activeSessions).map(([studentId, session]) => ({
        studentId: parseInt(studentId),
        ...session
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get statistics
app.get('/api/stats', (req, res) => {
  try {
    const students = readStudents();
    const logs = readLogs();
    
    const stats = {
      totalStudents: students.length,
      activeStudents: students.filter(s => s.active).length,
      inactiveStudents: students.filter(s => !s.active).length,
      totalLogins: logs.length,
      todayLogins: logs.filter(l => {
        const logDate = new Date(l.timestamp).toDateString();
        const today = new Date().toDateString();
        return logDate === today;
      }).length
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// Serve admin dashboard
// Export for Vercel serverless
module.exports = app;

// Local development server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Exam Admin API running on http://localhost:${PORT}`);
    console.log(`📊 Admin Dashboard: http://localhost:${PORT}`);
    console.log(`🔌 API Endpoint: http://localhost:${PORT}/api`);
  });
}
