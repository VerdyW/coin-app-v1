import mongoose from 'mongoose'
import { type } from 'os'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'please enter username'],
        unique: true,
    },

    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true,
    },

    password: {
        type: String,
        required: [true, 'please enter password'],
        unique: true,
    },

    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
})

const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User