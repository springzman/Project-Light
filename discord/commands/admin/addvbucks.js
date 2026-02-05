// Admin Command: Add V-Bucks
const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addvbucks')
        .setDescription('[ADMIN] Add V-Bucks to a user')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username to add V-Bucks to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of V-Bucks to add')
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction, config) {
        // Check if user is moderator
        if (!config.moderators.includes(interaction.user.id)) {
            return interaction.reply({ content: '❌ You don\'t have permission to use this command!', ephemeral: true });
        }

        const username = interaction.options.getString('username');
        const amount = interaction.options.getInteger('amount');

        // Connect to MongoDB if not connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(config.mongodb.database, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        const User = require('../../src/models/user');

        try {
            const user = await User.findOne({ username_lower: username.toLowerCase() });

            if (!user) {
                return interaction.reply({ content: '❌ User not found!', ephemeral: true });
            }

            user.vbucks += amount;
            await user.save();

            await interaction.reply({
                content: `✅ Successfully added **${amount.toLocaleString()}** V-Bucks to **${user.username}**!\n\n**New Balance:** ${user.vbucks.toLocaleString()}`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error adding V-Bucks:', error);
            await interaction.reply({ content: '❌ Failed to add V-Bucks.', ephemeral: true });
        }
    },
};
