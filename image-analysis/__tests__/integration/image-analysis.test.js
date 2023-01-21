const { expect, describe, test } = require('@jest/globals')
const requestMock = require('../mocks/request.json')
const aws = require('aws-sdk')

aws.config.update({
  region: 'us-east-1'
})

const {
  main
} = require('../../src')

describe('Image analyser test suite', () => {
  test('it should analyse successfully the image, returning the results', async () => {
    const expected = {
      statusCode: 200,
      body: 'A imagem tem\n97.63% de ser do tipo Cão\n97.63% de ser do tipo canino\n97.63% de ser do tipo animal de estimação\n97.63% de ser do tipo animal\n97.63% de ser do tipo mamífero'
    }

    const result = await main(requestMock)
    expect(result).toStrictEqual(expected)
  })

  test('given an empty query string it should return http status code 400', async () => {
    const expected = {
      statusCode: 400,
      body: 'Image is required.'
    }

    const result = await main({ queryStringParameters: {} })
    expect(result).toStrictEqual(expected)
  })

  test('given an invalid image url it should return http status code 500', async () => {
    const expected = {
      statusCode: 500,
      body: 'Internal server error.'
    }

    const result = await main({ queryStringParameters: { imageUrl: 'test'} })
    expect(result).toStrictEqual(expected)
  })
})