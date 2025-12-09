# 🔒 Exam Lock System - Dokumentasi Lengkap

## 📋 Overview

Sistem **Exam Lock** memungkinkan admin untuk mengunci aplikasi ujian sehingga siswa **TIDAK BISA KELUAR** dari aplikasi sampai waktu ujian selesai, kecuali dengan **password darurat**.

---

## ✨ Fitur Utama

### 1. **⏰ Jadwal Ujian**
- Admin set waktu mulai & selesai ujian
- Auto-lock saat waktu mulai tiba
- Auto-unlock saat waktu selesai

### 2. **🔒 Kunci Aplikasi**
- **Disable tombol Back** - siswa tidak bisa keluar
- **Disable tombol Refresh** - tidak bisa reload halaman
- **Disable keyboard shortcuts** (F5, Ctrl+R, Ctrl+W, Alt+F4)
- **Disable right-click menu**

### 3. **🔑 Password Darurat**
- Admin set password untuk keluar paksa
- Siswa bisa gunakan jika ada masalah teknis
- Setiap penggunaan tercatat di log

### 4. **📊 Admin Dashboard**
- Tab baru: **🔒 Kunci Ujian**
- Status real-time ujian (aktif/terkunci/tidak terkunci)
- Quick lock/unlock button
- Timer countdown waktu tersisa
- Form konfigurasi lengkap

### 5. **⚙️ Opsi Fleksibel**
- Toggle: Izinkan refresh halaman
- Toggle: Izinkan tombol back
- Nama ujian custom
- Password darurat dapat diubah

---

## 🎯 Cara Kerja

### Flow Diagram:

```
┌─ ADMIN SETUP ─────────────────────────────┐
│                                            │
│  1. Buka Admin Dashboard                  │
│  2. Klik tab "🔒 Kunci Ujian"             │
│  3. Isi form:                              │
│     - Nama ujian                           │
│     - Waktu mulai & selesai                │
│     - Password darurat                     │
│     - Toggle allow refresh/back            │
│  4. Klik "💾 Simpan Konfigurasi"          │
│  5. Status otomatis: TERKUNCI             │
│                                            │
└────────────────────────────────────────────┘
              ↓
┌─ SAAT WAKTU MULAI TIBA ───────────────────┐
│                                            │
│  Server check setiap menit:                │
│  - Jika now >= startTime → isActive=true  │
│  - Client fetch /api/exam-config          │
│  - Jika isActive → Init exam lock         │
│                                            │
└────────────────────────────────────────────┘
              ↓
┌─ SISWA LOGIN ─────────────────────────────┐
│                                            │
│  1. Login.html load exam config            │
│  2. Jika isActive=true → Init lock:        │
│     ✅ Disable back button                │
│     ✅ Disable refresh                    │
│     ✅ Disable keyboard shortcuts         │
│     ✅ Disable right-click                │
│  3. Siswa tidak bisa keluar!               │
│                                            │
└────────────────────────────────────────────┘
              ↓
┌─ SAAT SISWA COBA KELUAR ──────────────────┐
│                                            │
│  Event: Back button pressed                │
│  ↓                                         │
│  Alert: "🔒 Ujian sedang berlangsung"     │
│  Prompt: "Masukkan password darurat:"     │
│  ↓                                         │
│  POST /api/verify-emergency-password      │
│  ↓                                         │
│  IF password benar → Logout & Exit        │
│  IF password salah → Stay locked          │
│                                            │
└────────────────────────────────────────────┘
              ↓
┌─ SAAT WAKTU SELESAI ──────────────────────┐
│                                            │
│  Server check:                             │
│  - Jika now >= endTime → isActive=false   │
│  - Client auto-refresh config             │
│  - Remove all lock event listeners        │
│  - Siswa bisa keluar normal               │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### 1. GET `/api/exam-config`
**Deskripsi:** Get konfigurasi ujian dan status

**Response:**
```json
{
  "success": true,
  "data": {
    "isLocked": true,
    "examName": "Ujian Tengah Semester Gasal 2025",
    "startTime": "2025-12-09T08:00:00.000Z",
    "endTime": "2025-12-09T10:00:00.000Z",
    "emergencyPassword": "admin123",
    "allowRefresh": false,
    "allowBack": false,
    "isActive": true,
    "currentTime": "2025-12-09T08:30:00.000Z"
  }
}
```

### 2. PUT `/api/exam-config`
**Deskripsi:** Update konfigurasi ujian

**Request:**
```json
{
  "isLocked": true,
  "examName": "Ujian Akhir Semester",
  "startTime": "2025-12-15T08:00:00.000Z",
  "endTime": "2025-12-15T10:00:00.000Z",
  "emergencyPassword": "darurat2025",
  "allowRefresh": false,
  "allowBack": false
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Konfigurasi ujian berhasil diupdate"
}
```

### 3. POST `/api/verify-emergency-password`
**Deskripsi:** Verify password darurat untuk keluar paksa

**Request:**
```json
{
  "password": "admin123"
}
```

**Response (Benar):**
```json
{
  "success": true,
  "verified": true,
  "message": "Password darurat benar"
}
```

**Response (Salah):**
```json
{
  "success": false,
  "verified": false,
  "message": "Password darurat salah"
}
```

### 4. POST `/api/exam-lock`
**Deskripsi:** Quick lock/unlock ujian tanpa ubah config

**Request:**
```json
{
  "action": "lock"  // or "unlock"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Ujian berhasil dikunci"
}
```

---

## 🖥️ Admin Dashboard - Cara Pakai

### Akses Dashboard:
```
https://lms-lens-projects-e9cc8729.vercel.app/
```

### Tab "🔒 Kunci Ujian":

**1. Status Card (Atas)**
- 🟢 **Hijau** = Ujian tidak terkunci (siswa bisa keluar)
- 🟡 **Kuning** = Ujian terjadwal tapi belum dimulai
- 🔴 **Merah** = Ujian sedang berlangsung (locked)
- **Quick Lock Button** = Toggle cepat lock/unlock

**2. Form Konfigurasi:**
- **Nama Ujian:** Misal "Ujian Tengah Semester Gasal 2025"
- **Waktu Mulai:** Pilih tanggal & jam (format: 2025-12-09 08:00)
- **Waktu Selesai:** Pilih tanggal & jam (format: 2025-12-09 10:00)
- **Password Darurat:** Min 6 karakter (misal: "darurat123")
- **Checkbox Izinkan Refresh:** ☑️ Jika siswa boleh refresh
- **Checkbox Izinkan Back:** ☑️ Jika siswa boleh tekan back

**3. Timer (Jika Ujian Aktif):**
- Countdown real-time
- Format: `02:15:30 tersisa`
- Auto update setiap detik

---

## 📱 Client Side - Login Page

### Fitur Lock yang Aktif:

**1. Disable Back Button:**
```javascript
// Saat siswa tekan back:
window.addEventListener('popstate', preventBack);

// Muncul prompt password darurat
prompt('Masukkan password darurat jika ada masalah:')
```

**2. Disable Refresh:**
```javascript
// Saat siswa coba refresh (Ctrl+R, F5):
window.addEventListener('beforeunload', preventRefresh);

// Alert: "Refresh dinonaktifkan selama ujian"
```

**3. Disable Keyboard Shortcuts:**
- **F5** → Refresh (disabled)
- **Ctrl+R** → Refresh (disabled)
- **Ctrl+W** → Close tab (disabled)
- **Alt+F4** → Close window (disabled)
- **Ctrl+Q** → Quit (disabled)

**4. Disable Right-Click:**
```javascript
document.addEventListener('contextmenu', e => e.preventDefault());
```

---

## 🧪 Testing Scenarios

### Test 1: Setup Exam
1. Buka Admin Dashboard
2. Klik tab "🔒 Kunci Ujian"
3. Isi form:
   - Nama: "Test Ujian"
   - Start: Hari ini, 10 menit dari sekarang
   - End: 30 menit dari sekarang
   - Password: "test123"
   - Uncheck semua checkbox
4. Klik "Simpan"
5. **Expected:** Status jadi "TERJADWAL (TERKUNCI)"

### Test 2: Exam Active - Lock Functionality
1. Tunggu sampai waktu mulai
2. Refresh page
3. **Expected:** Status jadi "UJIAN SEDANG BERLANGSUNG"
4. Buka login page di tab baru
5. Login dengan nama siswa
6. Coba tekan **Back button**
7. **Expected:** Muncul prompt password darurat
8. Coba tekan **F5**
9. **Expected:** Alert "Refresh dinonaktifkan"
10. Coba tekan **Ctrl+W**
11. **Expected:** Alert "Tidak dapat menutup tab"

### Test 3: Emergency Password
1. Saat locked, tekan back button
2. Masukkan password salah "xxx"
3. **Expected:** Alert "Password salah", tetap locked
4. Tekan back lagi
5. Masukkan password benar "test123"
6. **Expected:** Alert "Password benar", logout & keluar

### Test 4: Quick Lock/Unlock
1. Buka Admin Dashboard
2. Klik "🔓 Buka Kunci" button
3. Confirm dialog
4. **Expected:** Status jadi "TIDAK TERKUNCI"
5. Siswa bisa keluar normal
6. Klik "🔒 Kunci Ujian" button
7. **Expected:** Status jadi "TERKUNCI"

### Test 5: Auto Unlock After End Time
1. Tunggu sampai waktu selesai
2. Timer menunjukkan "UJIAN SELESAI"
3. Refresh login page
4. **Expected:** Lock disabled, siswa bisa keluar

---

## 🔧 Konfigurasi

### Ubah Default Password:
Edit `api/index.js` line 29:
```javascript
emergencyPassword: "admin123",  // Ubah ini
```

### Ubah Nama Ujian Default:
```javascript
examName: "Ujian Tengah Semester",  // Ubah ini
```

### Ubah Interval Check Config:
Login.html akan auto-load config saat page load. Jika ingin periodic check:
```javascript
setInterval(() => {
  loadExamConfig();
}, 60000); // Check setiap 1 menit
```

---

## ⚠️ Important Notes

### 1. **In-Memory Storage**
Konfigurasi ujian disimpan di **memory** (bukan database). Artinya:
- ❌ Reset saat Vercel restart
- ❌ Tidak persistent antar deployment
- ✅ Untuk production, upgrade ke database (PostgreSQL/MongoDB)

### 2. **Client-Side Lock**
Lock bekerja di **client-side** (browser). User teknis bisa bypass dengan:
- Disable JavaScript
- Open DevTools dan hapus event listeners
- **Solusi:** Gunakan APK untuk native control (lihat APK Integration)

### 3. **Time Sync**
Pastikan waktu server & client sync:
- Server menggunakan ISO timestamp
- Client convert ke local timezone
- Beda timezone bisa buat lock tidak tepat waktu

### 4. **Emergency Password**
Password disimpan **plain text** (tidak di-hash). Untuk security:
- Gunakan password unik per ujian
- Jangan share ke siswa
- Ganti setelah ujian selesai

---

## 🚀 Upgrade untuk Production

### 1. **Database Integration**
Ganti in-memory storage dengan database:

```javascript
// Install
npm install @vercel/postgres

// api/index.js
import { sql } from '@vercel/postgres';

// Save config
await sql`
  INSERT INTO exam_config (exam_name, start_time, end_time, password)
  VALUES (${examName}, ${startTime}, ${endTime}, ${password})
`;
```

### 2. **Hash Password**
```javascript
// Install
npm install bcrypt

// Hash password
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

// Verify
const match = await bcrypt.compare(inputPassword, hashedPassword);
```

### 3. **APK Native Lock**
Implement di APK untuk lock yang lebih kuat:
- Override `onBackPressed()` di HOME.smali
- Disable hardware back button
- Show password dialog native Android
- Force kill app jika password salah 3x

---

## 📄 Files Modified

1. **`api/index.js`**
   - Added `examConfig` storage
   - Added 4 new endpoints (exam-config, verify-password, exam-lock)

2. **`public/index.html`**
   - Added "🔒 Kunci Ujian" tab
   - Added exam config form
   - Added timer countdown
   - Added quick lock/unlock button

3. **`public/login.html`**
   - Added `loadExamConfig()` function
   - Added `initExamLock()` function
   - Added back button prevention
   - Added refresh prevention
   - Added keyboard shortcuts block
   - Added emergency password verification

---

## 🎓 Use Cases

### Scenario 1: Ujian Harian
```
Waktu: 07:00 - 08:00
Duration: 1 jam
Password: "harian123"
Allow Refresh: ❌
Allow Back: ❌
```

### Scenario 2: Ujian Tengah Semester
```
Waktu: 08:00 - 10:00
Duration: 2 jam
Password: "uts2025"
Allow Refresh: ❌
Allow Back: ❌
```

### Scenario 3: Try Out (Practice Mode)
```
Waktu: 13:00 - 15:00
Duration: 2 jam
Password: "tryout"
Allow Refresh: ✅ (Boleh refresh)
Allow Back: ✅ (Boleh keluar)
```

---

## 📊 Statistics & Monitoring

### Tracked Events:
- Emergency password usage (logged)
- Lock/unlock actions (logged)
- Config updates (with timestamp)

### Future Enhancements:
- Dashboard graph: Berapa siswa aktif saat ujian
- Alert: Email ke admin jika ada emergency exit
- Auto-lock 5 menit sebelum ujian mulai
- SMS notification ke siswa

---

## ✅ Checklist Deployment

- [x] Backend API endpoints created
- [x] Admin dashboard UI implemented
- [x] Client-side lock implemented
- [x] Emergency password system working
- [x] Timer countdown functional
- [x] Quick lock/unlock button
- [x] Documentation complete
- [ ] Database integration (for production)
- [ ] Password hashing (for security)
- [ ] APK native lock (for stronger control)

---

**Created:** December 9, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready for Testing
