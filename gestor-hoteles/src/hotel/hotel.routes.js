'use strict'

const express = require('express');
const api = express.Router();
const hotelController = require('./hotel.controller');
const {ensureAuth} = require('../services/authenticated')

//Rutas Privadas 

api.get('/get', hotelController.getHotels)
// api.get('/getHotel/:id',hotelController.getHotel);
api.post('/add', hotelController.createHotel)
api.delete('/delete/:id',hotelController.deleteHotel);
api.post('/search', hotelController.searchHotel);
api.put('/update/:id', hotelController.updateHotel);

module.exports = api;