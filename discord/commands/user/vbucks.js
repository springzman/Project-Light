// User Command: Check V-Bucks
const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vbucks')
        .setDescription('Check your V-Bucks balance'),
    async execute(interaction, config) {
        // Connect to MongoDB if not connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(config.mongodb.database, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        const User = require('../../src/models/user');

        try {
            const user = await User.findOne({ discordId: interaction.user.id });

            if (!user) {
                return interaction.reply({ content: '❌ You don\'t have an account! Use `/create` to make one.', ephemeral: true });
            }

            await interaction.reply({
                content: `💰 **Your V-Bucks Balance:** ${user.vbucks.toLocaleString()}`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error fetching V-Bucks:', error);
            await interaction.reply({ content: '❌ Failed to fetch V-Bucks balance.', ephemeral: true });
        }
    },
};
