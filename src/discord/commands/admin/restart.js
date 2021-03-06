const { Command } = require('discord.js-commando');
const SteamID = require('steamid');
const Promise = require('bluebird');
const { exec } = require('child_process');
const msgFromAdmin = require('../../msgFromAdmin');
const connection = require('../../connection');
const config = require('../../config');
const lastPlayedMapsQuery = require('../../lastPlayedMapsQuery');
const execQuery = require('../../../common/execQuery');
const formatDate = require('../../../common/formatDate');
const logger = require('../../../cli/logger');

const execPromise = command => new Promise(((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            reject(error);
            return;
        }
        resolve(stdout.trim());
    });
}));

class RestartCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            group: 'admin',
            memberName: 'restart',
            description: 'Restart a server. Requires server admin role',
            argsPromptLimit: 0,
            args: [
                {
                    key: 'serverNum',
                    prompt: 'Server Number',
                    type: 'integer',
                    default: 1,
                    validate: (value) => {
                        if (value >= 1 && value <= config.settings.serverCount) return true;
                        return `Server number must be between 1 and ${config.settings.serverCount}`;
                    },
                },
            ],
        });
    }

    hasPermission(msg) {
        return msgFromAdmin(msg);
    }

    async run(msg, { serverNum }) {
        if (config.settings.botChannels.indexOf(msg.channel.name) !== -1) {
            try {
                const restartCmd = `/etc/init.d/srcds1 restart ${serverNum}`;
                const stdout = await execPromise(restartCmd);
                logger.info(`stdout: ${stdout}`);
                const { results } = await execQuery(connection, lastPlayedMapsQuery(config.settings.ignoredCampaigns));
                const nextMap = results.pop();
                await msg.say(`Restarting server ${serverNum}... Next map: ${nextMap.campaign}. Last played: ${formatDate(new Date(nextMap.startedAt * 1000)).slice(0, -6).padEnd(10, ' ')}`);
            }
            catch (e) {
                logger.error(e);
                await msg.say('Restart failed.');
            }
        }
    }
}

module.exports = RestartCommand;
