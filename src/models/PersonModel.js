import mongoose from 'mongoose'

const personSchema = mongoose.Schema({
    DNI: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

var Person = mongoose.model('Person', personSchema);

export default Person;