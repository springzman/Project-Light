// Discord Bot - Main File
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = JSON.parse(fs.readFileSync('./Config/config.json', 'utf8'));

if (!config.discord.enabled) {
    console.log('Discord bot is disabled in config.json');
    process.exit(0);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

// Load commands from user folder
const userCommandsPath = path.join(__dirname, 'commands', 'user');
const userCommandFiles = fs.readdirSync(userCommandsPath).filter(file => file.endsWith('.js'));

for (const file of userCommandFiles) {
    const filePath = path.join(userCommandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

// Load commands from admin folder
const adminCommandsPath = path.join(__dirname, 'commands', 'admin');
const adminCommandFiles = fs.readdirSync(adminCommandsPath).filter(file => file.endsWith('.js'));

for (const file of adminCommandFiles) {
    const filePath = path.join(adminCommandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

client.once('ready', async () => {
    console.log(`✅ Discord bot logged in as ${client.user.tag}`);
    
    // Register slash commands
    const commands = [];
    for (const command of client.commands.values()) {
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(config.discord.token);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, config);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(config.discord.token);
