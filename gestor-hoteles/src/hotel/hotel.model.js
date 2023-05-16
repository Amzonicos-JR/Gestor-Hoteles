
'use strict'
const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  direction: {
    type: String,
    required: true
  },
  services: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }
  ],
  events: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }
  ],
  rooms: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);
