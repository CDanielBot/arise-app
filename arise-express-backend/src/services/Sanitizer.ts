import * as sanitizeHtml from 'sanitize-html'
import * as cheerio from 'cheerio'
import logger from '../log/Logger'

export function sanitizeArray<T>(array: Array<T>, sanitizeFn: (entry: T) => T): Array<T> {
  const sanitizedData: Array<T> = []
  // use classic for iteration as there seems to be a problem with try catch in array.map callback
  for (const i in array) {
    const entry = array[i]
    try {
      const sanitizedEntry = sanitizeFn(entry)
      sanitizedData.push(sanitizedEntry)
    } catch (error) {
      logger.log('warn', `Failed to sanitize array entry: ${JSON.stringify(entry)}`, error)
    }
  }
  return sanitizedData
}

/* It throws error if sanitization fails */
export function sanitizeHtmlText(htmlText: string): string {
  return sanitizeHtml(htmlText, {
    allowedTags: []
  })
}

/* It throws error if sanitization fails */
export function sanitizeVideo(htmlText: string): string {
  const sanitizedHtml = sanitizeHtml(htmlText, {
    allowedTags: ['iframe'],
    allowedAttributes: {
      iframe: ['src']
    },
    allowedIframeHostnames: ['www.youtube.com']
  })
  return getVideoSource(sanitizedHtml)
}

function getVideoSource(htmlText: string) {
  // Youtube url
  if (htmlText.startsWith('https://www.youtube.com')) {
    return htmlText
  }

  // Ifram type
  const $ = cheerio.load(htmlText)
  const src = $('iframe')
    .first()
    .attr('src')
  return src.startsWith('//') ? src.replace('//', 'https://') : src
}
