const { utilities } = global;
const { env } = utilities;

const SLUGIFY_OPTS = {
    replacement: '_',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case, defaults to `false`
    strict: true,     // strip special characters except replacement, defaults to `false`
};

/**************************************************************
 *                  MONGODB CONSTANTS
 */

/**
 * #env MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE, MONGO_CLUSTER_URL
 */
const uriAtlas = `mongodb+srv://${env.MONGO_USER}:${env.MONGO_PASSWORD}@${env.MONGO_CLUSTER_URL}/${env.MONGO_DATABASE}?retryWrites=true&w=majority`;
const uriLocal = `mongodb://${env.MONGO_CLUSTER_URL}/${env.MONGO_DATABASE}?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;
const mongodb = {
    uri: uriLocal,
    clientOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    schemaOptions: {
        id: false
    }
};

/************************************************************** */

module.exports = {
    SLUGIFY_OPTS,
    mongodb
};