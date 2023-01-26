'use strict';

const { randomUUID } = require('node:crypto');
const { writeFile, readFile, unlink } = require('node:fs/promises');
const axios = require('axios');
const mememaker = require('@erickwendel/meme-maker')

function generateImagePath() {
  const isLocal = process.env.IS_OFFLINE === 'true'
  const folder = isLocal ? '' : '/tmp/'
  return `${folder}${randomUUID()}.png`
}

async function saveImageLocally(imageUrl, imagePath) {
  const { data } = await axios.get(imageUrl, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(data, 'base64')
  await writeFile(imagePath, buffer)
}

async function generateImageBase64(imageUrl) {
  return readFile(imageUrl, 'base64')
}

async function deleteImages(...imageUrls) {
  await Promise.all(imageUrls.map(imageUrl => unlink(imageUrl)))
}

module.exports.mememaker = async (event) => {
  const { image, topText, bottomText } = event.queryStringParameters

  const imagePath = generateImagePath()
  await saveImageLocally(image, imagePath)

  const imageOutputPath = generateImagePath()
  await mememaker({
    image: imagePath,
    outfile: imageOutputPath,
    topText,
    bottomText
  })

  const outputBase64 = await generateImageBase64(imageOutputPath)

  await deleteImages(imagePath, imageOutputPath)

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: `<img src="data:image/jpeg;base64,${outputBase64}" />`
  };
};
