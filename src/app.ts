
import express from 'express'
import { json, raw, text, urlencoded } from 'body-parser';
import {RouterMapper }from './routes/routerMap'
import cors from 'cors';
import { LoggerUtils} from './utils/logger.utils';
import {LogLevelEnum} from './enums/log-level.enums';
import {Application} from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as yml from 'yamljs';
import * as path from 'path';


class App {
    private API_BASE_URL='/api/v1'
    private instance: RouterMapper =new RouterMapper();
    public express: Application = express()
    public async initialize() {
      try {
        this.express.use(json());
        this.express.use(raw());
        this.express.use(text());
        this.express.use(urlencoded({ extended: true }));
        this.express.use(cors())
        this.routes()
      } catch (error: any) {
        LoggerUtils.log(LogLevelEnum.ERROR, '... @App/initialize',error);
      }
    }

    private routes(): void {
      this.express.use((_req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
      });
      const swaggerDocument = yml.load('./src/swagger.yaml');
      this.express.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
      this.express.use(this.API_BASE_URL,this.instance.AppRouter)
      this.express.all('*', async (_req, res) => {
        res.status(404).json('Route not found')
      })
    }
}

export default async function appFactory(): Promise<Application> {
  const app = new App()
  await app.initialize()
  return app.express
}
