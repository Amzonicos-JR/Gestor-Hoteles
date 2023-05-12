'use strict'

const express = require('express');
const api = express.Router();
const roomController = require ('./room.controller')
const { ensureAuth} = require('../services/authenticated');

//Rutas Privadas [ADMIN-APP]
api.get('/test', ensureAuth, roomController.test)
api.post('/add-room',  roomController.addRoom)
api.put('/update-room/:id', roomController.updateRoom)
api.delete('/delete-room/:id', roomController.deleteRoom)
api.get('/get-rooms', roomController.getRooms)


module.exports = api;