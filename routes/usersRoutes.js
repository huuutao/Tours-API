const express = require('express');
const userRouteHandler = require('../controller/userRouteHandler');

const usersRouter = express.Router();

usersRouter.route('/signup').post(userRouteHandler.userSingup);

module.exports = usersRouter;
