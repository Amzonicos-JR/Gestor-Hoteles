'use strict'
const Bill = require('./bill.model')
const InvoiceDetail = require('../invoiceDetail/invoiceDetail.model')

exports.get = async(req, res)=>{
    try{
        let bills = await Bill.find()
            .populate('invoiceDetail')
        return res.send({message: bills})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting the bills'})
    }
}

exports.getId = async(req, res)=>{
    try{
        let idBill = req.params.id
        let existBill = await Bill.findOne({_id: idBill})
            .populate('invoiceDetail')
        if(!existBill) return res.status(404).send({message: 'Bill not found'})
        return res.send({message: existBill})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting the bills'})
    }
}

exports.add = async(req, res)=>{
    try{
        let data = req.body
        if(!(data.NIT && data.invoiceDetail)) return res.status(400).send({message: 'Enter one NIT or invoiceDetail'})
        //verificar que invoice detail exists
        let existInvoiceDetail = await InvoiceDetail.findOne({_id: data.invoiceDetail})
        if(!existInvoiceDetail) return res.status(404).send({message: 'Invoice detail not found'})
        //fecha date.now
        data.date = Date.now()
        //actualizar el total ---Pendiente 

        let bill = new Bill(data)
        await bill.save()
        return res.send({message: 'Saved bill successfully', data})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to saved the bill'})
    }
}

exports.update = async(req, res)=>{
    try{
        let idBill = req.params.id
        let data = req.body
        if(!data.NIT) return res.status(400).send({message: 'Enter one NIT'})
        let updatedBill = await Bill.findOneAndUpdate(
            {_id: idBill},
            {NIT: data.NIT},
            {new: true}
        )
        if(!updatedBill) return res.status(404).send({message: 'Bill not found'})
        return res.send({message: updatedBill})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to updated the bill'})
    }
}

