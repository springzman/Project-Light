// Admin Command: Delete Account
const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('[ADMIN] Delete a user account')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username to delete')
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
        const Friends = require('../../src/models/friends');

        try {
            const user = await User.findOne({ username_lower: username.toLowerCase() });

            if (!user) {
                return interaction.reply({ content: '❌ User not found!', ephemeral: true });
            }

            // Delete user and associated data
            await User.deleteOne({ accountId: user.accountId });
            await Profiles.deleteOne({ accountId: user.accountId });
            await Friends.deleteOne({ accountId: user.accountId });

            await interaction.reply({
                content: `✅ Successfully deleted account **${user.username}** and all associated data!`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error deleting account:', error);
            await interaction.reply({ content: '❌ Failed to delete account.', ephemeral: true });
        }
    },
};
