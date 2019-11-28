import app from './app'
import { config } from './config/config'
const port = config.server.port

const server = app.listen(port, (err: Error) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})

module.exports = app
