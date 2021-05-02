const cron = require('node-cron');
const { utilities } = global;

const bootstrapCron = () => {
    const { main_config, logger } = utilities;
    const allCrons = Object.keys(main_config.cron.scheduler);
    allCrons.forEach(currCron => {
        if (main_config.cron.scheduler[currCron].active) {
            const cronService = require(`../api/v1.0/services/${currCron}`);
            cronService.init(cron);
            logger.info(`bootCron> Started ${currCron} service`);
        }
    });
    return cron;
}

module.exports = bootstrapCron;