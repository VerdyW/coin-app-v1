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

    buyDate: {
        type: Date,
        required: true,
        unique: false,
    },

    oldCoinAmount: {
        type: Number,
        required: true,
        unique: false,
    },
    
    oldAveragePrice: {
        type: Number,
        required: true,
        unique: false,
    },

    coinFee: {
        type: Number,
        required: true,
        unique: false,
    },
    
})

const Buy = mongoose.models.buys || mongoose.model("buys", portofolioSchema)

export default Buy