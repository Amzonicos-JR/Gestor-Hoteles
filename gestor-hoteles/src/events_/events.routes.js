'use strict'

const express = require('express');
const api = express.Router();
const eventController = require('./events.controller');
const {ensureAuth} = require('../services/authenticated')


//Rutas Privadas 
api.get('/test' , ensureAuth, eventController.test)
api.get('/get', ensureAuth,eventController.getEvents)
api.get('/get/:id', ensureAuth,eventController.getEvent);
api.post('/add', ensureAuth,eventController.addEvents)
api.put('/update/:id', ensureAuth, eventController.updateEvent)
api.delete('/delete/:id', ensureAuth, eventController.deleteEvent);

module.exports = api;