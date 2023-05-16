"use strict";
const Hotel = require('./hotel.model')
const User = require('../user/user.model')

exports.createHotel = async (req, res) => {
  try {
    let data = req.body;
    // Validar Duplicados
    let existHotel = await Hotel.findOne({ name: data.name });
    if (existHotel) {
      return res.status(409).send({ message: "Hotel already exists" });
    }
    let hotel = new Hotel(data);
    await hotel.save();
    return res.status(201).send({ message: "Hotel created successfully", hotel});
  } catch (err) {
    console.error(err);
    return res.status(400).send({ message: "Error creating Hotel" });
  }
};

exports.getHotels = async (req, res) => {
    try {
        let hotels = await Hotel.find();
        return res.send({message: 'Hotel found', hotels})
    } catch (error) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting hotels' });
    }
}

exports.getHotel = async(req, res)=>{
    try{
        //Obtener el Id del hotel a buscar
        let hotelId = req.params.id;
        //Buscarlo en BD
        let hotel = await Hotel.findOne({_id: hotelId});
        //Valido que exista el hotel
        if(!hotel) return res.status(404).send({message: 'Hotel not found'});
        //Si existe lo devuelvo
        return res.send({message: 'Hotel found:', hotel});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting hotel'});
    }
}

exports.deleteHotel = async (req, res) => {
  let hotelId = req.params.id;
  try {
    const hotel = await Hotel.findOne({ _id: hotelId });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    const user = await User.findOne({ hotel: hotelId });
    if (user) {
      user.hotel = null;
      await user.save();
    }
    await hotel.remove();
    res.json({ message: "Hotel eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al eliminar el hotel" });
  }
};

exports.addServicesEvents = async (req, res) => {
  const { hotelId, tipo, nombre, descripcion, fecha } = req.body;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "El hotel no existe" });
    }

    if (tipo === "servicio") {
      hotel.servicios.push({ nombre, descripcion });
    } else if (tipo === "evento") {
      hotel.eventos.push({ nombre, fecha, descripcion });
    } else {
      return res
        .status(400)
        .send({ message: "Tipo de servicio o evento no válido" });
    }

    await hotel.save();

    return res.send({ message: "Servicio o evento agregado correctamente", hotel });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error al agregar el servicio o evento" });
  }
};

