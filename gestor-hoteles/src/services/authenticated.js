'use strict'

//Archivo para verificar si toke es valido (expirado, valido)

const jwt = require('jsonwebtoken');

// Funcion middleware (barrera logica)
exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: `Doesnt contain header "AUTHORIZATION"`})
    }else{
        try { 
            //Obtener el token
            let token = req.headers.authorization.replace(/['"]+/g, '');
            //Decodificar el token
            var payload = jwt.decode(token, `${process.env.SECRET_KEY}`)
            // Validar que no haya expirado
            if(Math.floor(Date.now()/1000) >= payload.exp){
                return res.status(401).send({message: 'Expired token'})
            }
        } catch (err) {
            console.error(err);
            return res.status(400).send({message:'Invalid token'})
        }
        //inyectar a la solicitud un dato
        req.user = payload;
        next()
    }
}
