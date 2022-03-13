const Discord = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
require('dotenv').config();
require('./database')
const fs = require('fs');
const messageController = require('./controllers/messageController')

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...interaction) => event.execute(...interaction, client));
    }
}

client.on('messageCreate', async message => {
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
        const data = [
            {
                name: 'setchannels',
                description: 'Set the channels to use',
                options: [
                    {
                        name: 'inputchannel',
                        type: 'CHANNEL',
                        description: 'The channel where the users will send their messages',
                        required: true,
                    },
                    {
                        name: 'outputchannel',
                        type: 'CHANNEL',
                        description: 'The channel where the bot will send the approved message',
                        required: true,
                    },
                    {
                        name: 'moderationchannel',
                        type: 'CHANNEL',
                        description: 'The channel where the mods will approve the message',
                        required: true,
                    },
                    {
                        name: 'logchannel',
                        type: 'CHANNEL',
                        description: 'The channel where the logs will be stored',
                    }
                ]
            }
        ]

        const command = await client.guilds.cache.get(process.env.GUILD_ID)?.commands.set(data);
        console.log(command);
    }
    messageController.approvalMessageController(message, client);
});


client.login(process.env.DISCORD_BOT_TOKEN);

//https://discord.com/api/oauth2/authorize?client_id=883547842176761917&permissions=8&scope=bot%20applications.commands