/**
 * Gulp configuration for `gulp serve`.
 *
 * @module lib/gulp/serve
 */

// NPM Modules
const express = require('express')
const fs = require('fs')
const path = require('path')

// Local Modules
const { BUILD_DIR } = require('./common')

// Constants
const ENV_SERVE_HOST = 'NCAS_SERVE_HOST'
const ENV_SERVE_PORT = 'NCAS_SERVE_PORT'
const SERVE_ROOT = BUILD_DIR
const SERVE_PORT = 3000
const SERVE_HOST = 'localhost'

// Serve files over a local http server
// If a static file is not found, the server is configured to search for files with the `.html` extension. This allows
// urls to be specified without an extension, which mirrors GitHub's default behavior. Other servers, such as nginx,
// support similar functionality.
//
// https://expressjs.com/en/api.html.
// https://stackoverflow.com/a/38238001
const serve = () => {
  const host = process.env[ENV_SERVE_HOST] || SERVE_HOST
  const port = process.env[ENV_SERVE_PORT] || SERVE_PORT
  const app = express()
  app.use(express.static(SERVE_ROOT, { extensions: ['html'], redirect: false }))
  app.use((req, res, next) => {
    const dirPath = path.join(SERVE_ROOT, req.path)
    const filePath = `${dirPath}.html`
    const indexPath = path.join(dirPath, 'index.html')

    // Static content serving automatically adds the .html extension if needed. However, express does not handle the
    // situation where a file and directory have the same name (excluding the .html file extension). In this case,
    // prefer the file over the directory. Send the 404 page as a last resort.
    let status
    let resultPath
    if (fs.existsSync(dirPath) &&
      fs.statSync(dirPath).isDirectory() &&
      fs.existsSync(filePath) &&
      fs.statSync(filePath).isFile()) {
      status = 200
      resultPath = filePath
    } else if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
      status = 200
      resultPath = indexPath
    } else {
      status = 404
      resultPath = path.join(SERVE_ROOT, '404.html')
    }

    res.status(status).sendFile(path.relative(SERVE_ROOT, resultPath), { root: SERVE_ROOT })
  })
  app.listen(port, host)
  console.log(`Serving website on http://${host}:${port}`)
}
module.exports.serve = serve
