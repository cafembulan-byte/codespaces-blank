# 🚀 Quick Render Deployment Guide

## Fastest Way (2 minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com)
2. Click **"New +" → "Blueprint"**
3. Select your GitHub repository
4. Click **"Apply"**
5. Done! 🎉

---

## After Deployment

### Create Admin User
```bash
# Via Render Shell (in dashboard)
npm run create-admin -- admin@coffee.com YourPassword123
```

Then login at: `https://your-app-name.onrender.com/admin`

---

## Configuration Summary

| Config | Value | Notes |
|--------|-------|-------|
| Runtime | Node | - |
| Build | `npm install && npm run build` | - |
| Start | `npm start` | - |
| Database | SQLite | File stored at `/data/app.db` |
| Disk | 1GB mounted at `/data` | Required for data persistence |
| Environment | `NODE_ENV=production` | - |

---

## Important Notes

✅ **What's included:**
- Automatic database initialization
- SQLite persistent storage
- Admin authentication system
- API endpoints for admin management
- Gallery, menu, reviews, analytics

⚠️ **Free tier limitations:**
- Auto-suspend after 15 min inactivity
- Cold start ~30 seconds
- Limited to 1 service

💡 **Upgrade for production:**
- Always-on service
- Better performance
- Priority support

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build failed | Check Logs tab, verify Node deps |
| Database error | Ensure disk mounted to `/data` |
| Admin login fails | Run `npm run create-admin` |
| Slow response | Cold start on free tier (normal) |

---

## What Files Were Added/Modified

✨ **New Files:**
- `next.config.js` — Production configuration
- `.env.example` — Environment template
- `render.yaml` — Render deployment config (Blueprint)
- `DEPLOYMENT.md` — Full deployment guide
- `RENDER-QUICK-START.md` — This file!
- `scripts/init-db.js` — Database init script
- `scripts/create-admin.js` — Admin user creation script

📝 **Modified Files:**
- `package.json` — Added npm scripts

---

## Next Steps

1. ✅ Review all config files
2. ✅ Push to GitHub
3. ✅ Deploy via Render Blueprint
4. ✅ Create admin user
5. ✅ Test application

---

**Questions?** Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide!
