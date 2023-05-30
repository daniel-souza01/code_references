import { createServer } from 'node:https'
import { readFile, rename, readFileSync } from 'node:fs'
import data from './data.js'
import { getList } from './list.js'
import { deleteAddress } from './delete.js'
import { getForm } from './form.js'
import { saveAddress } from './save.js'
import formidable from 'formidable'

const options = {
  key: readFileSync('./localhost.key'),
  cert: readFileSync('./localhost.cert'),
}

createServer(options, (request, response) => {
  const parts = request.url.split('/')
  if (parts.includes('delete')) {
    data.addresses = deleteAddress(data.addresses, parts[2])
    redirect(response, '/')
  } else if (parts.includes('new')) {
    send(response, getForm())
  } else if (parts.includes('edit')) {
    send(response, getForm(data.addresses, parts[2]))
  } else if (request.url === '/style.css') {
    readFile('public/style.css', 'utf8', (err, data) => {
      if (err) {
        response.statusCode = 404
        response.end()
      } else {
        response.end(data)
      }
    })
  } else if (parts.includes('save') && request.method === 'POST') {
    const form = new formidable.IncomingForm()
    form.parse(request, (err, address, files) => {
      if (files.upload) {
        rename(
          files.upload.filepath,
          `public/assets/${files.upload.originalFilename}`,
          () => {
            address['file'] = `/assets/${files.upload.originalFilename}`
          }
        )
      }
      data.addresses = saveAddress(data.addresses, address)
      redirect(response, '/')
    })
  } else if (parts.includes('assets')) {
    readFile(`public${request.url.replaceAll('%20', ' ')}`, (err, data) => {
      if (err) {
        response.statusCode = 404
        response.end()
      } else {
        response.end(data)
      }
    })
  } else {
    send(response, getList(data.addresses))
  }
}).listen(8080, () => console.log('server running at https://localhost:8080'))

function send(response, responseBody) {
  response.writeHead(200, { 'content-type': 'text/html' })
  response.end(responseBody)
}

function redirect(response, to) {
  response.writeHead(302, { location: '/', 'content-type': 'text/plain' })
  response.end('302 Redirecting to /')
}
