const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    whatsapp: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    service: {
      type: DataTypes.STRING(100),
    },
    message: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('new', 'contacted', 'interested', 'closed'),
      defaultValue: 'new',
    },
    source: {
      type: DataTypes.STRING(100),
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'contacts',
    timestamps: true,
  });

  return Contact;
};

