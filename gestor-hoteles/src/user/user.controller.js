'use strict'

const User = require('./user.model');
const { validateData, encrypt, checkPassword } = require('../utils/validate');
const { createToken } = require('../services/jwt');
const userInfo = ['DPI', 'name', 'surname', 'age', 'phone', 'email', 'role']

exports.adminAmzonicos = async (req, res) => {
    try {
        let data = {
            DPI: 1234567891011,
            name: 'Amzonico',
            surname: 'Juniors',
            age: 18,
            phone: 12345678,
            email: 'amzonico@gmail.com',
            password: '123',
            role: 'ADMINAM'
        }
        data.password = await encrypt(data.password)
        let existsUser = await User.findOne({name: 'Amzonico'})
        if (existsUser) return console.log('Admin already created');
        let defaultAM = new User(data);
        await defaultAM.save();
        return console.log('Admin created sucessfully')
    } catch (err) {
        console.log(err);
    }
}

exports.register = async (req, res) => {
    try {
        let data = req.body;
        let params = {
            password: data.password,
        }
        let validate = validateData(params);
        if (validate) return res.status(400).send(validate);
        data.role = 'CLIENT';
        data.password = await encrypt(data.password)
        let user = new User(data);
        await user.save();
        return res.send({ message: 'Account created sucessfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error creating account', error: err.message })
    }
}

exports.login = async (req, res) => {
    try {
        let data = req.body;
        let credentials = {
            email: data.email,
            password: data.password
        }
        let msg = validateData(credentials);
        if (msg) return res.status(400).send(msg)
        let user = await User.findOne({ email: data.email });
        if (user && await checkPassword(data.password, user.password)) {
            let token = await createToken(user)
            return res.send({ message: 'User logged sucessfully', token });
        }
        return res.status(401).send({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error, not logged' });
    }
}

exports.update = async (req, res) => {
    try {
        let userId = req.params.id;
        let data = req.body;
        if (data.password || Object.entries(data).length === 0 || data.role) return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
        let existUser = await User.findOne({ _id: userId });
        if (existUser) {
            let userUp = await User.findOneAndUpdate(
                { _id: userId },
                data,
                { new: true }
            )
            return res.send({ message: 'Updating user', userUp });
        }
        return res.send({ message: 'User not found or not updating' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating user' })
    }
}

exports.delete = async (req, res) => {
    try {
        let userId = req.params.id;
        let userDeleted = await User.findOneAndDelete({ _id: userId });
        if (!userDeleted) return res.send({ message: 'Account not found and not deleted' });
        return res.send({ message: `Account with username ${userDeleted.username} deleted sucessfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not deleted' });
    }
}

exports.saveAdmins = async (req, res) => {
    try {
        let data = req.body;
        let params = {
            password: data.password,
        }
        let validate = validateData(params);
        if (validate) return res.status(400).send(validate);
        data.role = 'ADMIN';
        data.password = await encrypt(data.password)
        let user = new User(data);
        await user.save();
        return res.send({ message: 'Account created sucessfully' });
    } catch (err) {
        console.log(err);
    }
}
//Para Hoteles (SUPAMGUN)
exports.getAdmins = async (req, res) => {
    try {
        let users = await User.find({role: 'ADMIN'}).select(userInfo)
        return res.send({ message: 'Users found', users })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting users' });
    }
}

exports.getUsers = async (req, res) => {
    try {
        let users = await User.find({role: 'CLIENT'}).select(userInfo);
        let usersAdmins = await User.find({role: 'ADMIN'}).select(userInfo);
        return res.send({ message: 'Users found', users, usersAdmins })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting users' });
    }
}


exports.getUser = async (req, res) => {
    try {
        let userId = req.params.id;
        let user = await User.findOne({ _id: userId }).select(userInfo);
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.send({ message: 'User found', user: user })
    } catch (err) {
        console.error(err);
        return res.statuts(500).send({ message: 'Error getting cellar' });
    }
}