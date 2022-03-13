const buttonController = require('../controllers/buttonController')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isButton()) {
            return buttonController.acceptDeny(interaction, client)
        }
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'echo') {
            const string = interaction.options.getString('message');
            await interaction.reply(string);
        }

        if (!client.commands.has(interaction.commandName) || interaction.member.user.bot) return;

        try {
            await client.commands.get(interaction.commandName).execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error executing this command', ephemeral: true });
        }
    },
};