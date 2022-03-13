const messageController = require('./messageController')

const acceptDenyController = async (interaction, client) => {
    if (interaction.customId === 'deny') {
        await messageController.deleteMessageController(interaction.message, client, interaction, 'denied')
        interaction.reply({ content: "Content denied", ephemeral: true })
    }
    if (interaction.customId === 'accept') {
        await messageController.resendMessageController(interaction.message, client)
        await messageController.deleteMessageController(interaction.message, client, interaction, 'approved')
        interaction.reply({ content: "Content approved", ephemeral: true })
    }
}

module.exports.acceptDeny = acceptDenyController