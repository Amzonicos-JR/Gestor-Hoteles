'use strict'

const express = require('express');
const api = express.Router();
const hotelController = require('./hotel.controller');
const {ensureAuth} = require('../services/authenticated')

//Rutas Privadas 

api.get('/get', hotelController.getHotels)
api.get('/getHotel/:id', [ensureAuth],hotelController.getHotel);
api.post('/add', [ensureAuth],hotelController.createHotel)
api.delete('/delete/:id', [ensureAuth],hotelController.deleteHotel);

module.exports = api;