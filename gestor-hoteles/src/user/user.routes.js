'use strict'

const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.post('/register', userController.register);
api.post('/login', userController.login);
api.put('/update/:id', userController.update);
api.delete('/delete/:id', userController.delete);
api.get('/get', userController.getUsers);
api.get('/get/:id', userController.getUser);
api.post('/save', userController.saveAdmins);
api.get('/getAdmins', userController.getAdmins);
// api.get('/getBills/:id', userController.billByUser);

module.exports = api;