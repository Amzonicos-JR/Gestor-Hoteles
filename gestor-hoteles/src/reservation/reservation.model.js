
'use strict'
const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        }
    ],
    cNoches: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    }

},
    {
        versionKey: false
    });

module.exports = mongoose.model('Reservation', reservationSchema);
