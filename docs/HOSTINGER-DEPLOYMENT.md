# Hostinger Deployment Guide

## ✅ Overview

This project has two parts:

| Part     | Stack                         | Hostinger deploy option                 |
|----------|-------------------------------|-----------------------------------------|
| Frontend | React + Vite (builds to `dist/`) | Served by Express (VPS) OR cPanel static |
| Backend  | Express.js + Sequelize + MySQL  | **VPS** (Node.js)                       |
| Database | MySQL 8.0                     | **VPS** (MySQL installed on the same VPS) |

> **Recommended:** Deploy everything on a **Hostinger VPS** — the Express server can serve both the API and the built frontend files. This is the simplest and most cost-effective approach.

---

## 1. Choose Your Hostinger Plan

### Option A — VPS (Recommended)

| Plan          | Price   | RAM  | Storage | Best for                          |
|---------------|---------|------|---------|-----------------------------------|
| **VPS 1**     | ~$5/mo  | 1 GB | 20 GB   | Small portfolio / personal site   |
| **VPS 2**     | ~$8/mo  | 2 GB | 40 GB   | Medium traffic with admin panel   |
| **VPS 3**     | ~$12/mo | 4 GB | 80 GB   | High traffic + many blog posts    |

- OS: **Ubuntu 22.04 LTS**
- Control panel: Optional (you'll use SSH + command line)

### Option B — Business / Cloud Hosting

Supports Node.js via the **Setup Assistant**, but has limitations:
- No persistent `npm` process (uses a web-based panel)
- MySQL is available via phpMyAdmin
- **Not recommended** for this project — a VPS is far better

### Option C — Shared Hosting (Frontend only)

- Can host the built static files (`dist/`)
- Backend would still need a VPS or another Node.js provider
- **Not recommended** because it splits deployment

---

## 2. Purchase & Provision a VPS

1. Go to [hostinger.com](https://hostinger.com) → **VPS Hosting**.
2. Choose a plan and checkout.
3. After purchase, go to **VPS → Manage**.
4. Note down the **IP address**, **username** (usually `root`), and **root password**.
5. (Optional) Under **Settings**, you can reinstall the OS if needed.

---

## 3. Connect to Your VPS via SSH

### Windows (PowerShell / Terminal)

```powershell
ssh root@your-vps-ip
```

### macOS / Linux

```bash
ssh root@your-vps-ip
```

Enter your root password when prompted.

> **Tip:** On Windows, you can also use [PuTTY](https://putty.org) or **Windows Terminal**.

---

## 4. Initial Server Setup

Run these commands one by one:

```bash
# Update system packages
apt update && apt upgrade -y

# Install essential tools
apt install -y git curl wget nginx ufw

# Create a non-root user (optional but recommended)
adduser saiful
usermod -aG sudo saiful
```

---

## 5. Install Node.js 20+

```bash
# Install Node.js 20.x via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify
node -v    # should show v20.x.x
npm -v     # should show 10.x.x
```

---

## 6. Install & Configure MySQL 8.0

```bash
# Install MySQL
apt install -y mysql-server

# Check MySQL status
systemctl status mysql
```

### Secure MySQL

```bash
mysql_secure_installation
```

Follow the prompts:
- Set a root password
- Remove anonymous users → **Y**
- Disallow root login remotely → **Y**
- Remove test database → **Y**
- Reload privileges → **Y**

### Create Database & User

```bash
mysql -u root -p
```

Then run these SQL commands:

```sql
CREATE DATABASE saiful_studios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'saiful'@'localhost' IDENTIFIED BY 'your-strong-password-here';
GRANT ALL PRIVILEGES ON saiful_studios.* TO 'saiful'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> **For localhost access** (backend + database on same VPS), use `'saiful'@'localhost'`.
> If you need remote MySQL access (rare), use `'saiful'@'%'` and configure the firewall.

---

## 7. Deploy the Application

### 7.1 Clone the repository

```bash
cd /var/www
git clone https://github.com/your-username/saiful-react.git
cd saiful-react
```

### 7.2 Create the `.env` file

```bash
nano .env
```

Paste and fill in your values:

```ini
# Database
DB_HOST=localhost
DB_USER=saiful
DB_PASSWORD=your-strong-password-here
DB_NAME=saiful_studios
DB_PORT=3306

# Server
PORT=5000
NODE_ENV=production
JWT_SECRET=your-64-char-random-hex-here

# Admin cookie
ADMIN_COOKIE_NAME=admin_token

# CORS — when frontend and backend are on the same domain,
# you can use the same origin. Otherwise use your domain.
CORS_ORIGIN=https://yourdomain.com

# Public site URL
PUBLIC_SITE_URL=https://yourdomain.com

# Keep false in production — use migrations
DB_SYNC=false

# Admin credentials (needed once for seeding)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-admin-password
ADMIN_NAME=Saiful Islam
```

Generate a secure `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Save and exit (`Ctrl+X`, then `Y`, then `Enter`).

### 7.3 Install backend dependencies

```bash
cd server
npm install
```

### 7.4 Build the frontend

```bash
cd ..
npm install
npm run build
```

This creates a `dist/` folder with the compiled React app.

> The Express server (`server/server.js`) automatically serves these files:
> ```js
> const distDir = path.join(__dirname, '..', 'dist');
> app.use(express.static(distDir));
> ```

### 7.5 Run database migrations

```bash
npm run migrate
```

Expected output:
```
== 20260101000000-init-schema: migrating =======
== 20260101000000-init-schema: migrated
```

### 7.6 Seed the admin user

```bash
npm run seed
```

> Run this **only once**. It uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env` file.

---

## 8. Set Up PM2 (Process Manager)

PM2 keeps your app running after you log out and auto-restarts it if it crashes.

```bash
# Install PM2 globally
npm install -g pm2

# Start the application (from the project root)
pm2 start server/server.js --name saiful-api

# Save the process list so it restarts on server reboot
pm2 save

# Enable PM2 to start on boot
pm2 startup

# The command will show a line you need to run as root — copy & paste it.
# It looks something like:
#   sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

### Useful PM2 commands

```bash
pm2 status                 # View all running processes
pm2 logs saiful-api        # View logs
pm2 restart saiful-api     # Restart after code changes
pm2 stop saiful-api        # Stop the app
pm2 delete saiful-api      # Remove from PM2
```

---

## 9. Set Up Nginx as Reverse Proxy (Optional but Recommended)

Nginx acts as a gateway, forwarding public traffic to your Node.js app on port 5000.

```bash
# Remove default site
rm /etc/nginx/sites-enabled/default
```

Create a new config:

```bash
nano /etc/nginx/sites-available/saiful
```

Paste this (replace `yourdomain.com` with your actual domain or IP):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Increase upload limit for images (default is 1MB)
    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Optional: gzip compression for faster page loads
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;
    gzip_proxied any;
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/saiful /etc/nginx/sites-enabled/
nginx -t              # Test config for syntax errors
systemctl restart nginx
```

---

## 10. Configure Firewall (UFW)

```bash
# Allow SSH, HTTP, and HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'

# Enable the firewall
ufw enable

# Check status
ufw status
```

---

## 11. Set Up SSL (HTTPS) with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts — enter your email and agree to terms.
# Certbot auto-updates your Nginx config.
```

### Auto-renewal

Certbot sets up a cron job automatically. Test it:

```bash
certbot renew --dry-run
```

---

## 12. (Alternative) Deploy with Docker

If you prefer Docker over manual setup, use the existing `docker-compose.yml`:

```bash
cd /var/www/saiful-react

# Create .env file (same as step 7.2)
nano .env

# Build and run with Docker Compose
docker-compose up -d --build
```

This starts two containers:
- `saiful-api` — the Express app on port 5000
- `saiful-db` — MySQL 8.0

Then point Nginx to `http://127.0.0.1:5000` (same config as step 9).

---

## 13. Full Architecture Diagram

```
                     ┌─────────────────────────────────────┐
                     │         Hostinger VPS               │
                     │                                     │
                     │  ┌───────────────────────────────┐  │
                     │  │        Nginx (port 80/443)     │  │
                     │  │  Reverse Proxy + SSL (HTTPS)   │  │
                     │  └──────────┬────────────────────┘  │
                     │             │                        │
                     │  ┌──────────▼────────────────────┐  │
                     │  │    Express.js (port 5000)     │  │
                     │  │  ┌─────────┐ ┌────────────┐  │  │
                     │  │  │ API     │ │ Static     │  │  │
                     │  │  │ Routes  │ │ Frontend   │  │  │
                     │  │  │ /api/*  │ │ (dist/)    │  │  │
                     │  │  └────┬────┘ └────────────┘  │  │
                     │  └───────┼───────────────────────┘  │
                     │          │                           │
                     │  ┌───────▼───────────────────────┐  │
                     │  │     MySQL 8.0 (localhost)      │  │
                     │  │     saiful_studios database    │  │
                     │  └───────────────────────────────┘  │
                     │                                     │
                     │  PM2 keeps the app alive            │
                     │  Certbot auto-renews SSL            │
                     └─────────────────────────────────────┘
```

---

## 14. Deploying Updates

When you push new code to GitHub, update the VPS:

```bash
cd /var/www/saiful-react

# Pull latest code
git pull origin main

# Install new dependencies (if any)
cd server && npm install && cd ..

# Rebuild frontend
npm run build

# Run new migrations (if any)
npm run migrate

# Restart the app
pm2 restart saiful-api
```

---

## 15. Troubleshooting

| Problem                          | Fix                                                                 |
|----------------------------------|---------------------------------------------------------------------|
| App won't start                  | Check `.env` — especially `JWT_SECRET` and database credentials      |
| `Error: connect ECONNREFUSED`    | MySQL is not running: `systemctl start mysql`                        |
| `Unknown database`               | Create the database: `mysql -u root -p -e "CREATE DATABASE saiful_studios"` |
| Port 5000 already in use         | Kill the process: `kill $(lsof -t -i:5000)` then restart            |
| Can't connect via SSH            | Check that port 22 is allowed in Hostinger firewall panel           |
| Nginx 502 Bad Gateway            | App isn't running: `pm2 status` and `pm2 logs saiful-api`           |
| Images not uploading             | Check folder permissions: `chmod 755 /var/www/saiful-react/server/uploads` |
| SSL certificate not renewing     | Run `certbot renew` manually and check cron: `systemctl status cron` |
| High memory usage                | Check with `htop` — upgrade VPS plan if needed                      |

---

## 16. Quick Checklist

- [ ] Hostinger VPS purchased and provisioned
- [ ] SSH access working
- [ ] Node.js 20+ installed
- [ ] MySQL 8.0 installed with database and user created
- [ ] Project cloned to `/var/www/saiful-react`
- [ ] `.env` file configured with all variables
- [ ] Backend dependencies installed (`cd server && npm install`)
- [ ] Frontend built (`npm run build`)
- [ ] Database migrations run (`npm run migrate`)
- [ ] Admin user seeded (`npm run seed`)
- [ ] PM2 configured and app running (`pm2 list`)
- [ ] Nginx configured as reverse proxy
- [ ] UFW firewall enabled
- [ ] SSL certificate installed via Certbot
- [ ] Domain DNS pointing to VPS IP (A record)

---

## 17. Useful Hostinger Links

- [Hostinger VPS Dashboard](https://hpanel.hostinger.com/vps/)
- [Hostinger DNS Zone Editor](https://hpanel.hostinger.com/hosting/)
- [Hostinger Knowledge Base](https://support.hostinger.com)
