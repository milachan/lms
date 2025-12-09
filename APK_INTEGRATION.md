# 📱 INTEGRASI APK DENGAN LOGIN SISWA

Panduan lengkap untuk mengintegrasikan EXAMBROWSER APK dengan sistem login siswa berbasis web.

---

## 🎯 Arsitektur Sistem

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   APK Android   │─────►│  Vercel Web App  │─────►│  JSON Database  │
│   (WebView)     │◄─────│  (API + Login)   │◄─────│  (Students)     │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

**Flow:**
1. User buka APK → Klik "E-Ujian"
2. APK load WebView dengan URL: `https://your-app.vercel.app/login.html`
3. User pilih nama dari list
4. Login dicatat ke API
5. Redirect ke menu ujian (CBT1/CBT2)

---

## 📋 OPSI 1: Menggunakan WebView (TERMUDAH)

### Step 1: Deploy ke Vercel

```bash
cd exam-admin
vercel --prod
```

Simpan URL yang didapat, contoh: `https://exam-admin-abc123.vercel.app`

### Step 2: Modifikasi APK - Ubah CardEUJIAN1 Click

Buka file: `EXAMBROWSER_decoded/smali_classes2/com/niotron/muhammad_robi1996/EXAMBROWSERMTsN2KBM/HOME.smali`

**Cari method** (sekitar line 19595):
```smali
.method public CardEUJIAN1$Click()Ljava/lang/Object;
    .locals 4

    .line 596
    invoke-static {}, Lcom/google/youngandroid/runtime;->setThisForm()V

    .line 597
    sget-object v0, Lcom/google/youngandroid/runtime;->open$Mnanother$Mnscreen:Lgnu/expr/ModuleMethod;

    const-string v1, "CBT1"

    invoke-static {v1}, Lgnu/lists/LList;->list1(Ljava/lang/Object;)Lgnu/lists/Pair;

    move-result-object v1

    sget-object v2, Lcom/niotron/muhammad_robi1996/EXAMBROWSERMTsN2KBM/HOME;->Lit227:Lgnu/lists/PairWithPosition;

    const-string v3, "open another screen"

    invoke-static {v0, v1, v2, v3}, Lcom/google/youngandroid/runtime;->callYailPrimitive(Ljava/lang/Object;Ljava/lang/Object;Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    return-object v0
.end method
```

**Ganti dengan** (load WebView login page):
```smali
.method public CardEUJIAN1$Click()Ljava/lang/Object;
    .locals 4

    .line 596
    invoke-static {}, Lcom/google/youngandroid/runtime;->setThisForm()V

    .line 597
    sget-object v0, Lcom/google/youngandroid/runtime;->open$Mnanother$Mnscreen:Lgnu/expr/ModuleMethod;

    const-string v1, "LoginSiswa"

    invoke-static {v1}, Lgnu/lists/LList;->list1(Ljava/lang/Object;)Lgnu/lists/Pair;

    move-result-object v1

    sget-object v2, Lcom/niotron/muhammad_robi1996/EXAMBROWSERMTsN2KBM/HOME;->Lit227:Lgnu/lists/PairWithPosition;

    const-string v3, "open another screen"

    invoke-static {v0, v1, v2, v3}, Lcom/google/youngandroid/runtime;->callYailPrimitive(Ljava/lang/Object;Ljava/lang/Object;Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    return-object v0
.end method
```

### Step 3: Buat Screen LoginSiswa

Karena kompleksitas membuat screen baru di Smali, ada 2 opsi:

#### Opsi A: Modifikasi CBT1 Screen (RECOMMENDED)

1. **Copy CBT1.smali → LoginSiswa.smali**
```bash
cd EXAMBROWSER_decoded/smali_classes2/com/niotron/muhammad_robi1996/EXAMBROWSERMTsN2KBM
cp CBT1.smali LoginSiswa.smali
```

2. **Edit LoginSiswa.smali** - Replace semua `CBT1` dengan `LoginSiswa`

3. **Cari method initialize** dan ubah WebView URL menjadi:
```smali
const-string v1, "https://exam-admin-abc123.vercel.app/login.html"
```

4. **Tambahkan JavaScript Interface** untuk handle redirect setelah login

#### Opsi B: Gunakan Screen yang Sudah Ada

Lebih simple: Modifikasi CBT1 untuk detect jika belum login, load login page dulu.

---

## 📋 OPSI 2: Menggunakan Intent Activity (ADVANCED)

Buat Activity Java baru untuk login screen dan compile ke DEX.

**Tidak recommended** karena butuh Android Studio dan kompilasi ulang.

---

## 📋 OPSI 3: Redirect Langsung (SIMPLEST)

### Modifikasi CBT1 untuk Auto-Check Login

1. **Edit CBT1.smali** - Di method onCreate, sebelum load URL ujian:

```smali
# Load login page dulu
const-string v1, "https://exam-admin-abc123.vercel.app/login.html?redirect=ujian"
invoke-virtual {v0, v1}, Lcom/google/appinventor/components/runtime/WebViewer;->GoToUrl(Ljava/lang/String;)V
```

2. **Di login.html**, setelah sukses login, redirect ke URL ujian:
```javascript
// Setelah login berhasil
window.location.href = 'https://ujian-url.com?student=' + encodeURIComponent(student.name);
```

3. **URL ujian** bisa baca parameter `?student=` untuk identifikasi siswa

---

## 🔧 Modifikasi API URL di login.html

Sebelum rebuild APK, **WAJIB** edit file:
`exam-admin/public/login.html`

Ganti baris:
```javascript
const API_URL = 'https://YOUR-VERCEL-URL.vercel.app/api';
```

Dengan URL Vercel Anda yang sebenarnya:
```javascript
const API_URL = 'https://exam-admin-abc123.vercel.app/api';
```

---

## 🛠️ Step-by-Step Implementasi (RECOMMENDED PATH)

### Langkah 1: Deploy Backend

```bash
cd exam-admin
vercel --prod
```

Catat URL: `https://exam-admin-abc123.vercel.app`

### Langkah 2: Update login.html

Edit `exam-admin/public/login.html`:
```javascript
const API_URL = 'https://exam-admin-abc123.vercel.app/api';
```

Deploy lagi:
```bash
vercel --prod
```

### Langkah 3: Test di Browser

Buka: `https://exam-admin-abc123.vercel.app/login.html`

Pastikan:
- ✅ List siswa muncul
- ✅ Search berfungsi
- ✅ Bisa klik siswa
- ✅ Login tercatat di log

### Langkah 4: Modifikasi APK

**Option A: Simple Redirect (No Smali Edit)**

1. Edit `CBT1.smali`, cari method `$define`:
```smali
# Cari bagian WebView GoToUrl
# Ganti URL default dengan:
const-string v1, "https://exam-admin-abc123.vercel.app/login.html"
```

2. Rebuild & Sign APK:
```bash
java -jar apktool.jar b EXAMBROWSER_decoded -o EXAMBROWSER_modified_v3.apk -f
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore my-release-key.jks -storepass password -keypass password EXAMBROWSER_modified_v3.apk my-key-alias
```

**Option B: Buat Screen Baru (Advanced)**

Ikuti tutorial di: [CREATE_NEW_SCREEN.md](./CREATE_NEW_SCREEN.md)

### Langkah 5: Handle Redirect

Di `login.html`, setelah login sukses, redirect ke URL ujian:

```javascript
function proceedToExam() {
    // Untuk CBT1
    window.location.href = 'https://cbt-url.com/exam';
    
    // Atau jika load dari assets
    window.location.href = 'file:///android_asset/cbt1.html';
}
```

---

## 🔍 Debugging

### Test API dari APK

Tambahkan console log di login.html:
```javascript
console.log('API URL:', API_URL);
console.log('Students loaded:', allStudents);
```

View log di Chrome DevTools:
1. Connect device via USB
2. Chrome → `chrome://inspect`
3. Inspect WebView

### Common Issues

**Students tidak muncul:**
- Check API URL correct
- Check CORS enabled (sudah di API)
- Check internet permission di AndroidManifest.xml

**Login tidak tercatat:**
- Check POST request di Network tab
- Check API endpoint `/api/login-logs`

**Redirect tidak jalan:**
- Check console log
- Test di browser dulu

---

## 📊 Monitoring

### Admin Dashboard
- URL: `https://exam-admin-abc123.vercel.app`
- Monitor login real-time
- Manage siswa

### API Logs
- Vercel Dashboard → Project → Logs
- Monitor request/response

---

## 🚀 Production Checklist

- [ ] Deploy API ke Vercel
- [ ] Update API_URL di login.html
- [ ] Test login page di browser
- [ ] Modify APK (CBT1 redirect atau screen baru)
- [ ] Rebuild & sign APK
- [ ] Test di device
- [ ] Monitor logs
- [ ] Backup data siswa

---

## 💡 Tips

1. **Testing**: Gunakan browser dulu sebelum inject ke APK
2. **URL**: Simpan URL Vercel di tempat aman
3. **Database**: Upgrade ke Supabase untuk data persistence
4. **Security**: Tambahkan token auth untuk production
5. **Offline**: Tambahkan service worker untuk offline support

---

## 📞 Need Help?

Check:
- `DEPLOY_INSTRUCTIONS.md` - Cara deploy ke Vercel
- `README.md` - API documentation
- Vercel Docs: https://vercel.com/docs

---

## 🎓 Alternatif: Native Android Login (Advanced)

Jika ingin login screen native (bukan WebView), butuh:
1. Android Studio
2. Buat Activity baru
3. Compile ke DEX
4. Inject ke APK via APKTool
5. Update AndroidManifest.xml

**Tidak recommended** untuk project ini karena kompleksitas tinggi.

WebView approach adalah **best practice** untuk rapid development.
