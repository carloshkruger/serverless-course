const { randomUUID } = require('node:crypto') 
const settings = require('../config/settings')
const axios = require('axios')
const cheerio = require('cheerio')
const { dynamodb } = require('./factory')

const scheduler = async (event) => {
  console.log('at', new Date().toISOString(), JSON.stringify(event))

  const { data } = await axios.get(settings.API_COMMIT_MESSAGE_URL)
  
  const $ = cheerio.load(data)
  const [ commitMessage ] = $('#content').text().trim().split('\n')

  console.log('Message:', commitMessage)

  const params = {
    TableName: settings.DB_TABLE_NAME,
    Item: {
      commitMessage,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    }
  }

  await dynamodb.put(params).promise()

  return {
    statusCode: 200
  }
}


module.exports = {
  scheduler
}