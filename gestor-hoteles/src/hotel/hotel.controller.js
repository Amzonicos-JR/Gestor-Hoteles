"use strict";
const Hotel = require("./hotel.model");
const User = require("../user/user.model");
const Room = require("../room/room.model");
const validateData = require("../utils/validate");

exports.createHotel = async (req, res) => {
  try {
    let data = req.body;
    // Validar Duplicados
    let existHotel = await Hotel.findOne({ name: data.name });
    if (existHotel) {
      return res.status(409).send({ message: "Hotel already exists" });
    }
    // Validar Usuario
    let existUser = await User.findOne({ _id: data.user });
    if (!existUser) {
      return res.status(404).send({ message: "User not found" });
    }
    //Validar Duplicado Usuarios
    let existUserHotel = await Hotel.findOne({ user: data.user });
    if (existUserHotel) {
      return res.status(409).send({ message: "User already has a hotel" });
    }

    let hotel = new Hotel(data);
    await hotel.save();
    return res.send({ message: "Create hotel succesfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ message: "Error creating Hotel" });
  }
};

exports.searchHotel = async (req, res) => {
  try {
    //Buscar el hotel por su nombre o direccion
    let hotel = await Hotel.find({
      $or: [
        { name: { $regex: req.body.name, $options: "i" } },
        { direction: { $regex: req.body.name, $options: "i" } },
      ],
    });
    if (!hotel) {
      return res.status(404).send({ message: "No hotels found" });
    }
    return res.status(200).send({ hotel });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error searching hotel" });
  }
};

exports.getHotels = async (req, res) => {
  try {
    let hotels = await Hotel.find();
    return res.send({ hotels });
  } catch (error) {
    console.log(err);
    return res.status(500).send({ message: "Error getting hotels" });
  }
};

exports.getHotel = async (req, res) => {
  try {
    let id = req.params.id;
    let hotel = await Hotel.findOne({ _id: id }).populate("rooms").populate("events").populate("services")
    return res.send({ hotel });
  } catch (error) {
    console.log(err);
    return res.status(500).send({ message: "Error getting hotels" });
  }
};

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

exports.updateHotel = async (req, res) => {
  try {
    let hotelId = req.params.id;
    let data = req.body;
    let existUserHotel = await Hotel.findOne({ user: data.user });
    if (existUserHotel) {
      return res
        .status(409)
        .send({ message: "The user already manages a hotel" });
    }
    let hotelUpdated = await Hotel.findOneAndUpdate({ _id: hotelId }, data, {
      new: true,
    });
    if (!hotelUpdated)
      return res
        .status(404)
        .send({ message: "Hotel not found and not updated" });
    return res.send({ message: "Hotel updated", });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error update hotel" });
  }
};