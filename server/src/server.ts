import { fileURLToPath } from 'url'
import app from '../../api/index.js'
import dotenv from 'dotenv'

let path = 'env.' + process.env.NODE_ENV
if (process.env.NODE_ENV === 'testing' && process.env.CI) path += '-ci'
else path += '-local'
dotenv.config({ path })

const port = process.env.PORT || 1024

let server: () => void = () => {
  if (process.argv[1] === fileURLToPath(import.meta.url))
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
}

server()
