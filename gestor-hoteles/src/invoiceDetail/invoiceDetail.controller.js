'use strict'
const Bill = require('../bill/bill.model')
const InvoiceDetail = require('./invoiceDetail.model')

exports.add = async(req, res)=>{
    try{    
        let data = req.body 
        //verificar que exista la reservacion

        //Agregar al subtotal el precio de la habitacion por noches 
        let invoiceDetail = new InvoiceDetail(data)
        await invoiceDetail.save()
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

        return res.send({message: invoiceDetails})
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
        return res.send({message: invoiceDetail})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting invoice detail'})
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
        let invoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!invoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})
        return res.send({message: invoiceDetail.additionalServices})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting additional services to the invoice detail'})
    }
}

exports.addas = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        let data = req.body

        //verificar que el id exista
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})

        //verificar que el servicio exista 
        //verificar que el servicio ya lo haya adquirido 
        let existAdditionalService = await InvoiceDetail.findOne({_id: idInvoiceDetail, additionalServices: data.additionalServices})
        if(existAdditionalService) return res.status(409).send({message: 'Additional service already exist'})

        await InvoiceDetail.updateOne(
            {_id: idInvoiceDetail},
            {$push: { additionalServices: data.additionalServices }})

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
        //verificar que el id exista
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'}) 

        //verificar que tenga el servicio
        let existAdditionalService = await InvoiceDetail.findOne({_id: idInvoiceDetail, additionalServices: data.additionalServices})
        if(!existAdditionalService) return res.status(404).send({message: 'Additional service not found'})

        await InvoiceDetail.updateOne(
            {_id: idInvoiceDetail},
            {$pull: {additionalServices: data.additionalServices}})

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
        
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})
        return res.send({message: existInvoiceDetail.events})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting event to the invoice detail'})
    }
}

exports.addEvent = async(req, res)=>{
    try{
        let idInvoiceDetail = req.params.id
        let data = req.body

        //verificar que el id exista 
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})

        //verificar que el evento exista
        //verificar que el evento ya lo haya adquirido 
        let existEvent = await InvoiceDetail.findOne({_id: idInvoiceDetail, events: data.event})
        if(existEvent) return res.status(409).send({message: 'Event already exist'})

        await InvoiceDetail.updateOne(
            {_id: idInvoiceDetail},
            {$push: {events: data.event}})
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

        //verificar que el id existe 
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: idInvoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})

        //verificar que tenga el evento
        let existEvent = await InvoiceDetail.findOne({_id: idInvoiceDetail, events: data.event})
        if(!existEvent) return res.status(404).send({message: 'Event not found to the invoice detail'})

        await InvoiceDetail.updateOne(
            {_id: idInvoiceDetail},
            {$pull: {events: data.event}}
        )
        return res.send({message: 'Event deteled successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to deleted event to the invoice detail'})
    }
}