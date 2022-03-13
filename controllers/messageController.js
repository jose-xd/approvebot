const channelsSchema = require('../schemas/Channels');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const approvalMessageController = async (message, client) => {

    const Channel = await channelsSchema.findOne({
        guildId: message.guild.id
    });

    if (!Channel) return;
    if (message.channel.id != Channel.inputChannel) return;
    if (message.author.bot) return;

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('accept')
                .setLabel('Accept')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('deny')
                .setLabel('Deny')
                .setStyle('DANGER'),
        );

    const attachments = message.attachments.map(a => a.attachment);
    const fullMessage = `By ${message.author}: ${message.content} ${attachments}`

    if (fullMessage.length >= 1000) {
        await message.delete();
        return message.channel.send("The message length must be fewer than 1000")
            .then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000)
            });
    } else {
        await client.channels.cache.get(Channel.moderationChannel).send({
            content: fullMessage, components: [row]
        });
        message.delete();
    }
}

const deleteMessageController = async (message, client, interaction, state) => {
    const Channel = await channelsSchema.findOne({
        guildId: message.guildId
    });

    if (!Channel) return await message.delete();
    if (!Channel.logChannel) return await message.delete();

    const embed = new MessageEmbed()
        .setColor("#5F0E8E")
        .setAuthor(`${state === 'denied' ? 'Denied by' : 'Approved by'}: ${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})`)
        .addField('Message:', message.content);

    await client.channels.cache.get(Channel.logChannel).send({ embeds: [embed] });
    await message.delete();
}

const resendMessageController = async (message, client) => {
    const Channel = await channelsSchema.findOne({
        guildId: message.guildId
    });
    if (!Channel) return;

    const userID = message.content.slice(5, 23)
    
    client.users.fetch(userID).then(async (user) => {
        const finalMessage = message.content.substring(26)

        const toSendChannel = await client.channels.cache.get(Channel.outputChannel);

        const token = Channel.webhookToken
        const webhooks = await toSendChannel.fetchWebhooks();
        const webhook = webhooks.find(wh => wh.token === token);
        if (!webhook) return;

        await webhook.send({
            content: `${finalMessage} `,
            username: user.username,
            avatarURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        });
    });
}

module.exports.approvalMessageController = approvalMessageController
module.exports.deleteMessageController = deleteMessageController
module.exports.resendMessageController = resendMessageController