const mongoose = require('mongoose')

const specialtySchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    numDoctors: {
        type: Number,
        default: 0,
        required: false
    },
    active: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Specialty', specialtySchema)