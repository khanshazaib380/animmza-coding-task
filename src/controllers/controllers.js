

const { User, Task } = require('../models/models.js');
const Joi = require('joi');
const moment = require('moment');
const JWT_secret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const registerUser = async (req, res) => {
  try {
    // Define the Joi schema for request validation
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body);

    // If validation fails, return a 400 Bad Request response with the error details
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Destructure email and password from the validated value
    const { email, password } = value;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Return the newly created user
    res.status(201).json({ user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    // Define the Joi schema for request validation
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body);

    // If validation fails, return a 400 Bad Request response with the error details
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Destructure email and password from the validated value
    const { email, password } = value;

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign({ userId: user.id }, JWT_secret, {
      expiresIn: '5h',
    });

    // Return the JWT
    res.status(200).json({ jwt: token });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUser = async (req, res) => {
  try {
    // Define the Joi schema for request validation
    const schema = Joi.object({
      userId: Joi.number().integer().min(1).required(),
    });

    // Validate the request params against the schema
    const { error, value } = schema.validate({ userId: req.userData.id });

    // If validation fails, return a 400 Bad Request response with the error details
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Destructure userId from the validated value
    const { userId } = value;

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    res.status(200).json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createTask = async (req, res) => {
  try {
    // Define the Joi schema for request validation
    const schema = Joi.object({
      name: Joi.string().trim().required(),
    });

    // Validate the request body against the schema
    const { error, value } = schema.validate(req.body);

    // If validation fails, return a 400 Bad Request response with the error details
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Destructure the validated name from the value object
    const { name } = value;
    const userId = req.userData.id; // Assuming you have middleware to extract the user ID from the JWT

    // Create a new task associated with the user
    const task = await Task.create({ name, userId });

    // Return the newly created task
    res.status(201).json({ task: { id: task.id, name: task.name } });
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /list-tasks
const listTasks = async (req, res) => {
  try {
    const userId = req.userData.id; // Assuming you have middleware to extract the user ID from the JWT

    // Find all tasks associated with the user
    const tasks = await Task.findAll({ where: { userId } });

    // Return the list of tasks
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error in listTasks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  createTask,
  listTasks,
};


