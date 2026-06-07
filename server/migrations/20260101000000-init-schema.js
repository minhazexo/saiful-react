'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admins', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
      },
      role: {
        type: Sequelize.ENUM('admin', 'editor'),
        defaultValue: 'editor',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('blogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: { type: Sequelize.STRING(255), allowNull: false },
      slug: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      excerpt: { type: Sequelize.TEXT, allowNull: false },
      content: { type: Sequelize.TEXT('long'), allowNull: false },
      category: { type: Sequelize.STRING(100), allowNull: false },
      author: { type: Sequelize.STRING(100), defaultValue: 'Saiful Islam' },
      image: { type: Sequelize.STRING(500) },
      readTime: { type: Sequelize.INTEGER, defaultValue: 5 },
      featured: { type: Sequelize.BOOLEAN, defaultValue: false },
      views: { type: Sequelize.INTEGER, defaultValue: 0 },
      published: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('case_studies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: { type: Sequelize.STRING(255), allowNull: false },
      slug: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      category: { type: Sequelize.STRING(100), allowNull: false },
      icon: { type: Sequelize.STRING(10), allowNull: false },
      challenge: { type: Sequelize.TEXT, allowNull: false },
      solution: { type: Sequelize.TEXT, allowNull: false },
      result: { type: Sequelize.TEXT, allowNull: false },
      resultHighlight: { type: Sequelize.STRING(255) },
      headerGradient: {
        type: Sequelize.STRING(255),
        defaultValue: 'linear-gradient(135deg,#FFE7CC,#fff)',
      },
      metrics: { type: Sequelize.JSON },
      images: { type: Sequelize.JSON },
      featured: { type: Sequelize.BOOLEAN, defaultValue: true },
      client: { type: Sequelize.STRING(255) },
      description: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable('contacts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING(255), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false },
      whatsapp: { type: Sequelize.STRING(20), allowNull: false },
      service: { type: Sequelize.STRING(100) },
      message: { type: Sequelize.TEXT },
      status: {
        type: Sequelize.ENUM('new', 'contacted', 'interested', 'closed'),
        defaultValue: 'new',
      },
      source: { type: Sequelize.STRING(100) },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex('blogs', ['published']);
    await queryInterface.addIndex('blogs', ['featured']);
    await queryInterface.addIndex('case_studies', ['featured']);
    await queryInterface.addIndex('contacts', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('contacts');
    await queryInterface.dropTable('case_studies');
    await queryInterface.dropTable('blogs');
    await queryInterface.dropTable('admins');
  },
};
