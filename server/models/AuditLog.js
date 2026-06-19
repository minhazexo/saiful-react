const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    adminEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM('create', 'update', 'delete', 'login', 'logout', 'bulk_delete', 'bulk_update'),
      allowNull: false,
    },
    resource: {
      type: DataTypes.ENUM('blog', 'case_study', 'contact', 'admin'),
      allowNull: false,
    },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false,
  });

  return AuditLog;
};
