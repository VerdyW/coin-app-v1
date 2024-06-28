import mongoose from 'mongoose'
import { type } from 'os'

const portofolioSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: false,
    },

    exchange: {
        type: String,
        required: [true, 'please enter email'],
        unique: false,
    },

    coin: {
        type: String,
        required: [true, 'please enter email'],
        unique: false,
    },

    coinAmount: {
        type: Number,
        required: [true, 'please enter password'],
        unique: false,
    },

    averagePrice: {
        type: Number,
        required: [true, 'please enter password'],
        unique: false,
    },
})

const Portofolio = mongoose.models.portofolios || mongoose.model("portofolios", portofolioSchema)

export default Portofolio