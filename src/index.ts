import express, { RequestHandler } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { createAuthMiddleware } from '@entespotify/express-token-verifier';

import logger from './middlewares/logger.js';
import fileManagerRoutes from './controllers/fileManager.controller.js';
import webRoutes from './controllers/web.controller.js';

dotenv.config({ path: "./.env" });

const app = express();

const httpServer = http.createServer(app);

const corsOptions = {
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-type,Authorization",
    credentials: true
};

const issuer = process.env.ISSUER!;
const jwksUri = process.env.JWKS_URI!;
const audience = process.env.AUDIENCE!;
const port = Number(process.env.PORT || 4000);

if (!issuer || !jwksUri) {
    console.error('Set ISSUER and JWKS_URI in .env');
    process.exit(1);
}

const auth = createAuthMiddleware({
    issuer,
    jwksUri,
    audience,
    jwksCacheTtl: 300,
    clockSkew: 60
});

const authMiddleware: RequestHandler = (req, res, next) => {
    auth(req, res, next);
};

app.use(logger);

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json());

app.use(authMiddleware);

app.use(fileManagerRoutes);

app.use('/web', webRoutes);

// Modified server startup
await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

console.log(`🚀 Server ready at http://localhost:${port}/`);
