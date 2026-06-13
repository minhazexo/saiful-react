@echo off
REM ========================================
REM  Saiful Studios — Database Setup Script
REM  Run this ONCE after cloning the repo
REM ========================================

echo.
echo === Saiful Studios — Database Setup ===
echo.

REM Step 1: Check for .env
if not exist "..\.env" (
  echo [WARNING] No .env file found at the project root.
  echo.
  echo Create one with these variables:
  echo   DB_HOST=localhost
  echo   DB_PORT=3306
  echo   DB_NAME=saiful_studios
  echo   DB_USER=root
  echo   DB_PASSWORD=yourpassword
  echo   JWT_SECRET=your-64-char-random-hex
  echo   ADMIN_EMAIL=admin@saifulstudios.com
  echo   ADMIN_NAME=Saiful Islam
  echo   ADMIN_PASSWORD=your-strong-password
  echo.
  echo See .env.example for the full list.
  echo.
  pause
  exit /b 1
)

echo [1/3] Installing server dependencies...
call npm install
if %errorlevel% neq 0 (
  echo [ERROR] npm install failed!
  pause
  exit /b 1
)
echo [OK] Dependencies installed.

echo.
echo [2/3] Running database migrations...
call npx sequelize-cli db:migrate
if %errorlevel% neq 0 (
  echo [ERROR] Migration failed!
  echo Make sure MySQL is running and .env has correct credentials.
  pause
  exit /b 1
)
echo [OK] Migrations complete.

echo.
echo [3/3] Seeding admin user...
node seed.js
if %errorlevel% neq 0 (
  echo [WARNING] Seed may have failed.
  echo This is OK if the admin user already exists.
)

echo.
echo === Setup Complete! ===
echo.
echo Next steps:
echo   - Run "npm run dev" to start the server
echo   - Login at /admin/login with your admin credentials
echo.
pause
