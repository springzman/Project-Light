// User Command: Create Account
const { SlashCommandBuilder } = require('discord.js');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Create a Fortnite account')
        .addStringOption(option =>
            option.setName('email')
                .setDescription('Your email address')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Your username')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('password')
                .setDescription('Your password')
                .setRequired(true)),
    async execute(interaction, config) {
        const email = interaction.options.getString('email');
        const username = interaction.options.getString('username');
        const password = interaction.options.getString('password');

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
            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [
                    { email: email },
                    { username: username },
                    { discordId: interaction.user.id }
                ]
            });

            if (existingUser) {
                return interaction.reply({ content: '❌ An account with this email, username, or Discord ID already exists!', ephemeral: true });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const accountId = uuid().replace(/-/ig, '');
            const matchmakingId = uuid().replace(/-/ig, '');

            const newUser = new User({
                created: new Date(),
                discordId: interaction.user.id,
                accountId: accountId,
                username: username,
                username_lower: username.toLowerCase(),
                email: email,
                password: hashedPassword,
                matchmakingId: matchmakingId,
                vbucks: 1000,
                banned: false
            });

            await newUser.save();

            // Create default profiles
            const newProfile = new Profiles({
                accountId: accountId,
                profiles: {
                    athena: {},
                    common_core: {},
                    creative: {}
                }
            });
            await newProfile.save();

            // Create friends list
            const newFriends = new Friends({
                accountId: accountId,
                friends: [],
                blocked: []
            });
            await newFriends.save();

            await interaction.reply({
                content: `✅ Account created successfully!\n\n**Username:** ${username}\n**Email:** ${email}\n**Account ID:** ${accountId}\n**Starting V-Bucks:** 1000\n\nUse \`/exchange-code\` to get a login code for the game!`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Error creating account:', error);
            await interaction.reply({ content: '❌ Failed to create account. Please try again.', ephemeral: true });
        }
    },
};
