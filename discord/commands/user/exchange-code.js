// User Command: Generate Exchange Code
const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exchange-code')
        .setDescription('Generate a login exchange code for Fortnite'),
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

            if (user.banned) {
                return interaction.reply({ content: '❌ Your account is banned and cannot generate exchange codes.', ephemeral: true });
            }

            // Generate exchange code (stored in memory, would be managed by main backend)
            const exchangeCode = uuid().replace(/-/ig, '');

            // In a real implementation, you'd store this in the backend
            // For now, we'll just display it
            await interaction.reply({
                content: `✅ **Exchange Code Generated!**\n\n\`\`\`${exchangeCode}\`\`\`\n\n**How to use:**\n1. Launch Fortnite\n2. When prompted for login, use this exchange code\n3. Code expires in 5 minutes\n\n**Note:** Save this code immediately! It will only be shown once.`,
                ephemeral: true
            });

            // TODO: Send this to the backend API to store temporarily
            // This is a simplified version for demonstration

        } catch (error) {
            console.error('Error generating exchange code:', error);
            await interaction.reply({ content: '❌ Failed to generate exchange code.', ephemeral: true });
        }
    },
};
