// User Command: Get Account Details
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('details')
        .setDescription('Get your Fortnite account details'),
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

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('📊 Account Details')
                .addFields(
                    { name: 'Username', value: user.username, inline: true },
                    { name: 'Email', value: user.email, inline: true },
                    { name: 'Account ID', value: user.accountId, inline: false },
                    { name: 'V-Bucks', value: user.vbucks.toString(), inline: true },
                    { name: 'Status', value: user.banned ? '🚫 Banned' : '✅ Active', inline: true },
                    { name: 'Created', value: user.created.toLocaleDateString(), inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error fetching account details:', error);
            await interaction.reply({ content: '❌ Failed to fetch account details.', ephemeral: true });
        }
    },
};
