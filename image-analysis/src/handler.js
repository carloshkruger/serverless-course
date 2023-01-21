const { get } = require('axios')

module.exports = class Handler {
  constructor({rekognitionService, translateService}) {
    this.rekognitionService = rekognitionService
    this.translateService = translateService
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, {
      responseType: 'arraybuffer'
    })

    return Buffer.from(response.data, 'base64')
  }

  async detectImageLabels(imageBuffer) {
    const result = await this.rekognitionService.detectLabels({
      Image: {
        Bytes: imageBuffer
      }
    }).promise()
    
    const workingItems = result.Labels.filter(({ Confidence }) => Confidence > 80)
    const names = workingItems.map(({ Name }) => Name).join(' and ')

    return {
      names,
      workingItems
    }
  }

  async translateText(text) {
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text
    }

    const { TranslatedText } = await this.translateService.translateText(params).promise()

    return TranslatedText.split(' e ')
  }

  formatTextResults(texts, workingItems) {
    const finalText = []
    for(const indexText in texts) {
      const nameInPortuguese = texts[indexText]
      const confidence = workingItems[indexText].Confidence

      finalText.push(
        `${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`
      )
    }

    return finalText.join('\n')
  }

  async main(event) {
    try {
      const { imageUrl } = event.queryStringParameters
  
      if (!imageUrl) {
        return {
          statusCode: 400,
          body: 'Image is required.'
        }
      }

      console.log('Downloading image...')
      const imageBuffer = await this.getImageBuffer(imageUrl)

      console.log('Detecting image labels...')
      const { names, workingItems } = await this.detectImageLabels(imageBuffer)

      console.log('Translating...')
      const translatedText = await this.translateText(names)

      const finalText = this.formatTextResults(translatedText, workingItems)
      console.log('Finishing...')
  
      return {
        statusCode: 200,
        body: `A imagem tem\n`.concat(finalText)
      }
    } catch (error) {
      console.error(error)

      return {
        statusCode: 500,
        body: 'Internal server error.'
      }
    }
  }
}