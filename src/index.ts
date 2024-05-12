import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import authenticationRoutes from './controllers/authentication.controller.js';
import logger from './middlewares/logger.js';
import { authenticate } from './middlewares/authentication.middleware.js';
import fileManagerRoutes from './controllers/fileManager.controller.js';

const app = express();

const httpServer = http.createServer(app);


app.use(logger);

app.use(cookieParser());

app.use(bodyParser.json());

app.use(authenticationRoutes);

app.use(authenticate);

app.use(fileManagerRoutes);


// Modified server startup
await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);
