const { utilities } = global;
const { logger } = utilities;
const express = require('express');
const genericErrorHandler = require('../../../utils/genericErrorHandler');
const cowinService = require('../services/downstream');

const sessionsRouter = () => {
    const routes = express.Router();

    routes.get('/', async (req, res) => {
        try {
            const { pincode, date, vaccine, fee_type, age, only_available } = req.query;
            if (!pincode || !date) {
                logger.debug(`Got req params: pincode = ${pincode}, date = ${date}`);
                return res.status(422).send({
                    status: 422,
                    message: `Unprocessable Entity: Missing one or more mandatory params: (pincode, date).`
                });
            }

            const filterParams = { pincode, date, vaccine };
            const result = await cowinService.fetchSlotsByPin(filterParams);

            let { centers } = result;
            const sessions = [];
            if (centers.length > 0) {
                if (fee_type)
                    centers = centers.filter(center => center.fee_type == fee_type);
                for (let i = 0; i < centers.length; i++) {
                    center = centers[i];
                    let sessionsAtCenter = center.sessions;
                    if (age)
                        sessionsAtCenter = sessionsAtCenter.filter(s => s.min_age_limit <= age);
                    if (only_available == "true")
                        sessionsAtCenter = sessionsAtCenter.filter(s => s.available_capacity > 0);
                    const centerDetails = {
                        center_id: center.center_id,
                        name: center.name,
                        name_l: center.name_l,
                        state_name: center.state_name,
                        state_name_l: center.state_name_l,
                        district_name: center.district_name,
                        district_name_l: center.district_name_l,
                        block_name: center.block_name,
                        block_name_l: center.block_name_l,
                        pincode: center.pincode,
                        lat: center.lat,
                        long: center.long,
                        from: center.from,
                        to: center.to,
                        fee_type: center.fee_type,
                        vaccine_fees: center.vaccine_fees
                    };
                    sessionsAtCenter.forEach(s => {
                        s.center = centerDetails;
                    });
                    sessions.push(...sessionsAtCenter);
                }
            }

            return res.status(200).send({
                sessions: sessions
            });
        } catch (error) {
            return genericErrorHandler(res, error);
        }
    });

    return routes;
}

module.exports = sessionsRouter;