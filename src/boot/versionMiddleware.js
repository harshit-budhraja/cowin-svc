const { utilities } = global;
// Exempted environments for enhanced middleware RCA in responses
const exemptedEnv = ["production"];

const versionMiddleware = async (req, res, next) => {
    const functionTag = "versionMiddleware";
    const { main_config, logger, env } = utilities;
    const availableApiVersions = main_config.api.versions;
    const reqApiVersion = req.url.split('/')[1];
    logger.http(`${functionTag}> Receiving request to api version: ${reqApiVersion}`);
    if (availableApiVersions[reqApiVersion] && !availableApiVersions[reqApiVersion].deprecated) {
        logger.http(`${functionTag}> Request can be served.`);
        next();
    } else {
        const error = {
            status: 501,
            error: `Cannot find an implementation for ${req.method} ${req.url}`
        };
        if (!exemptedEnv.includes(env.NODE_ENV)) {
            const rca = [];
            if (!availableApiVersions[reqApiVersion])
                rca.push(`Cannot find ${reqApiVersion} in configs`);
            else if (availableApiVersions[reqApiVersion].deprecated)
                rca.push(`${reqApiVersion} is deprecated`);
            error.rca = rca;
        }
        logger.http(`${functionTag}> Request cannot be served.`);
        logger.http(`${functionTag}> Responding with ${JSON.stringify(error)}`);
        res.status(error.status).send(error);
    }
}

module.exports = versionMiddleware;