const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Data storage (JSON file)
const DATA_FILE = path.join(__dirname, '..', 'data', 'students.json');
const LOGS_FILE = path.join(__dirname, '..', 'data', 'login-logs.json');

// Initialize data files
const initDataFiles = () => {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([
      { id: 1, name: "Ahmad Rifai", username: "ahmad.rifai", class: "XII IPA 1", active: true },
      { id: 2, name: "Siti Nurhaliza", username: "siti.nurhaliza", class: "XII IPA 1", active: true },
      { id: 3, name: "Budi Santoso", username: "budi.santoso", class: "XII IPA 2", active: true },
      { id: 4, name: "Dewi Lestari", username: "dewi.lestari", class: "XII IPS 1", active: true },
      { id: 5, name: "Eko Prasetyo", username: "eko.prasetyo", class: "XII IPS 2", active: true }
    ], null, 2));
  }
  
  if (!fs.existsSync(LOGS_FILE)) {
    fs.writeFileSync(LOGS_FILE, JSON.stringify([], null, 2));
  }
};

initDataFiles();

// Helper functions
const readStudents = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
};

const writeStudents = (students) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
};

const readLogs = () => {
  const data = fs.readFileSync(LOGS_FILE, 'utf8');
  return JSON.parse(data);
};

const writeLogs = (logs) => {
  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
};

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

// Record student login
app.post('/api/login-logs', (req, res) => {
  try {
    const logs = readLogs();
    const { studentId, studentName, username, timestamp, deviceInfo } = req.body;
    
    const newLog = {
      id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
      studentId,
      studentName,
      username,
      timestamp: timestamp || new Date().toISOString(),
      deviceInfo: deviceInfo || 'Unknown Device'
    };
    
    logs.push(newLog);
    writeLogs(logs);
    
    res.json({ success: true, data: newLog });
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
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Exam Admin API running on http://localhost:${PORT}`);
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}`);
  console.log(`🔌 API Endpoint: http://localhost:${PORT}/api`);
});

module.exports = app;
