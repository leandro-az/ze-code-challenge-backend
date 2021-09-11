import express from 'express'
import { json, raw, text, urlencoded } from 'body-parser';
import {RouterMapper }from './routes/routerMap'
import cors from 'cors';
import Container from 'typedi';
let instance: RouterMapper | undefined;
import { LoggerUtils} from './utils/logger.utils';
import {LogLevelEnum} from './enums/log-level.enums';


class App {
    public express: express.Application = express()
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
      })
      if (!instance) {
        instance = Container.get(RouterMapper);
      }
      this.express.use(instance.AppRouter)
      this.express.all('*', async (_req, res) => {
        res.status(404).json('Route not found')
      })
    }
}

export default async function appFactory() {
  const app = new App()
  await app.initialize()
  return app.express
}
