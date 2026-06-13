# 🚀 Hostinger Deployment Guide — Saiful Studios

> **Project:** React + Vite (frontend) · Express + Sequelize + MySQL (backend)
> **Plan:** Hostinger Pro (shared business/cloud hosting with Node.js support)
> **Date:** June 12, 2026

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Hostinger Pro Plan — What You Get](#hostinger-pro-plan--what-you-get)
3. [Step 1: Database Setup (MySQL)](#step-1-database-setup-mysql)
4. [Step 2: Environment Variables](#step-2-environment-variables)
5. [Step 3: Prepare the Codebase](#step-3-prepare-the-codebase)
6. [Step 4: Deploy the Backend (Node.js)](#step-4-deploy-the-backend-nodejs)
7. [Step 5: Deploy the Frontend (React SPA)](#step-5-deploy-the-frontend-react-spa)
8. [Step 6: Run Database Migrations & Seed](#step-6-run-database-migrations--seed)
9. [Step 7: Configure Domain & SSL](#step-7-configure-domain--ssl)
10. [Step 8: Verify Everything](#step-8-verify-everything)
11. [Troubleshooting](#troubleshooting)
12. [Maintenance](#maintenance)
13. [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## Prerequisites

- Hostinger Pro Plan account with **hPanel** access
- Your domain connected to Hostinger (or use a subdomain)
- Your code pushed to a **GitHub** repository (private or public)
- Node.js installed locally (v18+)

---

## Hostinger Pro Plan — What You Get

| Feature | Details |
|---------|---------|
| **Node.js Support** | ✅ Via hPanel Node.js selector (v16/18/20 available) |
| **MySQL Database** | ✅ Up to 10 databases (via phpMyAdmin or hPanel) |
| **PHPMyAdmin** | ✅ Included for DB management |
| **SSH Access** | ✅ Limited (chroot to home directory) |
| **Git Integration** | ✅ Via hPanel Git dashboard |
| **File Manager** | ✅ Upload/Edit files via browser |
| **SSL Certificate** | ✅ Free Auto SSL (Let's Encrypt) |
| **Domain** | ✅ Free domain + subdomains |
| **Cron Jobs** | ✅ Available for scheduled tasks |
| **Backups** | ✅ Weekly automatic backups |

> ⚠️ **Note:** Hostinger shared hosting does NOT give you full root access. You work within hPanel's Node.js manager. For full control, upgrade to a VPS plan.

---

## Step 1: Database Setup (MySQL)

### 1.1 Create a Database

1. Log into **hPanel** → go to **MySQL Databases**
2. Create a new database:
   - **Database Name:** `saiful_studios`
   - (hPanel may prefix it like `u123_saiful_studios`)
3. Create a database user:
   - **Username:** `saiful_user`
   - **Password:** Generate a strong password (use the password generator)
4. Assign the user to the database with **All Privileges**

### 1.2 Get Connection Details

After creation, note down:
- **Host:** `localhost` (your Node.js app connects via localhost — remote connections are blocked for security)
- **Port:** `3306`
- **Database Name:** `u123_saiful_studios` (the prefixed name)
- **Username:** `u123_saiful_user`
- **Password:** (the one you set)

> 💡 **Tip:** You can also use **phpMyAdmin** (found in hPanel) to browse/manage your database visually.

---

## Step 2: Environment Variables

### 2.1 Required Variables

Create a `.env` file in your project root with these values:

```env
# ── Database ──
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u123_saiful_studios
DB_USER=u123_saiful_user
DB_PASSWORD=your_strong_password

# ── Authentication ──
JWT_SECRET=generate_a_random_64_char_hex_string_here_make_it_very_long
ADMIN_EMAIL=admin@saifulstudios.com
ADMIN_NAME=Saiful Islam
ADMIN_PASSWORD=a_strong_initial_password_12_chars_min

# ── SMTP (Email notifications) ──
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@saifulstudios.com
SMTP_PASS=your_email_password
SMTP_FROM=Saiful Studios <your_email@saifulstudios.com>
NOTIFY_EMAIL=admin@saifulstudios.com

# ── App ──
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com
PUBLIC_SITE_URL=https://yourdomain.com
```

### 2.2 Generate a Secure JWT_SECRET

Run this command locally to generate one:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Step 3: Prepare the Codebase

### 3.1 Clone to Your Local Machine

```bash
git clone https://github.com/yourusername/saiful-react.git
cd saiful-react
```

### 3.2 Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 3.3 Build the Frontend

```bash
npm run build
```

This creates a `dist/` folder with the compiled SPA.

### 3.4 Configure for Production

In `src/api.js`, ensure the API URL points to your production backend:

```js
const API_URL = import.meta.env.VITE_API_URL || 'https://yourdomain.com/api';
```

Set the VITE_API_URL at build time:
```bash
VITE_API_URL=https://yourdomain.com/api npm run build
```

Or in `.env`:
```
VITE_API_URL=https://yourdomain.com/api
```

---

## Step 4: Deploy the Backend (Node.js)

### Method A: Via hPanel Node.js Manager (Easiest)

1. **Log into hPanel** → go to **Node.js** section
2. Click **Create** or **Add Project**
3. Fill in the details:
   - **Project name:** `saiful-studios-api`
   - **Node.js version:** Select 18.x or 20.x
   - **Application mode:** `Production`
   - **Application root:** `server` (or wherever your server.js lives)
   - **Startup file:** `server.js`
   - **Environment:** Add all variables from Step 2
4. Click **Create**

5. **Upload your code** via Git:
   - In the Node.js settings, find **Git** section
   - Connect your GitHub repository
   - Deploy the `main` branch

   Or via **File Manager**:
   - Upload all files (except `node_modules`) to the server
   - The Node.js manager will auto-run `npm install`

6. **Start the application**:
   - Click **Run** or **Start** in the Node.js manager
   - Your API will be available at `https://yourdomain.com:5000/api` (or a Hostinger-provided URL)

### Method B: Via SSH (Advanced)

1. **Enable SSH** in hPanel → SSH Access
2. Connect:
   ```bash
   ssh u123@yourdomain.com
   ```
3. Navigate to your home directory
4. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/saiful-react.git
   cd saiful-react/server
   ```
5. Install and configure:
   ```bash
   npm install --production
   ```
6. Start with PM2 (if available) or use the Node.js manager

### Important: Backend URL Configuration

On Hostinger shared hosting, your Node.js app typically runs on a custom port. You'll see the URL in the Node.js manager after starting. It might look like:
```
https://yourdomain.com:5000
```

Configure your frontend to point to this URL.

---

## Step 5: Deploy the Frontend (React SPA)

### 5.1 Upload the Build Files

1. In hPanel, go to **File Manager**
2. Navigate to `public_html/` (or the document root for your domain)
3. **Delete all existing files** in `public_html/`
4. Upload the contents of your local `dist/` folder

> ⚠️ Upload the **contents** of the `dist/` folder, not the folder itself.

### 5.2 Configure SPA Routing

Create an `.htaccess` file in `public_html/` with:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

This ensures client-side routing works (e.g., `/blog/some-post` serves `index.html`).

### 5.3 Set Up API Proxy (Optional)

If you want your frontend and backend on the same domain, add this to `.htaccess`:

```apache
# Proxy API requests to Node.js backend
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^api/(.*) http://localhost:5000/api/$1 [P,L]
```

This requires `mod_proxy` to be enabled on Hostinger (you may need to contact support).

**Alternative:** Use a subdomain like `api.yourdomain.com` for the backend.

---

## Step 6: Run Database Migrations & Seed

### 6.1 Via SSH

```bash
# Navigate to the server directory
cd ~/saiful-react/server

# Run migrations
npx sequelize-cli db:migrate

# Seed the admin user
node seed.js
```

### 6.2 Via hPanel Node.js Console

1. In the Node.js manager, click **Run Script**
2. Run: `npx sequelize-cli db:migrate`
3. Then: `node seed.js`

### 6.3 Or Use DB_SYNC for First Setup

In your `.env`, set:
```
DB_SYNC=true
```

This tells Sequelize to auto-create tables on startup. **Only use this for initial setup**, then remove it:

```bash
# Start once with sync
# After tables are created, set DB_SYNC=false or remove it
```

---

## Step 7: Configure Domain & SSL

### 7.1 Point Your Domain

1. In hPanel, go to **Domains** → point your domain to Hostinger nameservers
2. Wait for DNS propagation (up to 24 hours)
3. Set the document root to `public_html/`

### 7.2 Enable Auto SSL

1. In hPanel, go to **SSL** section
2. Select your domain
3. Click **Auto SSL** or **Let's Encrypt**
4. Enable automatic renewal

---

## Step 8: Verify Everything

### 8.1 Test Checklist

- [ ] Backend health: `https://yourdomain.com/api/health`
  - Should return `{ status: "ok", database: "up", ... }`
- [ ] Frontend loads: `https://yourdomain.com/`
  - Should show the Saiful Studios homepage
- [ ] Admin login: `https://yourdomain.com/admin/login`
  - Should show the login form
- [ ] Login works: Use the admin credentials from seed
- [ ] CSRF works: You can perform state-changing operations
- [ ] SPA routing: Navigate to `/about`, `/blog`, `/contact` — all should work without 404
- [ ] Contact form: Submit with valid captcha
- [ ] SSL: `https://` works, redirects from `http://`

---

## Troubleshooting

### "Cannot find module" errors
- Ensure `npm install` ran successfully in the `server/` directory
- Check that `package-lock.json` exists in both root and `server/`

### "ECONNREFUSED" database errors
- Verify MySQL credentials in `.env`
- Check that the database user has proper permissions
- Ensure the database name includes the Hostinger prefix (e.g., `u123_`)

### 500 Internal Server Error
- Check the Node.js app logs in hPanel → Node.js → Logs
- Common issues: missing env variables, database connection failures

### CORS errors in browser
- Ensure `CORS_ORIGIN` in `.env` matches your frontend domain exactly
- Include the protocol: `https://yourdomain.com` (no trailing slash)

### "JWT_SECRET is not configured"
- Double-check that `JWT_SECRET` is set in the environment variables
- It must be a string of at least 32 characters

### 429 Too Many Requests
- You've hit the rate limiter. Wait 15 minutes and try again.

### SPA 404 on page refresh
- The `.htaccess` rewrite rule is not working
- Contact Hostinger support to ensure `mod_rewrite` is enabled

---

## Maintenance

### Updating the Backend

```bash
# SSH in
cd ~/saiful-react
git pull origin main
cd server
npm install --production
# Restart via hPanel Node.js Manager (Stop → Start)
```

### Updating the Frontend

```bash
# Local machine
git pull origin main
npm install
npm run build
# Upload dist/ contents to public_html/
```

### Database Backups

Hostinger does weekly automatic backups. For manual backup:
- Use **phpMyAdmin** → Export
- Or set up a cron job in hPanel to run `mysqldump` periodically

### Logs

- **Node.js logs:** hPanel → Node.js → Logs
- **Access logs:** hPanel → Logs → Access
- **Error logs:** hPanel → Logs → Error

---

## Quick Reference Cheat Sheet

```bash
# ── Local Build ──
npm install && cd server && npm install && cd ..
npm run build
VITE_API_URL=https://yourdomain.com/api npm run build

# ── Deploy Frontend ──
# Upload dist/* to public_html/

# ── Deploy Backend (via hPanel Node.js) ──
# Create Node.js project → point to server/server.js
# Add all env vars → start project

# ── Database ──
# hPanel → MySQL Databases → Create DB + User
# phpMyAdmin: hPanel → phpMyAdmin

# ── First Run ──
# In Node.js console:
#   npx sequelize-cli db:migrate
#   node seed.js
# Set DB_SYNC=false after first run

# ── SPA Routing ──
# Create public_html/.htaccess with rewrite rules

# ── SSL ──
# hPanel → SSL → Auto SSL → Enable
```

---

## 🔗 Useful Links

- [Hostinger Node.js Deployment Docs](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
- [Hostinger hPanel Guide](https://www.hostinger.com/support/hpanel-overview/)
- [Hostinger MySQL Guide](https://www.hostinger.com/support/how-to-create-mysql-database/)
- [Hostinger SSH Guide](https://www.hostinger.com/support/1583645-how-to-enable-ssh-access-in-hostinger/)
- [Sequelize CLI Guide](https://sequelize.org/docs/v6/other-topics/migrations/)

---

> *Generated for the Saiful Studios project — Hostinger Pro Plan deployment.*
