const { Permissions } = require('discord.js');
const channelsSchema = require('../schemas/Channels')

module.exports = {
    name: 'setchannels',
    description: 'Set the channels',
    async execute(interaction) {
        const inputChannel = interaction.options.getChannel("inputchannel");
        const outputChannel = interaction.options.getChannel("outputchannel");
        const moderationChannel = interaction.options.getChannel("moderationchannel");
        let logChannel = interaction.options.getChannel("logchannel");

        if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply({ content: "You don't have enough permissions to run this command", ephemeral: true });
        }

        if (inputChannel.type != 'GUILD_TEXT') return interaction.reply(
            { content: "The channel type must be text", ephemeral: true }
        );
        if (outputChannel.type != 'GUILD_TEXT') return interaction.reply(
            { content: "The channel type must be text", ephemeral: true }
        );
        if (moderationChannel.type != 'GUILD_TEXT') return interaction.reply(
            { content: "The channel type must be text", ephemeral: true }
        );
        if (logChannel && logChannel.type != 'GUILD_TEXT') return interaction.reply(
            { content: "The channel type must be text", ephemeral: true }
        );

        const channelsResults = await channelsSchema.findOne(
            {
                guildId: interaction.guild.id
            }
        );
        const token = channelsResults.webhookToken
        const webhooks = await outputChannel.fetchWebhooks();
        const webhookFound = webhooks.find(wh => wh.token === token);

        if (channelsResults.webhookId && webhookFound) {
            await webhookFound.edit({
                name: 'Approve-Bot',
                avatar: null,
                channel: outputChannel,
            })
                .then(async (webhook) => {
                    try {
                        await channelsSchema.findOneAndUpdate(
                            {
                                guildId: interaction.guild.id
                            },
                            {
                                guildId: interaction.guild.id,
                                inputChannel: inputChannel.id,
                                outputChannel: outputChannel.id,
                                moderationChannel: moderationChannel.id,
                                webhookId: webhook.id,
                                webhookToken: webhook.token,
                                logChannel: logChannel
                            },
                            {
                                upsert: true
                            }
                        )
                    } catch {
                        return interaction.reply({ content: "Something went wrong", ephemeral: true })
                    }
                })
                .catch(console.error);

            return interaction.reply("The channels for approval were set successfully");
        }

        outputChannel.createWebhook('Approve-Bot')
            .then(async (webhook) => {
                try {
                    await channelsSchema.findOneAndUpdate(
                        {
                            guildId: interaction.guild.id
                        },
                        {
                            guildId: interaction.guild.id,
                            inputChannel: inputChannel.id,
                            moderationChannel: moderationChannel.id,
                            webhookId: webhook.id,
                            webhookToken: webhook.token,
                            logChannel: logChannel
                        },
                        {
                            upsert: true
                        }
                    )
                } catch {
                    return interaction.reply({ content: "Something went wrong", ephemeral: true })
                }

                return interaction.reply("The channels for approval were set successfully");
            })
            .catch(console.error);
    }
}