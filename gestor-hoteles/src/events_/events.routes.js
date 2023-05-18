'use strict'

const express = require('express');
const api = express.Router();
const eventController = require('./events.controller');
const {ensureAuth} = require('../services/authenticated')


//Rutas Privadas 
api.get('/test' , eventController.test)
api.get('/get',eventController.getEvents)
api.get('/get/:id',eventController.getEvent);
api.post('/add',eventController.addEvents)
api.put('/update/:id', eventController.updateEvent)
api.delete('/delete/:id', eventController.deleteEvent);

module.exports = api;