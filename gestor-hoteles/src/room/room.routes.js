'use strict'

const express = require('express');
const api = express.Router();
const roomController = require ('./room.controller')
const { ensureAuth} = require('../services/authenticated');

//Rutas Privadas [ADMIN-APP]
api.get('/test',  ensureAuth, roomController.test)
api.post('/add-room', ensureAuth, roomController.addRoom)
api.put('/update-room/:id', ensureAuth, roomController.updateRoom)
api.delete('/delete-room/:id', ensureAuth, roomController.deleteRoom)
api.get('/get-rooms', ensureAuth, roomController.getRooms)


module.exports = api;
