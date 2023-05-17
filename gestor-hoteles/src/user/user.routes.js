'use strict'

const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.post('/register', ensureAuth, userController.register);
api.post('/login', ensureAuth, userController.login);
api.put('/update/:id', ensureAuth, userController.update);
api.delete('/delete/:id', ensureAuth, userController.delete);
api.get('/get', ensureAuth, userController.getUsers);
api.get('/get/:id', ensureAuth, userController.getUser);
api.post('/save', ensureAuth, userController.saveAdmins);
api.get('/getAdmins', ensureAuth, userController.getAdmins);

module.exports = api;