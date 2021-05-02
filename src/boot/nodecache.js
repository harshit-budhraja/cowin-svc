const NodeCache = require("node-cache");
/**
 * TTL set to low as the fallback can handle
 * requests - It's MongoDB now!
 */
const cacheOpts = {
    stdTTL: 10 * 60,        // 10 minutes
    checkperiod: 1 * 60,    // 1 minutes
    deleteOnExpire: true
};

const bootstrapNodeCache = () => {
    const { utilities } = global;
    const { logger } = utilities;
    const logPrefix = `bootNodeCache>`;
    const cache = new NodeCache(cacheOpts);

    cache.on('expired', (key, value) => {
        logger.debug(`${logPrefix} Cache expired for key ${key}`);
    });

    cache.on('del', (key, value) => {
        logger.debug(`${logPrefix} Cache deleted for key ${key}`);
    });

    return cache;
};

module.exports = bootstrapNodeCache;