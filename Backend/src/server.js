import dotenv from "dotenv";
dotenv.config({quiet: true});
dotenv.config({ path: ".env.google", quiet: true });

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import router from './routes/datosRoutes.js';
import historialRouter from './routes/historialRoutes.js';
import authRouter from './routes/authRoutes.js';
import configurePassport from './auth/passport.js';
import conectarDB from './dbConexion/mongo.js';

const app = express();


conectarDB();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

configurePassport();

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

app.use('/api', router);
app.use('/api/historial', historialRouter);
app.use('/api/auth', authRouter);

export default app;
