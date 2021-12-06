import mongoose from 'mongoose'

const patientSchema = mongoose.Schema({
    clinicHistoryId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    allergies: {
        type: String,
        required: true
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
        required: true
    },
    civilStatus: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

var Patient = mongoose.model('Patient', patientSchema);

export default Patient;