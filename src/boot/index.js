const { utilities } = global;
require('dotenv').config();
const { env } = process;
const moment = require('moment-timezone');
const bootstrapConfig = require('./config');
const bootstrapLogger = require('./logger');
const bootstrapApi = require('./api');
const bootstrapCron = require('./cron');
const bootstrapMailer = require('./mailer');
const bootstrapMongo = require('./mongodb');
const bootstrapNodeCache = require('./nodecache');

const bootstrap = async () => {
	const functionTag = "boot";
	try {
		String.prototype.capitalize = function () {
			return this.charAt(0).toUpperCase() + this.slice(1);
		};

		utilities.env = env;
		utilities.main_config = bootstrapConfig();
		moment.tz.setDefault(utilities.main_config.logging.timezone);
		utilities.logger = bootstrapLogger();
		/**
		 * #env NODE_ENV
		 */
		utilities.logger.info(`${functionTag}> Environment: ${env.NODE_ENV}`);
		utilities.logger.info(`${functionTag}> Initialised config (${env.NODE_ENV}.json)`);
		utilities.logger.info(`${functionTag}> Initialised logger (${utilities.main_config.logging.level})`);
		const mongoConnection = await bootstrapMongo();
		if (mongoConnection) {
			utilities.mailer = bootstrapMailer();
			utilities.logger.info(`${functionTag}> Initialised mailgun service`);
			utilities.cron = bootstrapCron();
			utilities.server = bootstrapApi();
			utilities.nodecache = bootstrapNodeCache();
			utilities.logger.info(`${functionTag}> Initialised nodecache service`);
		}

		const killService = async () => {
			utilities.logger.info(`${functionTag}> Stopping service`);
			if (mongoConnection)
				await mongoConnection.disconnect();
			return 0;
		};

		const sigtermHandler = () => {
		    killService().finally((exitCode) => process.exit(exitCode));
		};

		const exitEvents = ['SIGTERM', 'SIGINT'];
		exitEvents.forEach((event) => {
			process.on(event, sigtermHandler);
		});
	} catch (error) {
		console.log(JSON.stringify(error, Object.getOwnPropertyNames(error)));
	}
}

module.exports = bootstrap;
