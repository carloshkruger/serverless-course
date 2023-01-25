const env = require('env-var')

const settings = {
  NODE_ENV: env.get('NODE_ENV').required().asString(),
  API_COMMIT_MESSAGE_URL: env.get('API_COMMIT_MESSAGE_URL').required().asString(),
  DB_TABLE_NAME: env.get('DB_TABLE_NAME').required().asString(),
}

module.exports = settings