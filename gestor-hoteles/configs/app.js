'use strict'

const express = require('express');
//Logs de las solicitudes que recibe el servidor
const morgan = require('morgan');
//Aplica seguridad básica al servidor
const helmet = require('helmet');
//Aceptación de solicitudes desde otro sistema o desde la misma máquina
const cors = require('cors');
//Instancia de express
const app = express();
const port = process.env.PORT || 3500;

// Routes
<<<<<<< HEAD
const eventRoutes = require('../src/events_/events.routes')
const serviceRoutes = require('../src/services_/services.routes')
=======
const userRoutes = require('../src/user/user.routes');
/* const accountRoutes = require('../src/account/account.routes'); */

>>>>>>> dsalazar-2021181

//CONFIGURAR EL SERVIDOR HTTP DE EXPRESS
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Ruta
<<<<<<< HEAD
app.use('/event', eventRoutes);
app.use('/service', serviceRoutes)
=======
app.use('/user', userRoutes);
/* app.use('/user', userRoutes); */
>>>>>>> dsalazar-2021181


//Función donde se levanta el servidor
exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}