'use strict'

const express = require('express');
const api = express.Router();
const serviceController = require('./services.controller');
const {ensureAuth} = require('../services/authenticated')

//Rutas Privadas 
api.get('/test',[ensureAuth],serviceController.test)
api.get('/get', [ensureAuth],serviceController.getServices)
api.get('/get/:id', [ensureAuth],serviceController.getService);
api.post('/add', [ensureAuth],serviceController.addServices)
api.put('/update/:id', [ensureAuth],serviceController.updateService)
api.delete('/delete/:id', [ensureAuth],serviceController.deleteService);

module.exports = api;