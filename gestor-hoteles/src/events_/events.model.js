'use strict'

const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    }, 
    event_type:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
},
{
    versionKey:false 
});

module.exports = mongoose.model('Event', eventSchema);