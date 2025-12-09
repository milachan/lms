# 🔐 Sistem Session Management

## 📋 Fitur Utama

### ✅ Yang Sudah Diimplementasi:

1. **Single Device Login**
   - Siswa hanya bisa login di 1 device pada satu waktu
   - Jika login di device baru, device lama otomatis logout

2. **Auto Logout**
   - Logout otomatis saat keluar dari aplikasi/WebView
   - Logout otomatis saat app masuk background
   - Logout otomatis saat tab/window ditutup

3. **Session Tracking**
   - Setiap login menghasilkan unique `sessionId`
   - Setiap device memiliki unique `deviceId` (persistent)
   - Session dicheck setiap 30 detik

4. **Redirect ke LMS**
   - Setelah login → redirect otomatis ke: `https://lms.mtsn2kebumen.sch.id/login/index.php`

5. **Admin Dashboard**
   - Tab baru: **🔐 Sesi Aktif**
   - Menampilkan siapa saja yang sedang login
   - Real-time monitoring

---

## 🔄 Flow Sistem

### 1. Login Process
```
Siswa pilih nama
  ↓
Generate Device ID (jika belum ada)
  ↓
POST /api/login-logs
  ↓
Server check: Apakah siswa sudah login di device lain?
  ↓
Jika YA → Force logout device lama
  ↓
Create new session
  ↓
Return sessionId + lmsUrl
  ↓
Save session ke localStorage
  ↓
Start session monitoring
  ↓
Redirect ke LMS: https://lms.mtsn2kebumen.sch.id/login/index.php
```

### 2. Session Monitoring (Every 30 seconds)
```
POST /api/check-session
  ↓
Server check: Apakah session masih aktif?
  ↓
Jika TIDAK (login di device lain) → Alert + Reload
  ↓
Jika YA → Continue
```

### 3. Logout Process
```
Event triggers:
- window.beforeunload (tutup tab/app)
- document.visibilitychange (app ke background)
  ↓
POST /api/logout
  ↓
Clear localStorage
  ↓
Stop session monitoring
```

---

## 🔌 API Endpoints Baru

### 1. POST `/api/login-logs`
**Request:**
```json
{
  "studentId": 1,
  "studentName": "Ahmad Rifai",
  "username": "ahmad.rifai",
  "deviceInfo": "Android 11 | Screen: 1080x2400",
  "deviceId": "device_1733712345_abc123xyz"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "sessionId": "1_1733712345_xyz789",
  "lmsUrl": "https://lms.mtsn2kebumen.sch.id/login/index.php"
}
```

### 2. POST `/api/check-session`
**Request:**
```json
{
  "studentId": 1,
  "deviceId": "device_1733712345_abc123xyz",
  "sessionId": "1_1733712345_xyz789"
}
```

**Response (Active):**
```json
{
  "success": true,
  "active": true,
  "session": {
    "deviceId": "device_1733712345_abc123xyz",
    "timestamp": "2025-12-09T10:30:00.000Z",
    "sessionId": "1_1733712345_xyz789",
    "studentName": "Ahmad Rifai"
  }
}
```

**Response (Expired):**
```json
{
  "success": false,
  "active": false,
  "message": "Session expired or logged in from another device",
  "currentDevice": "device_1733712999_def456uvw"
}
```

### 3. POST `/api/logout`
**Request:**
```json
{
  "studentId": 1,
  "sessionId": "1_1733712345_xyz789",
  "deviceId": "device_1733712345_abc123xyz"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 4. GET `/api/active-sessions`
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "studentId": 1,
      "deviceId": "device_1733712345_abc123xyz",
      "timestamp": "2025-12-09T10:30:00.000Z",
      "sessionId": "1_1733712345_xyz789",
      "studentName": "Ahmad Rifai"
    },
    {
      "studentId": 5,
      "deviceId": "device_1733712888_ghi789klm",
      "timestamp": "2025-12-09T10:35:00.000Z",
      "sessionId": "5_1733712888_mno456",
      "studentName": "Eko Prasetyo"
    }
  ]
}
```

---

## 📱 Integrasi dengan APK

### Langkah 1: Modifikasi HOME Activity
File: `EXAMBROWSER_decoded/smali/org/niotron/tmnnkhayalgurukoding/cbt1/HOME.smali`

Cari method `CardEUJIAN1$Click` (tombol E-Ujian), tambahkan kode untuk load WebView:

```smali
# Load login page in WebView
new-instance v0, Landroid/webkit/WebView;
invoke-direct {v0, p0}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V

# Enable JavaScript
invoke-virtual {v0}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;
move-result-object v1
const/4 v2, 0x1
invoke-virtual {v1, v2}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V

# Set WebViewClient untuk detect logout
new-instance v3, LLogoutWebViewClient;
invoke-direct {v3}, LLogoutWebViewClient;-><init>()V
invoke-virtual {v0, v3}, Landroid/webkit/WebView;->setWebViewClient(Landroid/webkit/WebViewClient;)V

# Load URL
const-string v4, "https://lms-lens-projects-e9cc8729.vercel.app/login.html"
invoke-virtual {v0, v4}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
```

### Langkah 2: Create Custom WebViewClient
Buat file baru: `EXAMBROWSER_decoded/smali/LogoutWebViewClient.smali`

```smali
.class public LLogoutWebViewClient;
.super Landroid/webkit/WebViewClient;

.method public onPageFinished(Landroid/webkit/WebView;Ljava/lang/String;)V
    # Inject JavaScript untuk detect page unload
    const-string v0, "javascript:(function() { window.addEventListener('beforeunload', function() { logout(); }); })()"
    invoke-virtual {p1, v0}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
    
    return-void
.end method

.method public shouldOverrideUrlLoading(Landroid/webkit/WebView;Ljava/lang/String;)Z
    # Jika URL = LMS, load di WebView yang sama
    const-string v0, "https://lms.mtsn2kebumen.sch.id"
    invoke-virtual {p2, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z
    move-result v1
    
    if-eqz v1, :cond_0
    
    # Load LMS URL
    invoke-virtual {p1, p2}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
    const/4 v2, 0x1
    return v2
    
    :cond_0
    const/4 v2, 0x0
    return v2
.end method
```

### Langkah 3: Handle Back Button
Override `onBackPressed()` di HOME activity untuk logout:

```smali
.method public onBackPressed()V
    # Panggil logout JavaScript
    iget-object v0, p0, LHOME;->webView:Landroid/webkit/WebView;
    const-string v1, "javascript:logout()"
    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
    
    # Tunggu 500ms untuk logout selesai
    const-wide/16 v2, 500
    invoke-static {v2, v3}, Ljava/lang/Thread;->sleep(J)V
    
    # Close activity
    invoke-virtual {p0}, LHOME;->finish()V
    
    return-void
.end method
```

---

## 🧪 Testing

### Test 1: Single Device Login
1. Login dengan nama "Ahmad Rifai" di HP1
2. Login dengan nama "Ahmad Rifai" di HP2
3. **Expected:** HP1 otomatis logout (alert + reload)

### Test 2: Auto Logout
1. Login dengan nama "Siti Nurhaliza"
2. Tekan tombol back / keluar dari aplikasi
3. Buka aplikasi lagi
4. **Expected:** Harus login ulang (session sudah terhapus)

### Test 3: Session Monitoring
1. Login dengan nama "Budi Santoso" di HP1
2. Tunggu 30 detik (session check berjalan)
3. Login dengan nama "Budi Santoso" di HP2
4. **Expected:** HP1 dalam 30 detik akan detect session expired

### Test 4: Redirect ke LMS
1. Login dengan nama siswa
2. Klik "Lanjutkan ke Ujian →"
3. **Expected:** Redirect ke `https://lms.mtsn2kebumen.sch.id/login/index.php`

### Test 5: Admin Dashboard
1. Buka: https://lms-lens-projects-e9cc8729.vercel.app/
2. Klik tab **"🔐 Sesi Aktif"**
3. **Expected:** Muncul list siswa yang sedang login dengan device ID

---

## ⚙️ Konfigurasi

### Ubah URL LMS
Edit `public/login.html` line 280:
```javascript
const LMS_URL = 'https://lms.mtsn2kebumen.sch.id/login/index.php';
```

### Ubah Interval Session Check
Edit `public/login.html` line 432:
```javascript
sessionCheckInterval = setInterval(async () => {
    await checkSessionStatus();
}, 30000); // 30 seconds (ubah sesuai kebutuhan)
```

### Disable Auto Logout on Background
Edit `public/login.html` line 497 (comment out):
```javascript
// document.addEventListener('visibilitychange', () => {
//     if (document.hidden) {
//         logout();
//     }
// });
```

---

## 📊 Database Schema (In-Memory)

### activeSessions
```javascript
{
  1: {  // studentId
    deviceId: "device_1733712345_abc123xyz",
    timestamp: "2025-12-09T10:30:00.000Z",
    sessionId: "1_1733712345_xyz789",
    studentName: "Ahmad Rifai"
  },
  5: { ... }
}
```

### loginLogs
```javascript
[
  {
    id: 1,
    studentId: 1,
    studentName: "Ahmad Rifai",
    username: "ahmad.rifai",
    timestamp: "2025-12-09T10:30:00.000Z",
    deviceInfo: "Android 11 | Screen: 1080x2400",
    deviceId: "device_1733712345_abc123xyz",
    sessionId: "1_1733712345_xyz789",
    action: "login"  // "login" or "logout"
  }
]
```

---

## 🔄 Upgrade ke Database Persistent

Untuk production, disarankan upgrade ke database (PostgreSQL/MySQL/MongoDB):

### Option 1: Vercel Postgres
```bash
npm install @vercel/postgres
```

### Option 2: Supabase
```bash
npm install @supabase/supabase-js
```

### Option 3: MongoDB Atlas
```bash
npm install mongodb
```

---

## 📝 Changelog

**v2.0.0 (2025-12-09)**
- ✅ Add session management system
- ✅ Single device login enforcement
- ✅ Auto logout on app exit/background
- ✅ Session monitoring every 30 seconds
- ✅ Redirect to LMS after login
- ✅ Admin dashboard: Active sessions tab
- ✅ Device ID generation & persistence
- ✅ Force logout previous device on new login

---

**Status:** ✅ Ready for Testing  
**Next:** Integrate dengan APK dan test di real device
