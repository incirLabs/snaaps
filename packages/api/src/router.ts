import express from 'express';

import Health from './Routes/Health';
import Email from './Routes/Email';

const Router = express.Router();

Router.use('/health', Health);
Router.use('/email', Email);

export default Router;
