import mongoose from 'mongoose'

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
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

var User = mongoose.model('User', userSchema);

export default User;