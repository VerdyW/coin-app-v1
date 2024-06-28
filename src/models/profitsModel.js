import mongoose from 'mongoose'
import { type } from 'os'

const portofolioSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: false,
    },

    exchange: {
        type: String,
        required: true,
        unique: false,
    },

    coin: {
        type: String,
        required: true,
        unique: false,
    },

    coinAmount: {
        type: Number,
        required: true,
        unique: false,
    },

    averagePrice: {
        type: Number,
        required: true,
        unique: false,
    },

    takeProfitsDate: {
        type: Date,
        required: true,
        unique: false,
    },

    totalProfits: {
        type: Number,
        required: true,
        unique: false
    },

    oldCoinAmount: {
        type: Number,
        required: true,
        unique: false
    }
})

const Profit = mongoose.models.profits || mongoose.model("profits", portofolioSchema)

export default Profit