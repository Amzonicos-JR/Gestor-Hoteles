'use strict'

const express = require('express')
const api = express.Router()
const invoiceDetailController = require('./invoiceDetail.controller')

//rutas publicas
api.get('/test', invoiceDetailController.test)
//rutas privadas
api.get('/get', invoiceDetailController.get)
api.get('/get/:id', invoiceDetailController.getId)
api.post('/add', invoiceDetailController.add)
api.put('/update/:id', invoiceDetailController.update)
api.delete('/delete/:id', invoiceDetailController.delete)

//additional services
api.get('/getas/:id', invoiceDetailController.getas)
api.put('/addas/:id', invoiceDetailController.addas)
api.put('/deleteas/:id', invoiceDetailController.deleteas)
//events 
api.get('/getevents/:id', invoiceDetailController.getEvents)
api.put('/addevent/:id', invoiceDetailController.addEvent)
api.put('/deleteevent/:id', invoiceDetailController.deleteEvent)

//rutas para admins

module.exports = api