'use strict'

const Reservation = require('./reservation.model')
const Hotel = require('../hotel/hotel.model')
const Rooms = require('../room/room.model')
const { validateData } = require('../utils/validate')

// Función Test - [ADMIN APP]
exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}

// -ADD RESERVATION-
exports.addReservation = async (req, res) => {
    try {
        let data = req.body;
        let params = {
            hotel: data.hotel,
            cNoches: data.cNoches
        }
        let validate = validateData(params);
        if (validate) return res.status(404).send(validate);
        data.subTotal = 0;
        console.log('hola')
        // Llegar hasta las habitaciones
        let habitacionesH = await Hotel.findById({ _id: data.hotel });
        // Habitaciones Propias del Hotel
        // let habitacionesH2 = await Rooms.findById({ _id: data.hotel },).select('rooms');
        let rooms = await Rooms.find({ _id: { $in: habitacionesH.rooms } }, { status: 'AVAILABLE' }).select('price');
        console.log(rooms, 'Propias del hotel')
        // Validar que seleccione una habitacion
        let params2 = {
            rooms: data.rooms
        }
        let validate2 = validateData(params2);
        if (validate2) return res.status(404).send(validate2);

        // --- (SUBTOTAL - HABITACION) ----
        // Guardar el precio
        let priceH1 = await Rooms.findById({ _id: data.rooms }).select('price')
        console.log('precio hotel', priceH1)
        // Precio
        let precio = priceH1.price;
        data.subTotal = (precio * data.cNoches);
        // agregar id cliente del token
        data.user = req.user.sub;
        // save
        let reservation = new Reservation(data);
        await reservation.save();
        // Cambiar Disponibilidad de habitacion
        let roomsReservation = await Rooms.findById({ _id: data.rooms });
        roomsReservation.status = 'NOAVAILABLE';
        await roomsReservation.save();
        return res.send({ message: 'Reservation created sucessfully', reservation });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating Reservation', error: err.message })
    }
}

// -UPDATE ROOM-
exports.updateReservation = async (req, res) => {
    try {
        let reservationId = req.params.id;
        let data = req.body;
        if (data.user || Object.entries(data).length === 0) return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
        let reservation = await Reservation.findById({_id: reservationId}); 
        let priceH1 = await Rooms.findById({ _id: reservation.rooms }).select('price')      
        // Precio
        let precio = priceH1.price;
        data.subTotal = (precio * data.cNoches);
        let reservationUpdate = await Reservation.findOneAndUpdate(
            { _id: reservationId },
            data,
            { new: true }
        )
        if (!reservationUpdate) return res.status(404).send({ message: 'Reservation not found and not updated' });
        return res.send({ message: 'Reservation updated', reservationUpdate: reservationUpdate })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not updated reservation' });
    }
}

// -Delete Reservations-
exports.cancelReservation = async (req, res) => {
    try {
        let reservationId = req.params.id;
        let reservation = await Reservation.findById({_id: reservationId}).select('rooms');
        console.log(reservation, 'akjlshdakljdlakdja')
        let room = await Rooms.findByIdAndUpdate({_id: reservation.rooms}, {status: 'AVAILABLE'})
        let reservationCancel = await Reservation.findOneAndDelete({ _id: reservationId })
        if (!reservationCancel) return res.status(404).send({ message: 'Reservation not found and not cancel' });
        return res.send({ message: 'Reservation cancel', reservationCancel: reservationCancel })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error not cancel' });
    }
}

//-Get Reservations-
exports.getReservations = async (req, res) => {
    try {
        let reservations = await Reservation.find();
        return res.send({ message: 'Reservations found', reservations })
    } catch (error) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting reservation' });
    }
}