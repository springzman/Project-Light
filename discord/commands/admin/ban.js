// Admin Command: Ban User
const { SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('[ADMIN] Ban a user from the backend')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for ban')
                .setRequired(false)),
    async execute(interaction, config) {
        // Check if user is moderator
        if (!config.moderators.includes(interaction.user.id)) {
            return interaction.reply({ content: '❌ You don\'t have permission to use this command!', ephemeral: true });
        }

        const username = interaction.options.getString('username');
        const reason = interaction.options.getString('reason') || 'No reason provided';

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

            if (user.banned) {
                return interaction.reply({ content: '❌ User is already banned!', ephemeral: true });
            }

            user.banned = true;
            await user.save();

            await interaction.reply({
                content: `✅ Successfully banned **${user.username}**!\n\n**Reason:** ${reason}`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: '❌ Failed to ban user.', ephemeral: true });
        }
    },
};
