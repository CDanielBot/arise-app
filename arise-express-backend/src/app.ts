import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import PingRouter from './services/ping/PingRouter'
import UserRouter from './services/user/UserRouter'
import PostRouter from './services/wall/PostRouter'
import BibleRouter from './services/bible/BibleRouter'
import EvangelismRouter from './services/evangelism/EvangelismRouter'
import DbPool from './db/DatabasePool'
import logger from './log/Logger'
import * as admin from 'firebase-admin'
import * as cors from 'cors'
import { config } from './config/config'
import * as swaggerUi from 'swagger-ui-express'

const SWAGGER_DOC = require('./swagger.json')
const FIREBASE_ACCOUNT_KEY = require(config.firebase_key_path)

class App {

  public app: express.Application

  constructor() {
    this.app = express()
    this.config()
    this.configFirebaseKey()
    this.configDb()
    this.mountRoutes()
    this.configErrorHandling()
  }

  private configErrorHandling() {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err.isServer) {
        logger.log('error', `Internal error. Stacktrace: ${err.stack}`)
      }
      return res.status(err.output.statusCode).json({ error: err.output.payload })
    })
  }

  private configFirebaseKey(): void {
    admin.initializeApp({
      credential: admin.credential.cert(FIREBASE_ACCOUNT_KEY),
      databaseURL: config.firebase_db_url
    })
  }

  private config(): void {
    this.app.use(express.json())
    this.app.use(cors({
      origin: '*',
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
    }))
  }

  private configDb(): void {
    DbPool.init()
  }

  private mountRoutes(): void {
    this.app.use('/api/v1/ping', PingRouter)
    this.app.use('/api/v1/bible', BibleRouter)
    this.app.use('/api/v1/users', UserRouter)
    this.app.use('/api/v1/posts', PostRouter)
    this.app.use('/api/v1/evangelismRequests', EvangelismRouter)

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SWAGGER_DOC))
  }
}

export default new App().app