const Discord = require('discord.js')

module.exports = {
    name: 'avatar',
    description: 'See the avatar of a user',
    async execute(interaction) {
        const member = interaction.options.getUser("member");

        if (!member) return interaction.reply('There is no member');

        const avatar = new Discord.MessageEmbed()
            .setImage(`https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png`)
            .setColor('#9c4c48');

        interaction.reply({ embeds: [avatar] }).catch(err => interaction.reply({ content: 'Something went wrong', ephemeral: true }));
    }
}