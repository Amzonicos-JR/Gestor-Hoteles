'use strict'

const express = require('express');
const api = express.Router();
const reservationController = require ('./reservation.controller')
const { ensureAuth} = require('../services/authenticated');

//Rutas Privadas [ADMIN-APP]
api.get('/test-reservation', ensureAuth, reservationController.test)
api.post('/add-reservation', ensureAuth,reservationController.addReservation)
api.put('/update-reservation/:id', ensureAuth, reservationController.updateReservation);
api.delete('/cancel-reservation/:id', ensureAuth, reservationController.cancelReservation);
api.get('/get-reservations', ensureAuth, reservationController.getReservations)


module.exports = api;
