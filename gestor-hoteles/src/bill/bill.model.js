'use strict'
const mongoose = require("mongoose");

const billSchema = mongoose.Schema({
    NIT: {
        type: String,
        require: true
    },
    invoiceDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InvoiceDetail',
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    Total: {
        type: Number,
        default: 0
    }

},{
    versionKey: false
})

module.exports = mongoose.model("Bill", billSchema);
