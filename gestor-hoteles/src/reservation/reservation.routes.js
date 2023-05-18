'use strict'

const express = require('express');
const api = express.Router();
const reservationController = require('./reservation.controller')
const { ensureAuth } = require('../services/authenticated');

//Rutas Privadas [ADMIN-APP]
api.get('/test-reservation', reservationController.test)
api.post('/add-reservation', reservationController.addReservation)
api.put('/update-reservation/:id', reservationController.updateReservation);
api.delete('/cancel-reservation/:id', reservationController.cancelReservation);
api.get('/get-reservations', reservationController.getReservations);
api.get('/get-reservations-NOIV', reservationController.getReservationsNoInvoice);
api.get('/getRU/:id', reservationController.getReservationsByUser);
api.get('/getRH/:id', reservationController.getReservationsByHotel);

module.exports = api;
