'use strict'

const express = require('express');
const api = express.Router();
const reservationController = require ('./reservation.controller')
const { ensureAuth} = require('../services/authenticated');

//Rutas Privadas [ADMIN-APP]
api.get('/test-reservation', reservationController.test)

api.post('/add-reservation', ensureAuth,reservationController.addReservation)
api.put('/update-reservation/:id', reservationController.updateReservation);
api.delete('/cancel-reservation/:id', reservationController.cancelReservation);
api.get('/get-reservations', reservationController.getReservations)


module.exports = api;
