const { utilities } = global;
const moment = require('moment-timezone');
const winston = require('winston');
const { combine, timestamp, colorize, printf } = winston.format;
let timezone = null;

const logFormat = printf(({ level, message, timestamp }) => {
    return timezone ? `[${moment.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}][${level}] ${message}`
        : `[${moment.tz(timestamp, 'UTC').format('YYYY-MM-DD HH:mm:ss')}][${level}] ${message}`;
});

const bootstrapLogger = () => {
    const { main_config } = utilities;
    timezone = main_config.logging.timezone;
    return winston.createLogger({
        level: main_config.logging.level,
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            http: 3,
            verbose: 4,
            debug: 5,
            silly: 6
        },
        addColors: {
            error: 'red',
            warn: 'magenta',
            info: 'white',
            verbose: 'yellow',
            http: 'green',
            debug: 'blue'
        },
        format: combine(
            colorize(),
            timestamp(),
            logFormat
        ),
        handleExceptions: true,
        json: false,
        maxsize: 10485760, // 10MB
        maxFiles: 5,
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'server.log' })
        ],
    });
}

module.exports = bootstrapLogger;
