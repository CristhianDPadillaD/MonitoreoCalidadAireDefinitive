import express from 'express';
import cors from 'cors';
import router from './routes/datosRoutes.js';
import conectarDB from './dbConexion/mongo.js';

const app = express();


conectarDB();


app.use(cors());
app.use(express.json());


app.use('/api', router);

export default app;
