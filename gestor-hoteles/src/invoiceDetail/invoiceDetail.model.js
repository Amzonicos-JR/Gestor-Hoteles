"use strict";

const mongoose = require("mongoose");

const invoiceDetailSchema = mongoose.Schema({
  additionalServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    require: true,
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    require: true,
  }],
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    require: true,
  },
  subTotalAccount: {
    type: Number,
    require: true,
    default: 0
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model("InvoiceDetail", invoiceDetailSchema);
