require('dotenv').config();
import express from 'express';
import middlewares from './middlewares';
import appRoutes from './routes';
import log from './config/winston';

const app = express();

/*========================
      DB CONNECTION
========================*/
require('./config/db');

/*========================
      MIDDLEWARES
========================*/
middlewares(app);

/*========================
      API ROUTE
========================*/
app.use('/api/v1', appRoutes);

const server = app.listen(process.env.PORT, err => {
  if (err) throw Error(err);
  log.info(`
  Server running on port: ${process.env.PORT}
  Environment: ${process.env.NODE_ENV}
  `);
});

export {
  server,
  app
};
