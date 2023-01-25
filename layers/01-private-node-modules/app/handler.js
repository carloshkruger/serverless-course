'use strict';

const { formatDistance, subDays } = require('date-fns')

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true })
  };
};
