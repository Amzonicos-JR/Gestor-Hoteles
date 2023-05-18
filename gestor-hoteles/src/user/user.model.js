'use strict'

const { default: mongoose } = require('mongoose')
const moongose = require('mongoose')

const userSchema = mongoose.Schema({
    DPI: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    age: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, uppercase: true }
},
    {
        versionKey: false
    });
module.exports = mongoose.model('User', userSchema)