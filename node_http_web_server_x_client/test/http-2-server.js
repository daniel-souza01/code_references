import { constants, createSecureServer } from 'node:http2'
import { readFile, readFileSync } from 'node:fs'
import data from '../data.js'
import { getList } from '../list.js'

const { HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS, HTTP2_HEADER_METHOD } =
  constants

const options = {
  key: readFileSync('./localhost.key'),
  cert: readFileSync('./localhost.cert'),
}

const server = createSecureServer(options)

server
  .on('stream', (stream, headers) => {
    const parts = headers[HTTP2_HEADER_PATH].split('/')
    if (headers[HTTP2_HEADER_PATH] === '/style.css') {
      readFile('public/style.css', 'utf8', (err, data) => {
        if (err) {
          stream.respond({
            'content-type': 'text/plain',
            [HTTP2_HEADER_STATUS]: 404,
          })
          stream.end()
        } else {
          stream.end(data)
        }
      })
    } else if (parts.includes('assets')) {
      readFile(
        `public${headers[HTTP2_HEADER_PATH].replaceAll('%20', ' ')}`,
        (err, data) => {
          if (err) {
            console.log(err)
            stream.respond({
              [HTTP2_HEADER_STATUS]: 404,
            })
            stream.end()
          } else {
            stream.end(data)
          }
        }
      )
    } else {
      send(stream, getList(data.addresses))
    }
  })
  .listen(8080, () => console.log('server running at https://localhost:8080'))

function send(stream, responseBody) {
  stream.respond({
    'content-type': 'text/html',
    [HTTP2_HEADER_STATUS]: 200,
  })
  stream.end(responseBody)
}
