// User Command: Lookup User
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lookup')
        .setDescription('Look up another user\'s account')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username to look up')
                .setRequired(true)),
    async execute(interaction, config) {
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

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🔍 User Lookup')
                .addFields(
                    { name: 'Username', value: user.username, inline: true },
                    { name: 'Account ID', value: user.accountId, inline: true },
                    { name: 'Status', value: user.banned ? '🚫 Banned' : '✅ Active', inline: true },
                    { name: 'Created', value: user.created.toLocaleDateString(), inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error looking up user:', error);
            await interaction.reply({ content: '❌ Failed to lookup user.', ephemeral: true });
        }
    },
};
