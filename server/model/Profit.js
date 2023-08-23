import mongoose, { Schema } from "mongoose";

const profitSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    CP: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const ProfitModel = mongoose.model('bravesubProfit', profitSchema)
export default ProfitModel