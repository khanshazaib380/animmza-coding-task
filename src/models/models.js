// Import necessary libraries
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load .env file into process.env

// Example: Access environment variables
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME; // Corrected variable name to DB_NAME



// Initialize Sequelize with your database connection
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql', // Change this to match your database type
});

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define the Task model
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define the association between User and Task models
User.hasMany(Task, { foreignKey: 'userId' });
Task.belongsTo(User, { foreignKey: 'userId' });

// Synchronize the models with the database
sequelize.sync()
  .then(() => {
    console.log('Database and tables created!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

module.exports = {
  User,
  Task,
};
