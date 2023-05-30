// 1
// import { request } from 'node:http'

// const options = new URL('http://localhost:8080/')

// request(options, (response) => {
//   let body = ''
//   response.on('data', (chunk) => (body += chunk))
//   response.on('end', () => {
//     console.log(body)
//   })
// }).end()

// 2 (parse HTML)
import request from 'request'
import cheerio from 'cheerio'

request('http://localhost:8080/', (err, response, body) => {
  const addresses = []

  const $ = cheerio.load(body)
  const tr = $('tr')
  tr.each((index, element) => {
    if (index === 0) {
      return
    }

    addresses.push({
      id: element.children[3].children[0].data,
      firstname: element.children[5].children[0].data,
      lastname: element.children[7].children[0].data,
    })
  })

  console.log(addresses)
})

// 3
// import request from 'request'

// import { createReadStream } from 'node:fs'

// const formData = {
//   firstname: 'Jason',
//   lastname: 'Bourne',
//   street: '1000 Colonial',
//   city: 'Langley',
//   country: 'USA',
//   upload: createReadStream('./public/peregrino.png'),
// }

// request.post(
//   {
//     url: 'http://localhost:8080/save',
//     formData,
//   },
//   (err, response, body) => {
//     if (err) {
//       console.error(err)
//     } else {
//       console.log(body)
//     }
//   }
// )
