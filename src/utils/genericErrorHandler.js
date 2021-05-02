const { utilities } = global;
const { logger } = utilities;

const genericErrorHandler = (res, error) => {
    const formattedError = `Error in route: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`;
    logger.error(formattedError);
    return res.status(500).send({
        status: 500,
        message: formattedError
    });
};

module.exports = genericErrorHandler;