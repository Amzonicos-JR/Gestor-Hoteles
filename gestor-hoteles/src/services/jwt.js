'use strict'

// Archivo para creacion de tokens
const jwt = require('jsonwebtoken');

exports.createToken = async(user)=>{
    try {
        let payload = {
            sub: user._id,
            dpi: user.dpi,
            name: user.name,
            surname: user.surname,
            age: user.age,
            phone: user.phone,
            email: user.email,
            role: user.role,   
            iat: Math.floor(Date.now() / 1000),// fecha actual en formato UNIX | Segundos
            exp: Math.floor(Date.now() / 1000) + (60 * 120)
        }
        return jwt.sign(payload, `${process.env.SECRET_KEY}`)
    } catch (err) {
        console.error(err);
        return err;
    }
}