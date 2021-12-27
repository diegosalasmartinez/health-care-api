const User = require('../models/UserModel')
const Person = require('../models/PersonModel')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError('Please provide an username and password');
    }

    const user = await User.findOne({username});
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }
    
    const correctPassword = await user.comparePassword(password);
    if (!correctPassword) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    const person = await Person.findById(user.personId);
    const token = user.createJWT();
    const userResponse = {
        role: user.role,
        name: person.name,
        lastName: person.lastName
    }
    res.status(StatusCodes.OK).json({user: userResponse, token});
}

module.exports = {
    login
}