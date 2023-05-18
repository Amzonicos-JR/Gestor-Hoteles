'use strict'

const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    numberRoom: {
        type: Number,
        unique: true,
        required: true
    },
    amountPeople: {
        type: Number,
        required: true
    },
    typeRoom: {
        type: String,
        uppercase: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        uppercase: true,
    }
},
    {
        versionKey: false
    });
module.exports = mongoose.model('Room', roomSchema);