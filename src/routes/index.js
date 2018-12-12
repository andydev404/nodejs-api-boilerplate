import express from 'express';
import userRoutes from '../modules/user/user.routes';

const routes = express.Router();

/* Users --> */ routes.use('/users',userRoutes);



export default routes;