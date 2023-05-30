import { connect, constants } from 'node:http2'
import { readFileSync } from 'node:fs'
import cheerio from 'cheerio'

const client = connect('https://localhost:8080', {
  ca: readFileSync('./localhost.cert'),
})

client.on('error', (err) => console.error(err))

const req = client.request({ [constants.HTTP2_HEADER_PATH]: '/' })

req.setEncoding('utf8')

let body = ''

req.on('data', (chunk) => {
  body += chunk
})

req.on('end', () => {
  const addresses = []
  const $ = cheerio.load(body)
  const tr = $('tr')

  tr.each((index, element) => {
    if (index === 0) return
    addresses.push({
      id: element.children[3].children[0].data,
      firstname: element.children[5].children[0].data,
      lastname: element.children[7].children[0].data,
    })
  })

  console.log(addresses)
})

req.end()
