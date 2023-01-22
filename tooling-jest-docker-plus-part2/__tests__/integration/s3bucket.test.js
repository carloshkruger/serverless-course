  const { beforeAll, afterAll, describe, it, expect } = require('@jest/globals')

  const { s3 } = require('../../src/factory')
  const { main } = require('../../src')

  describe('Testing AWS Services offline with LocalStack', () => {
    const bucketConfig = {
      Bucket: 'test'
    }

    beforeAll(async () => {
      await s3.createBucket(bucketConfig).promise()
    })

    afterAll(async () => {
      await s3.deleteBucket(bucketConfig).promise()
    })

    it('should return an array with a S3 Bucket', async () => {
      const expected = bucketConfig.Bucket

      const response = await main()
      const { allBuckets: { Buckets } } = JSON.parse(response.body)
      const { Name } = Buckets.find(({ Name }) => expected === Name)

      expect(Name).toStrictEqual(expected)
      expect(response.statusCode).toStrictEqual(200)
    })
  })