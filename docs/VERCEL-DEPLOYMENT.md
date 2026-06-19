# Vercel Deployment Guide

## ✅ Overview

This project has two parts:

| Part     | Stack                         | Deploy target                         |
|----------|-------------------------------|---------------------------------------|
| Frontend | React + Vite (builds to `dist/`) | **Vercel** (static hosting)           |
| Backend  | Express.js + Sequelize + MySQL  | **Railway / Render / VPS** (Node.js)  |
| Database | MySQL 8.0                     | **Aiven / Railway MySQL / VPS**       |

> ⚠️ **Vercel cannot run a long-running Express server.** The frontend (static files) deploys perfectly to Vercel, but the backend needs a Node.js hosting platform. This guide covers both.

---

## 1. Deploy the Frontend to Vercel

### 1.1 Connect your repository

1. Go to [vercel.com](https://vercel.com) and log in with GitHub/GitLab/Bitbucket.
2. Click **Add New → Project**.
3. Import your repository (e.g. `saiful-react`).

### 1.2 Configure the project

Vercel detects Vite automatically. Verify these settings:

| Setting            | Value               |
|--------------------|---------------------|
| **Framework**      | Vite                |
| **Root Directory** | `./` (project root) |
| **Build Command**  | `npm run build`     |
| **Output Directory** | `dist`            |
| **Node Version**   | 20.x                |

### 1.3 Add environment variables

Under **Environment Variables**, add:

| Name                | Value                                                    |
|---------------------|----------------------------------------------------------|
| `VITE_API_URL`      | `https://your-backend-url.com/api` (your deployed API)   |

### 1.4 Deploy

Click **Deploy**. Vercel gives you a URL like:

```
https://saiful-react.vercel.app
```

You can add a custom domain later under **Project → Domains**.

---

## 2. Set Up MySQL Database

You need a MySQL database accessible from your backend server. Choose one option:

### Option A — Railway MySQL (easiest if backend is also on Railway)

1. Create a [Railway](https://railway.app) account.
2. Start a new project → **Provision MySQL**.
3. After creation, go to the **Variables** tab.
4. Railway auto-generates env vars:
   - `MYSQL_URL` (full connection string)
   - `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_PORT`

### Option B — Aiven MySQL (free tier available)

1. Go to [aiven.io](https://aiven.io) → Create a **MySQL** service.
2. Choose the free plan (up to 1 GB).
3. After creation, go to **Quick Connect** to get connection details.

### Option C — VPS with MySQL

1. SSH into your VPS.
2. Install MySQL:

   ```bash
   sudo apt update
   sudo apt install mysql-server -y
   sudo mysql_secure_installation
   ```

3. Create a database and user:

   ```sql
   CREATE DATABASE saiful_studios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'saiful'@'%' IDENTIFIED BY 'your-strong-password';
   GRANT ALL PRIVILEGES ON saiful_studios.* TO 'saiful'@'%';
   FLUSH PRIVILEGES;
   ```

4. Allow remote connections — edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:

   ```
   bind-address = 0.0.0.0
   ```

5. Restart: `sudo systemctl restart mysql`

---

## 3. Deploy the Backend

### Option A — Railway (easiest)

1. Create a [Railway](https://railway.app) account.
2. Click **New Project → Deploy from GitHub** → select your repo.
3. Add a **start command**: `cd server && node server.js`
4. Under **Variables**, add all the needed env vars (see table below).
5. Railway auto-assigns a `*.railway.app` domain.

### Option B — Render Web Service

1. Go to [render.com](https://render.com) → **New Web Service** → connect your repo.
2. Configure:

   | Setting              | Value                            |
   |----------------------|----------------------------------|
   | **Root Directory**   | `server`                         |
   | **Runtime**          | Node                             |
   | **Build Command**    | `npm install`                    |
   | **Start Command**    | `node server.js`                 |
   | **Node Version**     | 20.x                             |

3. Add environment variables (see table below).
4. Click **Create Web Service**.

### Option C — VPS (digitalocean, hetzner, etc.)

1. SSH into your VPS.
2. Install Node.js 20+ (recommended: use [nvm](https://github.com/nvm-sh/nvm)).
3. Clone the repo:

   ```bash
   git clone https://github.com/your-username/saiful-react.git
   cd saiful-react
   ```

4. Create `.env` file (see `.env.example` for the full list).
5. Install dependencies and run:

   ```bash
   cd server
   npm install
   npm run migrate
   npm run seed
   node server.js
   ```

6. Set up a process manager:

   ```bash
   npm install -g pm2
   pm2 start server/server.js --name saiful-api
   pm2 save
   pm2 startup
   ```

7. (Optional) Set up Nginx as a reverse proxy.

### Backend Environment Variables

All of these go into your hosting platform's **Environment Variables** section (or `.env` if on a VPS):

| Variable             | Required | Description                                        |
|----------------------|----------|----------------------------------------------------|
| `NODE_ENV`           | Yes      | Set to `production`                                |
| `PORT`               | No       | Default `5000`                                     |
| `DB_HOST`            | Yes      | MySQL host (e.g. `localhost` or railway host)      |
| `DB_PORT`            | No       | Default `3306`                                     |
| `DB_USER`            | Yes      | MySQL user                                         |
| `DB_PASSWORD`        | Yes      | MySQL password                                     |
| `DB_NAME`            | No       | Default `saiful_studios`                           |
| `JWT_SECRET`         | Yes      | 64-char hex string (generate below)                |
| `ADMIN_COOKIE_NAME`  | No       | Default `admin_token`                              |
| `CORS_ORIGIN`        | Yes      | Your frontend URL (e.g. `https://saiful-react.vercel.app`) |
| `PUBLIC_SITE_URL`    | No       | Your public site URL (used in sitemap)             |
| `ADMIN_EMAIL`        | For seed | Admin email (needed once to seed)                  |
| `ADMIN_PASSWORD`     | For seed | Admin password (needed once to seed)               |
| `ADMIN_NAME`         | No       | Default `Saiful Islam`                             |
| `NOTIFY_EMAIL`       | No       | Where to send contact form notifications           |
| `SMTP_HOST`          | No       | SMTP server (leave empty to disable email)         |
| `SMTP_PORT`          | No       | Default `587`                                      |
| `SMTP_SECURE`        | No       | `true` / `false`                                   |
| `SMTP_USER`          | No       | SMTP username                                      |
| `SMTP_PASS`          | No       | SMTP password                                      |
| `SMTP_FROM`          | No       | Sender address                                     |
| `DB_SYNC`            | No       | Keep `false` in production — use migrations instead |

Generate `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 4. CORS Configuration

Set `CORS_ORIGIN` on the backend to your Vercel frontend URL:

```
CORS_ORIGIN=https://saiful-react.vercel.app
```

If you have multiple allowed origins, separate them with commas:
```
CORS_ORIGIN=https://saiful-react.vercel.app,https://your-custom-domain.com
```

---

## 5. Run Database Migrations & Seed

### On Railway / Render

Some platforms allow running one-off commands in the **Shell** tab:

```bash
cd server && npx sequelize-cli db:migrate
cd server && node seed.js
```

### On a VPS

```bash
cd /path/to/saiful-react
npm run migrate   # runs: cd server && npx sequelize-cli db:migrate
npm run seed      # runs: cd server && node seed.js
```

> **`seed.js`** creates an admin user using `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` from your environment variables. Run it only once.

---

## 6. Connect Frontend to Backend

In Vercel **Project Settings → Environment Variables**, set:

```
VITE_API_URL=https://your-backend-url.com/api
```

This makes `axios` calls go to your deployed API. The frontend proxy (`/api` → `localhost:5000`) is only needed during local development.

---

## 7. Uploads Directory

Uploaded images are saved to `server/uploads/` on the backend. Make sure:

- The uploads directory exists and is writable.
- On Railway/Render, files are **ephemeral** — they will be lost on restart. For production, consider using **Cloudinary** or **AWS S3** for persistent file storage.
- On a VPS, the uploads folder persists as long as you don't delete it.

---

## 8. Full Architecture Diagram

```
┌─────────────────────────┐       ┌──────────────────────────┐
│   Vercel (Frontend)     │       │  Railway / Render / VPS  │
│                         │       │      (Backend)           │
│  saiful-react.vercel.app│──────▶│  your-app.railway.app    │
│  (static files from     │  API  │  Express.js on :5000     │
│   npm run build → dist/)│       │                          │
└─────────────────────────┘       └──────────┬───────────────┘
                                             │
                                             ▼
                                     ┌──────────────────┐
                                     │  MySQL Database   │
                                     │  (Aiven/Railway/  │
                                     │   VPS MySQL)      │
                                     │  saiful_studios   │
                                     └──────────────────┘
```

---

## 9. Troubleshooting

| Problem                          | Fix                                                                 |
|----------------------------------|---------------------------------------------------------------------|
| Frontend loads but API calls fail | Check `VITE_API_URL` is set correctly in Vercel env vars            |
| CORS errors in browser           | Ensure `CORS_ORIGIN` on backend matches the frontend URL exactly    |
| Database connection refused      | Check firewall / bind-address — MySQL must accept remote connections |
| JWT auth fails                   | Run migrations (`npm run migrate`) and seed (`npm run seed`)        |
| Uploaded images not showing      | The `uploads/` folder is served at `/uploads` on the backend URL    |
| App crashes on startup           | Check all required env vars are set (especially `JWT_SECRET`)       |
| "Too many login attempts"        | Wait 15 minutes — the login rate limiter triggered                  |

---

## 10. Quick Checklist

- [ ] Frontend deployed to Vercel
- [ ] MySQL database provisioned and accessible
- [ ] Backend deployed on Railway / Render / VPS
- [ ] `JWT_SECRET` generated and set
- [ ] `CORS_ORIGIN` set to Vercel frontend URL
- [ ] `VITE_API_URL` set on Vercel to backend URL
- [ ] Database migrations run (`npm run migrate`)
- [ ] Admin user seeded (`npm run seed`)
- [ ] Custom domains configured (optional)
- [ ] SMTP configured for email notifications (optional)
