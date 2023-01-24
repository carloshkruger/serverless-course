const { randomUUID } = require('node:crypto')
const Joi = require('@hapi/joi')

module.exports = class Handler {
  constructor({ dynamodb }) {
    this.dynamodb = dynamodb
    this.dynamoTable = 'Heroes'
  }

  static validator() {
    return Joi.object({
      name: Joi.string().min(2).max(100).required(),
      power: Joi.string().min(2).max(20).required(),
    })
  }

  async main(event) {
    const data = event.body
    const params = {
      TableName: 'Heroes',
      Item: {
        ...data,
        id: randomUUID(),
        createdAt: new Date().toISOString()
      }
    }
  
    await this.dynamodb.put(params).promise()
  
    const insertedItem = await this.dynamodb.query({
      TableName: 'Heroes',
      ExpressionAttributeValues: {
        ':id': params.Item.id,
      },
      KeyConditionExpression: 'id = :id'
    }).promise()
  
    return {
      statusCode: 200,
      body: JSON.stringify({ insertedItem }),
    };
  }
}