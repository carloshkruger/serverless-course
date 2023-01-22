"use strict";

const { s3 } = require('./factory')

module.exports.main = async (event) => {
  const allBuckets = await s3.listBuckets().promise()

  return {
    statusCode: 200,
    body: JSON.stringify({ allBuckets }),
  };
};
