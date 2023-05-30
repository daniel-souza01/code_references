import { Server } from 'node:http'

const server = new Server()

server.on('request', (request, response) => {
  response.statusCode = 200
  response.setHeader('content-type', 'text/html')
  const responseBody = `<!DOCTYPE html>
    <html>
      <head>
        <title>Address book</title>
      </head>
      <body>
        <h1>Address book</h1>
      </body>
    </html>`
  response.write(responseBody)
  response.end()
})

server.on('listening', () => {
  console.log('server running on port 8080')
})

server.listen(8080)
