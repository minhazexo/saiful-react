const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const db = require('./models');

function readEnv(name) {
  const v = process.env[name];
  if (v === undefined || v === null || String(v).trim() === '') {
    return null;
  }
  return String(v);
}

async function seed() {
  try {
    console.log('Seeding database…');

    await db.sequelize.authenticate();
    console.log('Database connection established');

    if (process.env.DB_SYNC === 'true') {
      await db.sequelize.sync({ alter: true });
      console.log('Tables synced (DB_SYNC=true)');
    } else {
      console.log('Skipping sync. Run "npm run migrate" first if tables do not exist.');
    }

    const ADMIN_EMAIL = readEnv('ADMIN_EMAIL') || 'admin@saifulstudios.com';
    const ADMIN_NAME = readEnv('ADMIN_NAME') || 'Saiful Islam';

    let ADMIN_PASSWORD = readEnv('ADMIN_PASSWORD');
    if (!ADMIN_PASSWORD) {
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ ADMIN_PASSWORD is required in production. Refusing to generate one.');
        process.exit(1);
      }
      ADMIN_PASSWORD = crypto.randomBytes(12).toString('base64url');
      console.log('⚠️  No ADMIN_PASSWORD in env — generated a one-time random password for first run.');
    } else if (ADMIN_PASSWORD.length < 12) {
      console.error('❌ ADMIN_PASSWORD must be at least 12 characters.');
      process.exit(1);
    }

    const existing = await db.Admin.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
      console.log('Delete the admins table row first if you want to recreate.');
      process.exit(0);
    }

    const admin = await db.Admin.create({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
      role: 'admin',
    });

    console.log('Admin user created');
    console.log('   ----------------------------------------');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Role:     ${admin.role}`);
    console.log('   ----------------------------------------');
    console.log('   Change the password after first login!');

    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    console.error('Make sure your MySQL is running, .env credentials are correct, and you have run "npm run migrate".');
    process.exit(1);
  }
}

seed();
