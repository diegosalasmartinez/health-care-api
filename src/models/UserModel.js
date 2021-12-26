const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    personId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    doctorId: {
        type: mongoose.Types.ObjectId,
        required: false
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
})

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_SECRET,
        { expiresIn: 300 }
    )    
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema)