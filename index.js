const { Client, GatewayIntentBits, Partials, EmbedBuilder, Collection } = require('discord.js');
const fs = require('fs');

const TOKEN = process.env['TOKEN'];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === 'what is this server') {
        const { guild } = message;

        const embed = new EmbedBuilder()
            .setTitle(`EU MMC: A Community!`)
            .setDescription("This is a discord server made by **suf, soy and furk** for the community of **European Proxy** of Minemen Club")
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setColor('Red');

        await message.channel.send({ embeds: [embed] });
    }
});


client.login(TOKEN);