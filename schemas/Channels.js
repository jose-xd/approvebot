const mongoose = require('mongoose');

const channelsSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    inputChannel: {
        type: String,
        required: true
    },
    outputChannel: {
        type: String,
        required: true
    },
    webhookId: {
        type: String,
        required: true
    },
    webhookToken: {
        type: String,
        required: true
    },
    moderationChannel: {
        type: String,
        required: true
    },
    logChannel: {
        type: String
    }
})

module.exports = mongoose.model('channels-db', channelsSchema)