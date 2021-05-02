const { utilities } = global;
const AUTH_TOKEN_HEADER = "X-Stub-Auth";

const stubAuthMiddleware = async (req, res, next) => {
    const functionTag = "stubAuthMiddleware";
    const { logger, env } = utilities;
    const authToken = req.header(AUTH_TOKEN_HEADER);

    /**
     * #env STUB_AUTH_TOKEN
     */
    if (!authToken || authToken !== env.STUB_AUTH_TOKEN) {
        const error = {
            status: 401,
            error: `Auth token header not found or invalid for fulfilling ${req.method} request to ${req.url}`
        };
        logger.http(`${functionTag}> Request cannot be served.`);
        logger.http(`${functionTag}> Responding with ${JSON.stringify(error)}`);
        res.status(error.status).send(error);
    } else {
        logger.http(`${functionTag}> Request can be served.`);
        next();
    }
}

module.exports = stubAuthMiddleware;