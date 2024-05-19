import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import authenticationRoutes from './controllers/authentication.controller.js';
import logger from './middlewares/logger.js';
import { authenticate } from './middlewares/authentication.middleware.js';
import fileManagerRoutes from './controllers/fileManager.controller.js';

//setting env file
dotenv.config({path: "./.env"});

const app = express();

const httpServer = http.createServer(app);

const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}


app.use(logger);

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json());

app.use(authenticationRoutes);

app.use(authenticate);

app.use(fileManagerRoutes);


// Modified server startup
await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);
