import mongoose from 'mongoose'

const doctorSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    CMP: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    }
})

var Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;