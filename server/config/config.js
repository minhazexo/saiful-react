const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const common = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'saiful_studios',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: false,
};

module.exports = {
  development: { ...common },
  test: { ...common, database: (process.env.DB_NAME || 'saiful_studios') + '_test' },
  production: { ...common },
};
