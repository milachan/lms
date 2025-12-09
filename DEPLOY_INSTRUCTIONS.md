# 🚀 DEPLOY KE VERCEL - STEP BY STEP

## Opsi 1: Deploy via Vercel CLI (Termudah)

1. **Install Vercel CLI** (jika belum):
```bash
npm i -g vercel
```

2. **Login ke Vercel**:
```bash
vercel login
```
Pilih metode login (GitHub/GitLab/Email)

3. **Deploy**:
```bash
cd exam-admin
vercel
```

4. **Jawab pertanyaan**:
- Set up and deploy? → **Y**
- Which scope? → Pilih akun Anda
- Link to existing project? → **N**
- What's your project's name? → **exam-admin** (atau nama lain)
- In which directory is your code located? → **.**
- Override settings? → **N**

5. **Production Deploy**:
```bash
vercel --prod
```

✅ Done! URL akan muncul di terminal.

---

## Opsi 2: Deploy via Vercel Dashboard (Paling Mudah)

1. **Buka**: https://vercel.com/new

2. **Import Git Repository**:
   - Klik "Add New Project"
   - Pilih "Import Git Repository"
   - Connect dengan GitHub/GitLab
   - Atau upload folder `exam-admin`

3. **Configure Project**:
   - Framework Preset: **Other**
   - Root Directory: **.**
   - Build Command: (kosongkan)
   - Output Directory: (kosongkan)

4. **Deploy**:
   - Klik "Deploy"
   - Tunggu 1-2 menit

✅ Done! URL production akan muncul.

---

## Opsi 3: Deploy via GitHub (Otomatis)

1. **Push ke GitHub**:
```bash
cd exam-admin
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/exam-admin.git
git push -u origin main
```

2. **Connect ke Vercel**:
   - Buka https://vercel.com/new
   - Pilih "Import Git Repository"
   - Pilih repo `exam-admin`
   - Klik "Deploy"

✅ Done! Setiap push akan auto-deploy.

---

## 📝 Setelah Deploy

1. **Simpan URL Production**:
   Contoh: `https://exam-admin-abc123.vercel.app`

2. **Update APK**:
   - Ganti `API_URL` di kode APK dengan URL production
   - Rebuild APK

3. **Test API**:
```bash
# Health check
curl https://exam-admin-abc123.vercel.app/api/health

# Get students
curl https://exam-admin-abc123.vercel.app/api/students/active
```

---

## ⚠️ PENTING - Data Persistence

Vercel adalah **serverless**, jadi JSON file storage akan **reset setiap deploy**.

Untuk production, gunakan database eksternal:
- **Supabase** (PostgreSQL) - FREE
- **MongoDB Atlas** - FREE
- **PlanetScale** (MySQL) - FREE
- **Vercel KV** (Redis) - FREE tier available

### Upgrade ke Supabase (Recommended):

1. Buat project di https://supabase.com
2. Buat tabel `students` dan `login_logs`
3. Update `api/index.js` untuk koneksi Supabase
4. Redeploy

Contoh tabel SQL:
```sql
-- Students table
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  class TEXT NOT NULL,
  active BOOLEAN DEFAULT true
);

-- Login logs table
CREATE TABLE login_logs (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  student_name TEXT,
  username TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  device_info TEXT
);
```

---

## 🔒 Environment Variables (Optional)

Jika butuh API key atau secrets:

1. **Via CLI**:
```bash
vercel env add DATABASE_URL
```

2. **Via Dashboard**:
   - Project Settings → Environment Variables
   - Add variable

---

## 📊 Monitoring

- **Dashboard**: https://vercel.com/dashboard
- **Logs**: Project → Deployments → Logs
- **Analytics**: Project → Analytics

---

## ❓ Troubleshooting

**Error: "Function exceeded timeout"**
- Default timeout 10s, upgrade plan untuk lebih lama

**Error: "Module not found"**
- Pastikan `package.json` benar
- Run `npm install` sebelum deploy

**JSON data hilang**
- Normal di serverless, gunakan database eksternal

---

Butuh bantuan? Check: https://vercel.com/docs
