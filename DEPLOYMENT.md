# Panduan Deployment ke Render.com

## 📋 Persiapan Awal

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd codespaces-blank
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables Lokal** (untuk testing)
   ```bash
   cp .env.example .env.local
   # Edit .env.local dengan konfigurasi lokal Anda
   ```

## 🚀 Deployment ke Render.com

### Opsi 1: Menggunakan render.yaml (Recommended) ⭐

**Cara Termudah dan Tercepat!**

1. **Push code ke GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Di Render Dashboard:**
   - Login ke [render.com](https://render.com)
   - Klik **"New +"** → **"Blueprint"**
   - Pilih repository GitHub Anda
   - Render akan secara otomatis membaca `render.yaml`
   - Review konfigurasi
   - Klik **"Apply"**

3. **Done!** 🎉
   - Render akan otomatis build dan deploy
   - Database (SQLite) akan tersimpan di persistent disk `/data`
   - Aplikasi akan accessible via URL yang diberikan Render

### Opsi 2: Manual Setup di Render Dashboard

1. **Create Web Service:**
   - Klik **"New +"** → **"Web Service"**
   - Connect GitHub repository
   - Fill in details:
     - **Name:** coffee-landing
     - **Runtime:** Node
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm start`

2. **Configure Disk Storage (untuk SQLite persistence):**
   - Buka tab **"Disks"**
   - Klik **"Add Disk"**
   - **Disk name:** coffee-data
   - **Mount path:** /data
   - **Size:** 1 GB (minimal)

3. **Set Environment Variables:**
   Di tab **"Environment"**:
   ```
   NODE_ENV=production
   ```

4. **Deploy:**
   - Klik **"Create Web Service"**
   - Tunggu build selesai (~2-3 menit)
   - Service akan live dengan URL yang diberikan

## 💾 Database (SQLite)

### Bagaimana Ini Bekerja?

- Aplikasi menggunakan **SQLite** (embedded database)
- Data disimpan dalam file `data/app.db`
- File ini tersimpan di **persistent disk** Render (tidak hilang saat redeploy)

### Inisialisasi Database

Database schema akan otomatis dibuat saat aplikasi pertama kali dijalankan. Tabel-tabel yang dibuat:

- `admin_users` — credentials admin
- `menu_items` — data menu
- `gallery_items` — data galeri
- `reviews` — ulasan pelanggan
- `analytics_events` — event tracking

### Setup Admin Account

Saat ini tidak ada UI untuk register admin. Setup admin secara manual:

**Option A: Via SQL (Recommended)**

1. SSH ke service atau gunakan panel
2. Connect ke database: `sqlite3 /data/app.db`
3. Insert admin user:
   ```sql
   INSERT INTO admin_users (email, password_hash) 
   VALUES ('admin@example.com', '$2a$10$...');
   ```

**Option B: Via Node Script**

Buat file `scripts/create-admin.js`:
```javascript
const bcrypt = require('bcryptjs');
const { run } = require('./lib/sqlite');

const email = process.argv[2] || 'admin@example.com';
const password = process.argv[3] || 'defaultpassword';

const hashedPassword = bcrypt.hashSync(password, 10);

run(
  'INSERT INTO admin_users (email, password_hash) VALUES (?, ?)',
  [email, hashedPassword]
).then(() => {
  console.log(`✓ Admin user created: ${email}`);
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
```

Jalankan di Render Shell:
```bash
node scripts/create-admin.js your@email.com yourpassword
```

### Backup Data

Untuk backup database:
```bash
# Download via Render dashboard atau SFTP
# atau setup automated backups
```

## 🔧 Environment Variables

Tidak banyak env vars yang diperlukan:

```env
# Wajib
NODE_ENV=production

# Optional - untuk future integrations
# DB_HOST=localhost (default, untuk SQLite)
# DB_USER=sqlite (default, untuk SQLite)
```

## ⚠️ Penting: Data Persistence

❗ **Render Free Tier:**
- Disk persistent selama service tidak dihapus
- Auto-suspend setelah 15 menit tanpa traffic
- Gratis tapi ada cold start delay

✅ **Render Paid Tier:**
- Always-on (tidak auto-suspend)
- Guaranteed uptime
- Better performance

Untuk production, gunakan **Paid plan**.

## 🔍 Troubleshooting

### Build Failed
```
Error: Failed to build
```
**Solution:**
- Check logs di Render dashboard
- Pastikan `package.json` lengkap
- Pastikan Node.js version compatible

### Database Error
```
Cannot find file /data/app.db
```
**Solution:**
- Ensure disk mounted ke `/data`
- Check disk size (minimal 1GB)
- Restart service

### Port Issues
```
EADDRINUSE: address already in use
```
**Solution:**
- Render automatically assigns PORT env var
- Next.js `npm start` akan listen di PORT env var
- Tidak perlu konfigurasi manual

### Cold Start Delays
```
Service took 30+ seconds to respond
```
**Solution:**
- Normal untuk free tier Render
- Upgrade ke Paid plan untuk always-on

### Admin Login Gagal
```
Invalid email or password
```
**Solution:**
- Setup admin user via Node script
- Verify password hash menggunakan bcryptjs

## 📊 Monitoring & Logs

1. **Real-time Logs:**
   - Buka service di dashboard
   - Tab "Logs"
   - Lihat output real-time

2. **Metrics:**
   - Tab "Metrics"
   - Monitor CPU, memory, disk, bandwidth

3. **Email Notifications:**
   - Render akan notify jika deployment failed
   - Setup lebih lanjut di settings

## 🔄 Update & Redeploy

### Auto-Deploy (Recommended)
- Render otomatis redeploy saat push ke main branch
- View deployment history di dashboard

### Manual Redeploy
- Klik "Redeploy" button di dashboard
- atau push commit baru

### Zero-Downtime Deployment
- Render handle ini secara otomatis
- Tidak perlu maintenance window

## 🛠️ Useful Commands

```bash
# Local development
npm run dev        # Start dev server (http://localhost:3000)

# Production build
npm run build      # Build Next.js application
npm start          # Start production server

# Linting
npm run lint       # Check code quality
```

## 📚 Support & Resources

- 📖 [Render Documentation](https://render.com/docs)
- 📖 [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- 💬 [Render Community](https://community.render.com)
- 🐛 [Report Issues](https://github.com/cafembulan-byte/codespaces-blank/issues)

## ✅ Checklist Sebelum Deploy

- [ ] Code sudah push ke GitHub main branch
- [ ] `.gitignore` mencakup `node_modules`, `.next`, `.env*`
- [ ] `package.json` memiliki build & start scripts
- [ ] Environment sudah dikonfigurasi di Render
- [ ] Disk sudah ditambahkan jika menggunakan SQLite
- [ ] Tested locally dengan `npm run build && npm start`

---

**Questions?** Baca [DEPLOYMENT.md](./DEPLOYMENT.md) atau hubungi team!
