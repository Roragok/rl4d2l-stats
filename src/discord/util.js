const { Collection } = require('discord.js');
const Promise = require('bluebird');
const config = require('./config');
const logger = require('../cli/logger');

const HOUR_MILLISECONDS = 3600000;
const msgHasL4DMention = msg => msg.mentions.roles.find(role => role.name === config.settings.inhouseRole);
const msgRemainingTimeLeft = msg => Math.max(msg.createdTimestamp + HOUR_MILLISECONDS - Date.now(), 0);

const fetchMessageReactionUsers = async (msg) => {
    return Promise.reduce(msg.reactions.array(), async (users, reaction) => {
        const fetchedUsers = await reaction.fetchUsers();
        logger.debug(`fetched message ${msg.id} reaction ${reaction.emoji} users ${fetchedUsers.size}`);
        return users.concat(fetchedUsers);
    }, new Collection());
}
    
module.exports = {
    HOUR_MILLISECONDS,
    msgHasL4DMention,
    msgRemainingTimeLeft,
    fetchMessageReactionUsers,
};
