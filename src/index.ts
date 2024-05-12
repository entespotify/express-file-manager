import express from 'express';
import http from 'http';
// import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import authenticationRoutes from './controllers/authentication.controller.js';
import logger from './middlewares/logger.js';
import { authenticate } from './middlewares/authentication.middleware.js';
import fileManagerRoutes from './controllers/fileManager.controller.js';

interface Context {
	token?: string;
	user?: any
}

const app = express();

const httpServer = http.createServer(app);


app.use(logger);

// app.use((req, res, next) => {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader(
// 		'Access-Control-Allow-Methods',
// 		'GET, POST, PUT, DELETE, OPTIONS'
// 	);
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Content-Type, Accept, X-Custom-Header, Authorization'
// 	);
// 	next();
// });

// app.use(cors<cors.CorsRequest>());

app.use(cookieParser());

app.use(bodyParser.json());

// app.use(express.static('static'));

app.use(authenticationRoutes);

app.use(authenticate);

app.use(fileManagerRoutes);


// Modified server startup
await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);
