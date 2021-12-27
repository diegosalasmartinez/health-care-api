const mongoose = require('mongoose')

const doctorSchema = mongoose.Schema({
    specialtyId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    CMP: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Doctor', doctorSchema)