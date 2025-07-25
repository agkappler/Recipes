/* eslint-disable @typescript-eslint/no-require-imports */
// server.js
const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'localhost-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'localhost.pem')),
}

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
        const parsedUrl = parse(req.url, true)
        handle(req, res, parsedUrl)
    }).listen(3000, () => {
        console.log('> Ready on https://localhost:3000')
    })
})
