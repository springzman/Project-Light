// Admin Command: Unban User
const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('[ADMIN] Unban a user from the backend')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username to unban')
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

        try {
            const user = await User.findOne({ username_lower: username.toLowerCase() });

            if (!user) {
                return interaction.reply({ content: '❌ User not found!', ephemeral: true });
            }

            if (!user.banned) {
                return interaction.reply({ content: '❌ User is not banned!', ephemeral: true });
            }

            user.banned = false;
            await user.save();

            await interaction.reply({
                content: `✅ Successfully unbanned **${user.username}**!`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error unbanning user:', error);
            await interaction.reply({ content: '❌ Failed to unban user.', ephemeral: true });
        }
    },
};
