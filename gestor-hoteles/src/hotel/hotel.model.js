
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
      ref: 'Service',
      required: true
    }
  ],
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    }
  ],
  rooms: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true}
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visits: {
    type: Number,
    default: 0,
    required: false
  }
},
  {
    versionKey: false
  });

module.exports = mongoose.model('Hotel', hotelSchema);
