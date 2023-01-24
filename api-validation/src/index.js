"use strict";

const { dynamodb } = require('./factory')
const Handler = require('./handler');
const { validatorDecorator } = require('./utils');

const handler = new Handler({
  dynamodb
})

const heroesInsert = validatorDecorator(handler.main.bind(handler), Handler.validator(), 'body')

const heroesTrigger = async (event) => {
  console.log('event', JSON.stringify(event))

  return {
    statusCode: 200,
    body: JSON.stringify({ allBuckets }),
  };
};

module.exports = {
  heroesInsert,
  heroesTrigger
}