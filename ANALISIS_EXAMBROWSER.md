# ANALISIS APK: EXAMBROWSER MTsN 2 KBM

## 📱 INFORMASI UMUM APLIKASI

### Detail Aplikasi
- **Nama Aplikasi**: EXAMBROWSER MTsN 2 KBM
- **Package Name**: `exam.rdeveloper.mtsn2kebumen`
- **Versi**: 9.5 (Version Code: 1)
- **Target SDK**: Android 13 (API Level 33)
- **Min SDK**: Android 5.0 Lollipop (API Level 21)
- **Ukuran APK**: ~16 MB total
  - classes.dex: 8.89 MB
  - classes2.dex: 5.01 MB
  - Resources: 886 KB

---

## 🔧 FRAMEWORK & TEKNOLOGI

### Platform Pengembangan
Aplikasi ini dikembangkan menggunakan **Niotron** (App Inventor-based platform):
- Base Package: `com.niotron.muhammad_robi1996.EXAMBROWSERMTsN2KBM`
- Framework: Google App Inventor Components Runtime
- MultiDex Support: Enabled

### Library Utama yang Digunakan
- **Google ZXing**: QR Code scanner
- **AndroidX**: Material Design, AppCompat, Core libraries
- **Apache HTTP Legacy**: HTTP networking

---

## 🎯 FITUR APLIKASI

### Screens/Activities (15 Activities)
1. **Screen1** - Main launcher screen
2. **HOME** - Halaman utama aplikasi
3. **HOMEPRIORITAS** - Halaman home prioritas
4. **CBT1** - Computer Based Test 1
5. **CBT2** - Computer Based Test 2
6. **CBT_ADV** - Advanced CBT
7. **URL** - URL browser
8. **URL_ADV** - Advanced URL browser
9. **QRSCREEN** - QR scanner screen
10. **QR_ADV** - Advanced QR features
11. **DETECTBLUETOOTH** - Bluetooth detection
12. **FRTRCTHEADSET** - Headset detection/tracker
13. **KONFIRMASIFLOAT** - Floating confirmation
14. **DEVELOPER** - Developer settings
15. **ADMIN** - Admin panel
16. **test** - Test screen

### Fungsi QR Code
- Integration dengan ZXing barcode scanner
- Activity: `com.google.zxing.client.android.AppInvCaptureActivity`
- Mode landscape, fullscreen, no title bar

---

## 🔐 PERMISSIONS (IZIN APLIKASI)

### Permissions yang Diminta:
1. ✅ **INTERNET** - Akses internet untuk ujian online
2. ✅ **CAMERA** - Untuk scan QR code
3. ✅ **BLUETOOTH** & **BLUETOOTH_ADMIN** - Deteksi koneksi bluetooth
4. ✅ **VIBRATE** - Getaran untuk notifikasi
5. ✅ **SYSTEM_ALERT_WINDOW** - Overlay window untuk mencegah keluar aplikasi
6. ✅ **ACTION_MANAGE_OVERLAY_PERMISSION** - Permission untuk overlay
7. ✅ **ACCESS_NOTIFICATION_POLICY** - Akses notifikasi
8. ✅ **MODIFY_AUDIO_SETTINGS** - Modifikasi setting audio
9. ✅ **READ_EXTERNAL_STORAGE** - Baca storage (legacy)
10. ✅ **WRITE_EXTERNAL_STORAGE** - Tulis storage (max SDK 29)
11. ✅ **WRITE_SETTINGS** - Tulis system settings

### ⚠️ Analisis Keamanan Permissions:
- **SYSTEM_ALERT_WINDOW** - Dapat membuat overlay yang mencegah user keluar dari aplikasi (lockdown browser)
- **BLUETOOTH** - Mendeteksi perangkat bluetooth yang terkoneksi (mencegah cheating via earphone)
- **CAMERA** - Untuk QR authentication
- **INTERNET** - Wajib untuk ujian online

---

## 🏗️ STRUKTUR APLIKASI

### Assets (File-file dalam aplikasi):
- **Fonts**: FontAwesome, Material Icons
  - `fa-brands-400.ttf`, `fa-regular-400.ttf`, `fa-solid-900.ttf`
  - `MaterialIcons-Regular.ttf`
  - `fontawesome-webfont.ttf`

- **Images**: Icons dan UI images
  - `512.png`, `H1.png`, `H2.png`, `H3.png`
  - Educational icons
  - `qr_code.png`, `school.png`
  - Theme-related: `sunl.png`, `moonl.png`, `sunmoon.png`

- **Audio**:
  - `alert.mp3` - Sound alert/notification

- **Animation**:
  - `animation_lndeobf2.json` - Lottie animation

### Resources:
- Material Design components
- Multiple drawable resources (hdpi, mdpi, xhdpi, xxhdpi, xxxhdpi)
- Layouts untuk berbagai screen sizes
- Animations & color resources
- Night mode support (`color-night-v8`)

---

## 🔒 FITUR KEAMANAN UJIAN

### Lockdown Browser Features:
Berdasarkan permissions dan nama activities, aplikasi ini memiliki fitur:

1. **Overlay Protection** - Mencegah user keluar dari aplikasi saat ujian
2. **Bluetooth Detection** - Mendeteksi earphone/headset (anti-cheating)
3. **QR Authentication** - Login/validasi via QR code
4. **Floating Confirmation** - Alert floating yang tidak bisa ditutup
5. **Priority Mode** - Mode ujian prioritas dengan pembatasan akses

### Network Security:
- Custom `network_security_config.xml`
- Support HTTPS/secure connections

---

## 📦 FILE PROVIDER

```xml
Authority: exam.rdeveloper.mtsn2kebumen.provider
Provider: androidx.core.content.FileProvider
```
Untuk sharing files secara aman antar aplikasi.

---

## 🎨 THEMING & UI

- **App Theme**: `@style/AppTheme`
- **Material Design**: Extensive material components
- **Icon**: Adaptive icon dengan foreground/background
- **Night Mode**: Dark theme support
- **Responsive**: Support multiple screen sizes dan orientations

---

## 📊 ANALISIS KODE

### Komponen Utama (dari smali):
- **Android Support Libraries**: androidx.*, support.*
- **Material Components**: Material Design 3
- **Architecture Components**: ViewModel, LiveData
- **Constraint Layout**: Modern layout system
- **Card View & RecyclerView**: List/grid components
- **Coordinator Layout**: Complex scrolling behaviors
- **Fragment Navigation**: Multi-screen navigation

### Code Statistics:
- **Total DEX files**: 2 (classes.dex, classes2.dex)
- **Total Code Size**: ~14 MB
- **Resource Size**: ~886 KB

---

## 🎓 PENGGUNAAN APLIKASI

Aplikasi ini adalah **Safe Exam Browser** untuk:
- MTsN 2 Kebumen (Madrasah Tsanawiyah Negeri 2 Kebumen)
- Computer Based Test (CBT)
- Ujian online dengan sistem keamanan

### Fitur Keamanan untuk Ujian:
✅ Lockdown mode - tidak bisa keluar aplikasi  
✅ Deteksi bluetooth/earphone  
✅ QR code authentication  
✅ Overlay alert system  
✅ Admin panel untuk pengawas  
✅ Developer mode untuk troubleshooting  

---

## 🔍 TEMUAN TAMBAHAN

### Developer:
- Username: `muhammad_robi1996`
- Platform: Niotron (App Inventor variant)
- Nama package developer: `com.niotron.muhammad_robi1996`

### Keunggulan:
✅ UI Modern dengan Material Design  
✅ Support dark mode  
✅ Responsive untuk berbagai ukuran layar  
✅ Fitur keamanan ujian yang lengkap  
✅ QR code integration  
✅ Bluetooth detection anti-cheating  

### Kelemahan Potensial:
⚠️ Permissions yang sangat luas (overlay, settings)  
⚠️ Bisa membuat device "terkunci" saat ujian  
⚠️ Memerlukan permission khusus dari user  

---

## 📝 KESIMPULAN

**EXAMBROWSER MTsN 2 KBM** adalah aplikasi ujian online yang dikembangkan khusus untuk MTsN 2 Kebumen dengan fokus pada:

1. **Keamanan Ujian** - Mencegah cheating dengan lockdown browser
2. **User Experience** - Material Design, modern UI
3. **Flexibility** - Multiple exam modes (CBT1, CBT2, URL-based)
4. **Authentication** - QR code untuk login aman
5. **Monitoring** - Admin panel untuk pengawas ujian

Aplikasi ini cocok digunakan untuk ujian resmi dengan pengawasan, namun memerlukan permission khusus yang harus disetujui oleh user.

---

**Analisis dibuat pada**: 9 Desember 2025  
**Versi APK yang dianalisis**: 9.5 (exam.rdeveloper.mtsn2kebumen)
