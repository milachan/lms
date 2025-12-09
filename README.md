# EXAMBROWSER Admin Dashboard

API & Admin Dashboard untuk manajemen siswa dan monitoring aktivitas login EXAMBROWSER.

---

## 📚 DOCUMENTATION INDEX

**🚀 Quick Start:**
- [`CHECKLIST.md`](./CHECKLIST.md) - Complete deployment checklist
- [`quick-start.bat`](./quick-start.bat) - Test local dengan 1 click

**📖 Main Docs:**
1. [`README.md`](./README.md) - This file (Overview & API docs)
2. [`DEPLOY_INSTRUCTIONS.md`](./DEPLOY_INSTRUCTIONS.md) - Cara deploy ke Vercel (3 methods)
3. [`APK_INTEGRATION.md`](./APK_INTEGRATION.md) - Cara integrate dengan APK
4. [`FINAL_SUMMARY.md`](./FINAL_SUMMARY.md) - Complete summary & next steps

**🛠️ Helper Scripts:**
- `quick-start.bat` - Test server local
- `update-api-url.bat` - Update API URL setelah deploy

---

## 🚀 Features

- ✅ CRUD Data Siswa (Create, Read, Update, Delete)
- ✅ Search & Filter Siswa
- ✅ Aktivasi/Nonaktifkan Siswa
- ✅ Log Aktivitas Login Real-time
- ✅ Dashboard Statistik
- ✅ RESTful API
- ✅ Responsive UI

## 📦 Tech Stack

- **Backend**: Node.js + Express
- **Database**: JSON File Storage (upgradeable ke PostgreSQL/MongoDB)
- **Frontend**: HTML + CSS + Vanilla JS
- **Deployment**: Vercel Serverless

## 🔌 API Endpoints

### Students
- `GET /api/students` - Get all students (with search)
- `GET /api/students/active` - Get active students only
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Logs
- `POST /api/login-logs` - Record student login
- `GET /api/login-logs` - Get login logs

### Stats
- `GET /api/stats` - Get statistics

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run server
npm run dev
```

Server akan berjalan di: http://localhost:3000

## 🌐 Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📱 Integrasi dengan APK

APK akan menggunakan endpoint berikut:

1. **GET /api/students/active** - Untuk mendapatkan list siswa aktif
2. **POST /api/login-logs** - Untuk mencatat login siswa

Contoh payload login:
```json
{
  "studentId": 1,
  "studentName": "Ahmad Rifai",
  "username": "ahmad.rifai",
  "timestamp": "2025-12-09T10:30:00Z",
  "deviceInfo": "Android 13, Xiaomi Redmi Note 12"
}
```

## 📊 Default Data

API sudah include 5 siswa default:
1. Ahmad Rifai (XII IPA 1)
2. Siti Nurhaliza (XII IPA 1)
3. Budi Santoso (XII IPA 2)
4. Dewi Lestari (XII IPS 1)
5. Eko Prasetyo (XII IPS 2)

## 🔒 Security Note

Untuk production, tambahkan:
- Authentication (JWT)
- HTTPS
- Rate limiting
- Input validation
- Database proper (PostgreSQL/MongoDB)

## 📝 License

MIT
