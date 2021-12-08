import mongoose from 'mongoose'

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

var Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;