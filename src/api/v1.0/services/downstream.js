const { utilities } = global;
const { logger } = utilities;
const axios = require('axios');

const cowinBaseUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public`;

const fetchSlotsByPin = async (filterParams = {}) => {
    const { pincode, date, vaccine } = filterParams;
    const downstreamParams = { pincode, date };
    if (vaccine) downstreamParams.vaccine = vaccine;
    const { data } = await axios.get(`${cowinBaseUrl}/calendarByPin`, {
        params: downstreamParams,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN'
        }
    });
    return data;
};

module.exports = {
    fetchSlotsByPin
};