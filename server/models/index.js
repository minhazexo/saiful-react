const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'saiful_studios',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

const db = {};

// Load all models
db.Blog = require('./Blog')(sequelize);
db.CaseStudy = require('./CaseStudy')(sequelize);
db.Contact = require('./Contact')(sequelize);
db.Admin = require('./Admin')(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
