const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stream')
        .setDescription('Manage Twitch Streams.')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Stream command action')
                .setRequired(true)
                .addChoice('Add', 'add')
                .addChoice('Remove', 'remove')
                .addChoice('List', 'list'))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Stream Channel name')),
    async execute(interaction) {


        const action = interaction.options.getString('action');
        const name = interaction.options.getString('name');

        await interaction.deferReply({ ephemeral: true });

        // check we have a Streamers File
        // If it doesn't exist copy our dummy file over
        const exists = await fs.pathExists(path.join(__dirname, 'data/streamData.json'));
        if(!exists){
          await fs.copyFile(path.join(__dirname, 'data/streamData.json.example'), path.join(__dirname, 'data/streamData.json'));
        }
   
        // Read our streamers file
        const streamers = await fs.readJson(path.join(__dirname, 'data/streamData.json'));

        if(action === 'list'){
            const embed = new MessageEmbed()
            .setTitle('Twitch Stream Subscriptions')
            .setColor(0x6441a4);

            let message = "";
            let names = streamers.names;
            for (const streamer of names) {
                message += streamer + "\n";
            }
            embed.addField("Streamers", message, false);

            await interaction.editReply({ embeds: [embed] });
        }
        else{
            if (!name) {
                await interaction.editReply({ content: 'No twitch username given.' });
                return;
            }

            if(action === 'add'){
                if(checkUser(name, streamers)){
                    await interaction.editReply({ content: 'User already in streamers list.' });
                }
                else{
                    await fs.writeJson(path.join(__dirname, 'data/streamData.json'), addUser(name, streamers));
                    await interaction.editReply({ content: 'User added to streamers list.' });
                }
            }

            if(action === 'remove'){
                if(checkUser(name,streamers)){
                    await fs.writeJson(path.join(__dirname, 'data/streamData.json'), removeUser(name, streamers));
                    await interaction.editReply({ content: 'User removed from streamers list.' });
                }
                else{
                    await interaction.editReply({ content: 'User is not in streamers list.' });
                }   
            }

        }
       
        // Check if a user is in the list already
        function checkUser(name, streamers){
            let users = streamers.names;
            if(users){
                for (const streamer of users) {
                    if(streamer === name){
                        return true;
                    }
                }
            }
            return false;
        }
        // Add a user to the list
        function addUser(name, streamers){                
            streamers.names.push(name);
            return streamers;
        }
        function removeUser(name, streamers){
            streamers = {
                "names" : streamers.names.filter(e => e !== name)
             }
            return streamers;
        }
    },
};