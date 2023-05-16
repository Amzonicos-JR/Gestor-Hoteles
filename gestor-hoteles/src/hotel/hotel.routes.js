'use strict'

const express = require('express');
const api = express.Router();
const hotelController = require('./hotel.controller');
const {ensureAuth} = require('../hotel/authenticated')

//Rutas Privadas 

api.get('/get', [ensureAuth],hotelController.getHotels)
api.get('/get/:id', [ensureAuth],hotelController.getHotel);
api.post('/add', [ensureAuth],hotelController.createHotel)
api.put('/update/:id', [ensureAuth],hotelController.updateService)
api.delete('/delete/:id', [ensureAuth],hotelController.deleteHotel);

module.exports = api;