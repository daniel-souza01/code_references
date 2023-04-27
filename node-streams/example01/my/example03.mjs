import { Readable, Transform, Writable } from 'node:stream'
import { createWriteStream } from 'node:fs'
import { setTimeout } from 'node:timers/promises'

let count = 0

const readableStream = new Readable({
  read() {
    for (let index = 0; index < 10; index++) {
      const user = { id: Date.now() + index, name: `Daniel-${index}` }
      this.push(JSON.stringify(user))
    }

    this.push(null)
  }
})

const transformStream = new Transform({
  async transform(chunk, encoding, cb) {
    await setTimeout(100)
    const data = JSON.parse(chunk)
    const csv = `${data.id},${data.name.toUpperCase()}\n`
    count++

    cb(null, csv)
  }
})

const setCsvHeader = new Transform({
  async transform(chunk, encoding, cb) {
    if (count === 1) {
      return cb(null, 'id,name\n'.concat(chunk))
    }

    cb(null, chunk)
  }
})

const writeableStream = new Writable({
  write(chunk, encoding, cb) {
    console.log(chunk.toString())
    cb()
  },
  final() {
    console.log('itens processados: ', count)
  }
})

readableStream
  .pipe(transformStream)
  .pipe(setCsvHeader)
  // .pipe(writeableStream)
  .pipe(createWriteStream('./node-streams/my/output.csv'))
