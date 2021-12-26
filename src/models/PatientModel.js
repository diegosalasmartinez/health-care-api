const mongoose = require('mongoose')

const patientSchema = mongoose.Schema({
    personId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    clinicHistory: {
        reason: {
            type: String,
            required: false
        },
        currentIllness: {
            type: String,
            required: false
        },
        historyDesease: {
            type: String,
            required: false
        },
        alcohol: {
            type: String,
            required: false
        },
        smoke: {
            type: String,
            required: false
        },
        drugs: {
            type: String,
            required: false
        },
        sexuality: {
            type: String,
            required: false
        },
        others: {
            type: String,
            required: false
        }
    },
    code: {
        type: String,
        required: true
    },
    allergies: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    occupation: {
        type: String,
        required: false
    },
    civilStatus: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Patient', patientSchema)