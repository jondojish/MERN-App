const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    sender: {
        type: String,
        required: true,
    },
    recipient: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    sent: {
        type: Date, 
        default: Date.now }
})

module.exports = Messsge = mongoose.model('message', MessageSchema)