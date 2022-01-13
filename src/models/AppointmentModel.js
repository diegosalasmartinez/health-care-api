const mongoose = require('mongoose')
const { appointmentStatus } =  require('../utils/index')

const appointmentSchema = mongoose.Schema({
    doctorId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    secretaryId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    patientId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    floor: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    details: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: appointmentStatus,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Appointment', appointmentSchema)