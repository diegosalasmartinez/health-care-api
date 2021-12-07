import mongoose from 'mongoose'

const specialtySchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

var Specialty = mongoose.model('Specialty', specialtySchema);

export default Specialty;