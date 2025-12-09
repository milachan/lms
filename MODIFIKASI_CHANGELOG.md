# MODIFIKASI EXAMBROWSER APK - CHANGELOG

## Modifikasi yang Dilakukan (9 Desember 2025)

### 1. ✅ Launcher Activity Diubah
- **Sebelum**: Screen1 sebagai launcher (splash/intro screen)
- **Sesudah**: HOME sebagai launcher (langsung masuk aplikasi)
- **File yang dimodifikasi**: `AndroidManifest.xml`
  - Menghapus `LAUNCHER` category dari Screen1
  - Menambahkan `LAUNCHER` category ke HOME activity

### 2. ✅ Audio Masuk Otomatis
- **Ditambahkan**: File audio `masuk.mp3` di folder assets
- **Fitur**: Otomatis play audio saat aplikasi dibuka (HOME activity)
- **File yang dimodifikasi**: `HOME.smali`
  - Inject kode MediaPlayer di method `onCreate()`
  - Audio di-play dari assets menggunakan AssetFileDescriptor

### 3. ✅ Menu Halaman Utama Disederhanakan (UPDATE V2)
- **Sebelum**: 6 menu (Scan QR, Masuk URL, E-Ujian, Developer, Mode Prioritas, Keluar)
- **Sesudah**: 2 menu (E-Ujian, Keluar)
- **Menu yang Dihapus/Disembunyikan**:
  - ❌ Scan QR Code (CardQRCODE & CardQRCODE2)
  - ❌ Masuk URL (CardMASUK & CardMASUKADV)
  - ❌ Developer (CardDEVELOPER)
  - ❌ Mode Prioritas (CardMODPRIORITAS)
- **Menu yang Tetap**:
  - ✅ E-Ujian (CardEUJIAN1 & CardEUJIAN2)
  - ✅ Keluar (CardKELUAR)
- **File yang dimodifikasi**: `HOME.smali`
  - Inject kode setVisibility(GONE) di method `onCreate()`
  - Menu yang dihapus tidak ditampilkan di UI

### 4. 📁 File Baru
- `c:\laragon\www\apk\EXAMBROWSER_modified.apk` - APK hasil modifikasi V1
- `c:\laragon\www\apk\EXAMBROWSER_modified_v2.apk` - APK hasil modifikasi V2 (menu disederhanakan)
- `c:\laragon\www\apk\EXAMBROWSER_decoded\` - Folder hasil decode dengan apktool
- `c:\laragon\www\apk\EXAMBROWSER_decoded\assets\masuk.mp3` - File audio yang ditambahkan
- `c:\laragon\www\apk\my-release-key.jks` - Keystore untuk signing APK

---

## Detail Teknis Modifikasi

### AndroidManifest.xml Changes

#### Screen1 Activity (SEBELUM):
```xml
<activity android:name="...Screen1" android:windowSoftInputMode="stateHidden">
    <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
    </intent-filter>
</activity>
```

#### Screen1 Activity (SESUDAH):
```xml
<activity android:name="...Screen1" android:windowSoftInputMode="stateHidden">
    <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
    </intent-filter>
</activity>
```

#### HOME Activity (SEBELUM):
```xml
<activity android:name="...HOME" android:windowSoftInputMode="stateHidden">
    <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
    </intent-filter>
</activity>
```

#### HOME Activity (SESUDAH):
```xml
<activity android:name="...HOME" android:windowSoftInputMode="stateHidden">
    <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
    </intent-filter>
</activity>
```

---

### HOME.smali Changes

#### Method onCreate (SEBELUM):
```smali
.method public onCreate(Landroid/os/Bundle;)V
    .locals 1

    const/4 v0, 0x1
    invoke-static {v0}, ...
    invoke-super {p0, p1}, ...
    return-void
.end method
```

#### Method onCreate (SESUDAH):
```smali
.method public onCreate(Landroid/os/Bundle;)V
    .locals 8

    const/4 v0, 0x1
    invoke-static {v0}, ...
    invoke-super {p0, p1}, ...

    # Play masuk.mp3
    :try_start_0
    invoke-virtual {p0}, Landroid/content/Context;->getAssets()Landroid/content/res/AssetManager;
    move-result-object v1
    const-string v2, "masuk.mp3"
    invoke-virtual {v1, v2}, Landroid/content/res/AssetManager;->openFd(Ljava/lang/String;)Landroid/content/res/AssetFileDescriptor;
    move-result-object v1
    new-instance v2, Landroid/media/MediaPlayer;
    invoke-direct {v2}, Landroid/media/MediaPlayer;-><init>()V
    invoke-virtual {v1}, Landroid/content/res/AssetFileDescriptor;->getFileDescriptor()Ljava/io/FileDescriptor;
    move-result-object v3
    invoke-virtual {v1}, Landroid/content/res/AssetFileDescriptor;->getStartOffset()J
    move-result-wide v4
    invoke-virtual {v1}, Landroid/content/res/AssetFileDescriptor;->getLength()J
    move-result-wide v6
    invoke-virtual/range {v2 .. v7}, Landroid/media/MediaPlayer;->setDataSource(Ljava/io/FileDescriptor;JJ)V
    invoke-virtual {v2}, Landroid/media/MediaPlayer;->prepare()V
    invoke-virtual {v2}, Landroid/media/MediaPlayer;->start()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0
    :catch_0
    nop
    :goto_0

    # Hide unwanted menu cards (V2 Update)
    iget-object v1, p0, Lcom/niotron/muhammad_robi1996/EXAMBROWSERMTsN2KBM/HOME;->CardQRCODE:Lcom/google/appinventor/components/runtime/NiotronCardView;
    const/16 v2, 0x8
    invoke-virtual {v1, v2}, Landroid/view/View;->setVisibility(I)V

    iget-object v1, p0, Lcom/niotron/muhammad_robi1996/EXAMBROWSERMTsN2KBM/HOME;->CardQRCODE2:Lcom/google/appinventor/components/runtime/NiotronCardView;
    invoke-virtual {v1, v2}, Landroid/view/View;->setVisibility(I)V

    iget-object v1, p0, Lcom/niotron/muhammad_robi1996/EXAMBROWSERMTsN2KBM/HOME;->CardMASUK:Lcom/google/appinventor/components/runtime/NiotronCardView;
    invoke-virtual {v1, v2}, Landroid/view/View;->setVisibility(I)V

    iget-object v1, p0, Lcom/niotron/muhammad_robi1996/EXAMBROWSERMTsN2KBM/HOME;->CardMASUKADV:Lcom/google/appinventor/components/runtime/NiotronCardView;
    invoke-virtual {v1, v2}, Landroid/view/View;->setVisibility(I)V

    iget-object v1, p0, Lcom/niotron/muhammad_robi1996/EXAMBROWSERMTsN2KBM/HOME;->CardDEVELOPER:Lcom/google/appinventor/components/runtime/NiotronCardView;
    invoke-virtual {v1, v2}, Landroid/view/View;->setVisibility(I)V

    iget-object v1, p0, Lcom/niotron/muhammad_robi1996/EXAMBROWSERMTsN2KBM/HOME;->CardMODPRIORITAS:Lcom/google/appinventor/components/runtime/NiotronCardView;
    invoke-virtual {v1, v2}, Landroid/view/View;->setVisibility(I)V

    return-void
.end method
```

**Penjelasan**:
- `const/16 v2, 0x8` = GONE (8) - komponen tidak ditampilkan dan tidak mengambil ruang di layout
- `invoke-virtual {v1, v2}, Landroid/view/View;->setVisibility(I)V` = memanggil setVisibility(GONE) untuk setiap CardView

---

## Cara Build & Sign APK

### Tools yang Digunakan:
1. **apktool v2.9.3** - Decode & rebuild APK
2. **Java keytool** - Generate keystore
3. **jarsigner** - Sign APK

### Perintah yang Dijalankan:

#### 1. Decode APK
```powershell
java -jar apktool.jar d EXAMBROWSER.apk -o EXAMBROWSER_decoded -f
```

#### 2. Modifikasi Files
- Edit `AndroidManifest.xml`
- Edit `smali_classes2/com/niotron/.../HOME.smali`
- Copy `masuk.mp3` ke `assets/`

#### 3. Rebuild APK
```powershell
java -jar apktool.jar b EXAMBROWSER_decoded -o EXAMBROWSER_modified.apk
```

#### 4. Generate Keystore
```powershell
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias -storepass password -keypass password -dname "CN=ExamBrowser, OU=Dev, O=MTsN2KBM, L=Kebumen, ST=JawaTengah, C=ID"
```

#### 5. Sign APK
```powershell
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore my-release-key.jks -storepass password -keypass password EXAMBROWSER_modified.apk my-key-alias
```

#### 6. Verify Signature
```powershell
jarsigner -verify -verbose -certs EXAMBROWSER_modified.apk
```

---

## Install APK Modified

### Di Android Device:
1. Transfer file `EXAMBROWSER_modified.apk` ke device
2. Uninstall versi lama (jika ada)
3. Install APK modified
4. Berikan permission yang diminta
5. Jalankan aplikasi - akan langsung masuk ke HOME dengan suara

### Catatan:
- APK ini signed dengan self-signed certificate
- Untuk production, harus di-sign dengan certificate resmi
- Password keystore: `password` (hanya untuk development)

---

## Hasil Modifikasi

### Behavior Baru:
1. ✅ Aplikasi dibuka → Langsung masuk ke HOME (skip Screen1)
2. ✅ Saat HOME muncul → Otomatis play audio `masuk.mp3`
3. ✅ Menu HOME hanya menampilkan 2 menu: **E-Ujian** dan **Keluar**
4. ✅ Menu lain (Scan QR, Masuk URL, Developer, Mode Prioritas) disembunyikan
5. ✅ Semua fitur original tetap berfungsi
6. ✅ Tidak ada crash atau error

### File Size:
- **Original APK**: ~16 MB
- **Modified APK V1**: ~16 MB (skip intro + audio)
- **Modified APK V2**: ~16 MB (V1 + menu disederhanakan)

---

## Backup & Recovery

### File Original:
- `EXAMBROWSER.apk` - APK original (tidak diubah)
- `EXAMBROWSER_extracted/` - Ekstraksi langsung tanpa decode

### File Modified:
- `EXAMBROWSER_modified.apk` - APK hasil modifikasi + signed
- `EXAMBROWSER_decoded/` - Source code yang bisa diedit

### Rollback:
Jika ingin kembali ke versi original:
```powershell
# Install ulang APK original
adb install -r EXAMBROWSER.apk
```

---

## Troubleshooting

### Jika Audio Tidak Bunyi:
1. Cek volume device
2. Cek permission MODIFY_AUDIO_SETTINGS
3. Pastikan `masuk.mp3` ada di assets/

### Jika App Crash:
1. Cek logcat: `adb logcat | grep -i error`
2. Pastikan smali syntax benar
3. Rebuild dengan clean: `java -jar apktool.jar b -f`

### Jika Install Gagal:
1. Uninstall versi lama dulu
2. Enable "Install from Unknown Sources"
3. Re-sign APK dengan keystore baru

---

**Modified by**: AI Assistant  
**Date**: 9 Desember 2025  
**Version**: Modified from v9.5  
**Package**: exam.rdeveloper.mtsn2kebumen
