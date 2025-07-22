// cspell:disable
import cors from 'cors'
import express, { Request, Response, Router } from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimiter from 'express-rate-limit'
import cookieParser from 'cookie-parser'
// routers
import profileRouter from '#src/routes/user/index.js'
import deliveryRouter from '#src/routes/delivery-info/index.js'
import storesRouter from '#src/routes/stores/index.js'
import mediaRouter from '#src/routes/media/index.js'
import productsRouter from '#src/routes/products/index.js'

// middlewares
import errorHandlerMiddleware from '#src/middleware/error-handler.js'
import authenticateUser from '#src/middleware/authentication.js'
import notFound from '#src/middleware/not-found.js'
import swaggerUi from 'swagger-ui-express'
import yaml from 'js-yaml'
import { readFile } from 'fs/promises'
import path from 'path'

// if (process.env.NODE_ENV === 'production') apiDocsPath = './api-docs/dist.yaml'
// else apiDocsPath = './server/api-docs/dist.yaml'
const swaggerDocument = await readFile(
  path.resolve('./server/api-docs/dist.yaml'),
  'utf8',
).then((doc) => yaml.load(doc))

////////////// Middlewares //////////////
let app = express()
app.set('trust proxy', 1)
app.use(cookieParser())
if (process.env.NODE_ENV === 'production')
  app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  )
else
  app.use(
    rateLimiter({
      windowMs: 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  )

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', swaggerUi.serve, swaggerUi.setup(<JSON>swaggerDocument))
app.use(
  '/.well-known/acme-challenge',
  express.static('public/.well-known/acme-challenge'),
)
app.get('/api.json', (_req: Request, res: Response) =>
  // @ts-ignore (vercel workaround)
  res.json(swaggerDocument),
)

app.use(helmet())
app.use(cors())
if (process.env.NODE_ENV !== 'production') app.use(morgan('combined'))
else app.use(morgan('dev'))
// application routes
const v1Router = Router()
v1Router.use('/me', authenticateUser, profileRouter)
v1Router.use('/delivery-info', authenticateUser, deliveryRouter)
v1Router.use('/stores', authenticateUser, storesRouter)
v1Router.use('/products', authenticateUser, productsRouter)
v1Router.use('/media', authenticateUser, mediaRouter)

app.use('/v1', v1Router)
// helper middlewares
app.use(notFound)
app.use(errorHandlerMiddleware)
export default app
