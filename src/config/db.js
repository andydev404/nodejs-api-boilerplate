import mongoose from 'mongoose';
import log from './winston';

// Create the database connection
mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true }
);

//  Connection throws an error
mongoose.connection.on('error', err => {
  log.info('Failed to connect to DB: ' + err);
  process.exit(1);
});

// Successfully connected
mongoose.connection.on('connected', () => {
  log.info('DB connected');
});

// Connection is disconnected
mongoose.connection.on('disconnected', () => {
  log.info('DB disconnected');
});
