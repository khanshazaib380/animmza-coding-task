const express = require('express');
const Router = express.Router();
const { registerUser,
    loginUser,
    getUser,
    createTask,
    listTasks} = require('../controllers/controllers');

const authMiddleware=require('../middlewares/auth')

Router.post('/register',registerUser); //done
Router.post('/login',loginUser); //done
Router.get('/user', authMiddleware, getUser); //done
Router.post('/create-task',authMiddleware,createTask); //done
Router.get('/list-tasks', authMiddleware, listTasks); 




module.exports = Router;