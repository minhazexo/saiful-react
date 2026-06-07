const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CaseStudy = sequelize.define('CaseStudy', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    challenge: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    solution: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    result: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resultHighlight: {
      type: DataTypes.STRING(255),
    },
    headerGradient: {
      type: DataTypes.STRING(255),
      defaultValue: 'linear-gradient(135deg,#FFE7CC,#fff)',
    },
    metrics: {
      type: DataTypes.JSON,
    },
    images: {
      type: DataTypes.JSON,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    client: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: 'case_studies',
    timestamps: true,
  });

  return CaseStudy;
};
