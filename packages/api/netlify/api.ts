import serverless from 'serverless-http';

import app from '../src';

// Serverless handler
export const handler = serverless(app);
