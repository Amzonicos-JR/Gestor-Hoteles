'use strict'

const Room = require('./room.model')
const { validateData } = require('../utils/validate')

// Función Test - [ADMIN APP]
exports.test = (req, res) => {
    res.send({ message: 'Test function is running' });
}

// Room

// -ADD ROOM-
exports.addRoom = async (req, res) => {
    try {
        let data = req.body;
        let params = {
            numberRoom: data.numberRoom,
            amountPeople: data.amountPeople,
            typeRoom: data.typeRoom,
            price: data.price
        }
        let validate = validateData(params);
        if (validate) return res.status(404).send(validate);
        data.status = 'AVAILABLE'
        // data.typeRoom.toUpperCase();
        // save
        let room = new Room(data);
        await room.save();
        return res.send({ message: 'Room created sucessfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error Creating Room', error: err.message })
    }
}

// -UPDATE ROOM-
exports.updateRoom = async (req, res) => {
    try {
        let roomId = req.params.id;
        let data = req.body;
        if (data.typeRoom || data.status || Object.entries(data).length === 0) return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
        let roomUpdate = await Room.findOneAndUpdate(
            { _id: roomId },
            data,
            { new: true }
        )
        if (!roomUpdate) return res.status(404).send({ message: 'Room not found and not updated' });
        return res.send({ message: 'Room updated', roomUpdate })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not updated room' });
    }
}

// -Delete Room-
exports.deleteRoom = async (req, res) => {
    try {
        let roomId = req.params.id;
        let roomDelete = await Room.findOneAndDelete({ _id: roomId })
        if (!roomDelete) return res.status(404).send({ message: 'Room not found and not deleted' });
        return res.send({ message: 'Room deleted', roomDelete })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error not delete room' });
    }
}

//-Get Rooms-
exports.getRooms = async (req, res) => {
    try {
        let rooms = await Room.find();
        return res.send({message: 'Rooms found', rooms})
    } catch (error) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting rooms' });
    }
}

// -Buscar x id
exports.getRoomsID = async (req, res) => {
    try {
        let room = await Room.findOne({_id: req.params.id});
        return res.send({message: 'Room found', room})
    } catch (error) {
        return res.status(500).send({ message: 'Error getting rooms' });
    }
}
