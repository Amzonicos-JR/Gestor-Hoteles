'use strict'

const Event = require('./events.model')

// Funcion test
exports.test = (req, res) => {
    res.send({ message: 'Test function is running Event' });
}

// Add Event
exports.addEvents = async (req, res) => {
    try {
        let data = req.body;
        //Validar duplicados
         let existEvent = await Event.findOne({name: data.name});
        if(existEvent) return res.status(404).send({message: 'Event already existed'}) 
        // save
        let event = new Event(data);
        await event.save();
        return res.send({ message: 'Event created sucessfully', event });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error Creating Event' })
    }
}

exports.getEvents = async(req, res)=>{
    try{
        //Buscar datos
        let events = await Event.find();
        return res.send({message: 'Event found', events});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting events'});
    }
}


exports.getEvent = async(req, res)=>{
    try{
        //Obtener el Id del producto a buscar
        let eventId = req.params.id;
        //Buscarlo en BD
        let event = await Event.findOne({_id: eventId});
        //Valido que exista el producto
        if(!event) return res.status(404).send({message: 'Event not found'});
        //Si existe lo devuelvo
        return res.send({message: 'Event found:', event});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting event'});
    }
}

exports.updateEvent = async(req, res)=>{
    try{
        //obtener el Id del producto
        let eventId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        
        //Actualizar
        let updateEvent = await Event.findOneAndUpdate(
            {_id: eventId},
            data,
            {new: true}
        )
        if(!updateEvent) return res.send({message: 'Event not found and not updated'});
        return res.send({message: 'Event updated:', updateEvent});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating product'});
    }
}

// Delete Event
exports.deleteEvent = async (req, res) => {
    try {
        //Obtener el id a eliminar
        let eventId = req.params.id;
        //Eliminar el usuario
        let eventDeleted = await Event.findOneAndDelete({ _id: eventId });
        if (!eventDeleted) return res.send({ message: 'Event not found and not deleted' });
        return res.send({ message: `Event with username ${eventDeleted.name} deleted sucessfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not deleted' });
    }
}