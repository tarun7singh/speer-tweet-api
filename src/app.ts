import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Router } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { logger, stream } from './utils/logger';
import mongoose from 'mongoose';

import errorMiddleware from './middlewares/error.middleware';
import Authenticator from './middlewares/authentication.middleware';
import PrivateRouter from './routes/private';
import PublicRouter from './routes/public';

class App {
    public app: express.Application;
    public port: string | number;
    public env: string;
    credentials_path: string;

    constructor() {
        this.initializeDB();
        this.app = express();
        this.port = process.env.PORT || 5000;
        this.env = process.env.NODE_ENV || 'development';
        this.initializeMiddlewares();
        this.app.use('/api/v1', PublicRouter);
        this.initializeAuth();
        this.app.use('/api/v1', PrivateRouter);
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`App listening on the port ${this.port}`);
        });
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(cors({ origin: '*' }));
        this.app.use(morgan('dev', { stream }));
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private initializeAuth() {
        this.app.use(Authenticator);
    }

    private initializeDB() {
        mongoose
            .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Connected to the database!');
            })
            .catch(err => {
                console.log('Cannot connect to the database!', err);
                process.exit();
            });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}

export default App;
