import '@netlify/functions';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './router';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.raw());

// REMINDER: This is the path of the Netlify Function
app.use('/.netlify/functions/api', router);

export default app;
