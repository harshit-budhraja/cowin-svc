const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const bootstrapMongo = async () => {
    const { utilities } = global;
    const { logger } = utilities;
    const { mongodb } = require('../utils/constants');
    const { uri, clientOptions } = mongodb;
    utilities.models = {};

    let connection = null;
    try {
        const modelDir = path.join(__dirname + '/../models');
        logger.debug(`bootMongoDB> Found schemas in ${modelDir}`);
        fs.readdirSync(modelDir).filter((file) => (file.indexOf(".") !== 0)).forEach((file) => {
            const fileName = file.split(".")[0];
            utilities.models[fileName.capitalize()] = mongoose.model(fileName, require(`${modelDir}/${file}`));
            logger.info(`bootMongoDB> Associated model schema for ${fileName.capitalize()}`);
        });
        /**
         * Mongoose supports buffering, so init the models
         * before establishing the connection to MongoDB
         */
        connection = await mongoose.connect(uri, clientOptions);
        logger.info(`bootMongoDB> Mongoose Connection Established`);
    } catch (error) {
        logger.error(`bootMongoDB> Error initialising Mongo: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    }
    return connection;
};

module.exports = bootstrapMongo;