'use strict'

const express = require('express');
const api = express.Router();
const serviceController = require('./services.controller');
const {ensureAuth} = require('../services/authenticated')

//Rutas Privadas
api.get('/test',serviceController.test)
api.get('/get', serviceController.getServices)
api.get('/get/:id',serviceController.getService);
api.post('/add',serviceController.addServices)
api.put('/update/:id',serviceController.updateService)
api.delete('/delete/:id',serviceController.deleteService);

module.exports = api;