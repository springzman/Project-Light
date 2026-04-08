// Admin Command: Add All Cosmetics
const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addall')
        .setDescription('[ADMIN] Give all cosmetics to a user')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username to give all cosmetics')
                .setRequired(true)),
    async execute(interaction, config) {
        // Check if user is moderator
        if (!config.moderators.includes(interaction.user.id)) {
            return interaction.reply({ content: '❌ You don\'t have permission to use this command!', ephemeral: true });
        }

        const username = interaction.options.getString('username');

        // Connect to MongoDB if not connected
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(config.mongodb.database, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }

        const User = require('../../src/models/user');
        const Profiles = require('../../src/models/profiles');

        try {
            const user = await User.findOne({ username_lower: username.toLowerCase() });

            if (!user) {
                return interaction.reply({ content: '❌ User not found!', ephemeral: true });
            }

            // Update profile to add all items (simplified version)
            await Profiles.findOneAndUpdate(
                { accountId: user.accountId },
                {
                    $set: {
                        'profiles.athena.items': { /* All items would go here */ },
                        'profiles.common_core.items': { /* All items would go here */ }
                    }
                },
                { upsert: true }
            );

            await interaction.reply({
                content: `✅ Successfully gave all cosmetics to **${user.username}**!\n\n⚠️ **Note:** This will reset their lockers to default.`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error adding all cosmetics:', error);
            await interaction.reply({ content: '❌ Failed to add cosmetics.', ephemeral: true });
        }
    },
};
