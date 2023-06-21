const express = require('express');
const userRouteHandler = require('../controller/userRouteHandler');

const usersRouter = express.Router();

usersRouter.route('/signup').post(userRouteHandler.userSingup);
usersRouter.route('/login').post(userRouteHandler.userLogin);
usersRouter.route('/forget').post(userRouteHandler.forget);
module.exports = usersRouter;
