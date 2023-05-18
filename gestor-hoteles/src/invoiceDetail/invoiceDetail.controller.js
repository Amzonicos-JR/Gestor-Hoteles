'use strict'
const Bill = require('../bill/bill.model')
const InvoiceDetail = require('./invoiceDetail.model')
const Service = require('../services_/services.model')
const Event = require('../events_/events.model')
const Reservation = require('../reservation/reservation.model')

exports.add = async(req, res)=>{
    try{    
        let data = req.body 
        let total = 0
        //obtener el  precio de la reservacion
        let existRev = await Reservation.findOne({_id: data.booking})

        //Agregar el invoice detail 
        let invoiceDetail = new InvoiceDetail(data)
        await invoiceDetail.save()

        //actualizar el total 
        total = existRev.subTotal
        console.log(total)
        await InvoiceDetail.updateOne(
            {_id: invoiceDetail._id},
            {subTotalAccount: total},) 

        return res.status(200).send({message: 'Saved invoice detail sucessfully', data})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to saved invoice detail'})
    }
}

exports.get = async(req, res)=>{
    try{
        let invoiceDetails = await InvoiceDetail.find()
        //Agregar los populate

        return res.send({invoiceDetails})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting invoice datail'})
    }
}

exports.getId = async(req, res)=>{
    try{    
        let idInvoiceDetail = req.params.id
        let invoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!invoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})
        return res.send({invoiceDetail})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting invoice detail'})
    }
}

exports.getDisused = async(req, res)=>{
    try{
        //obtener todos los invoces details
        let usedInvoiceDetailIds = await Bill.distinct('invoiceDetail');

        // Obtener los documentos de InvoiceDetail que no están siendo utilizados
        let unusedInvoiceDetails = await InvoiceDetail.find({ _id: { $nin: usedInvoiceDetailIds } });
        
        return res.send({unusedInvoiceDetails})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting invoice detail disused'})
    }
}

exports.delete = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id 
        //Verificar el id
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'invoice datail not found'})

        //si ya esta asignado a una factura no se pueda eliminar 
        let existBill = await Bill.findOne({invoiceDetail: idInvoiceDetail})
        if(existBill) return res.send({message: 'The invoice detail exist in a bill'})

        let deletedInvoiceDetail = await InvoiceDetail.findOneAndDelete({_id: idInvoiceDetail})
        return res.send({message: 'Deleted invoice detail successfully', deletedInvoiceDetail})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to deleted invoice detail'})
    }
}

exports.update = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        let data = req.body
        
        let updatedInvoiceDetail = await InvoiceDetail.findOneAndUpdate(
            {_id: idInvoiceDetail},
            {subTotalAccount: data.subTotalAccount},
            {new: true})
        if(!updatedInvoiceDetail) return res.status(404).send({message: 'Error to updated or not found invoice detail'}) 
        return res.send({message: 'Updated invoice detail successfully', updatedInvoiceDetail})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to updated invoice detail'})
    }
}

//--------------------Additional Services
exports.getas = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        let invoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail}).populate('additionalServices')
        if(!invoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})
        let additionalServices = invoiceDetail.additionalServices
        return res.send({additionalServices})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting additional services to the invoice detail'})
    }
}

exports.getasnot = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        let servicesNot = []
        //verificar que el id exista
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})
        //obtener los servicios
        let services = await Service.find()
        //obtener lo servicio que tiene el invoice detail

        //compara lo que no tiene y guardarlo en una variable 
        for (let service of services) {
            if (!existInvoiceDetail.additionalServices.includes(service._id)) {
              servicesNot.push(service);
            }
          }

        return res.send({servicesNot})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting additional services not on to the invoice detail'})        
    }

}

exports.addas = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        let data = req.body
        let total = 0

        //verificar que el id exista
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})

        //verificar que el servicio exista 
        let existService = await Service.findOne({_id: data.additionalServices})
        if(!existService) return res.status(404).send({message: 'Service not found'})

        //verificar que el invoice detail no este en una factura 
        let existBill = await Bill.findOne({invoiceDetail: idInvoiceDetail})
        if(existBill) return res.status(409).send({message: 'Invoice detail in use a bill'})

        //verificar que el servicio ya lo haya adquirido 
        let existAdditionalService = await InvoiceDetail.findOne({_id: idInvoiceDetail, additionalServices: data.additionalServices})
        if(existAdditionalService) return res.status(409).send({message: 'Additional service already exist'})

        //sumar al subtotanl el precio del servicio
        total =  existInvoiceDetail.subTotalAccount + existService.price

        await InvoiceDetail.updateOne(
            {_id: idInvoiceDetail},
            {$push: { additionalServices: data.additionalServices},
             subTotalAccount: total},)

        return res.send({message: 'Service saved successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to added additional service to the invoice detail'})
    }
}

exports.deleteas = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        let data = req.body
        let total = 0

        //verificar que el id exista
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'}) 

        //verificar que el servicio exista 
        let existService = await Service.findOne({_id: data.additionalServices})
        if(!existService) return res.status(404).send({message: 'Service not found'})

        //verificar que el invoice detail no este en una factura 
        let existBill = await Bill.findOne({invoiceDetail: idInvoiceDetail})
        if(existBill) return res.status(409).send({message: 'Invoice detail in use a bill'})

        //verificar que tenga el servicio
        let existAdditionalService = await InvoiceDetail.findOne({_id: idInvoiceDetail, additionalServices: data.additionalServices})
        if(!existAdditionalService) return res.status(404).send({message: 'Additional service not found'})

        //restarlo al total 
        total = existInvoiceDetail.subTotalAccount - existService.price

        if(total <= 0) total=0

        await InvoiceDetail.updateOne(
            {_id: idInvoiceDetail},
            {$pull: {additionalServices: data.additionalServices},
             subTotalAccount: total})

        return res.send({message: 'Deleted additional service successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to deleted additional service to the invoice detail'})
    }
}

//--------------------Additional Services
exports.getEvents = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail}).populate('events')
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})
        let events = existInvoiceDetail.events
        return res.send({events})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting event to the invoice detail'})
    }
}

exports.getEventsNot = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        let eventsNot = []

        //verificar que el id exista
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})        

        let events = await Event.find()
        //obtener lo servicio que tiene el invoice detail

        //compara lo que no tiene y guardarlo en una variable 
        for (let event of events) {
            if (!existInvoiceDetail.events.includes(event._id)) {
              eventsNot.push(event);
            }
          }

        return res.send({eventsNot})        
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting event not on to the invoice detail'})        
    }

}

exports.addEvent = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        let data = req.body
        let total = 0

        //verificar que el id exista 
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})

        //verificar que el evento exista
        let existEvents = await Event.findOne({_id: data.event})
        if(!existEvents) return res.status(404).send({message: 'Event not found'})

        //verificar que el invoice detail no este en una factura 
        let existBill = await Bill.findOne({invoiceDetail: idInvoiceDetail})
        if(existBill) return res.status(409).send({message: 'Invoice detail in use a bill'})

        //verificar que el evento ya lo haya adquirido 
        let existEvent = await InvoiceDetail.findOne({_id: idInvoiceDetail, events: data.event})
        if(existEvent) return res.status(409).send({message: 'Event already exist'})

        //sumar la total el subtotal + precio del evento 
        total = existInvoiceDetail.subTotalAccount + existEvents.price

        await InvoiceDetail.updateOne(
            {_id: idInvoiceDetail},
            {$push: {events: data.event},
             subTotalAccount: total})
        return res.send({message: 'Event saved successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting event to the invoice datail'})
    }
}

exports.deleteEvent = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        let data = req.body
        let total = 0 

        //verificar que el id existe 
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})

        //verificar que el evento exista 
        let existEvents = await Event.findOne({_id: data.event})
        if(!existEvents) return res.status(404).send({message: 'Event not found'})

        //verificar que el invoice detail no este en una factura 
        let existBill = await Bill.findOne({invoiceDetail: idInvoiceDetail})
        if(existBill) return res.status(409).send({message: 'Invoice detail in use a bill'})
                
        //verificar que tenga el evento
        let existEvent = await InvoiceDetail.findOne({_id: idInvoiceDetail, events: data.event})
        if(!existEvent) return res.status(404).send({message: 'Event not found to the invoice detail'})

        //a total setearle la resta de evento al subtotal  
        total = existInvoiceDetail.subTotalAccount - existEvents.price
        if(total <= 0) total=0

        await InvoiceDetail.updateOne(
            {_id: idInvoiceDetail},
            {$pull: {events: data.event},
             subTotalAccount: total})
        return res.send({message: 'Event deteled successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to deleted event to the invoice detail'})
    }
}