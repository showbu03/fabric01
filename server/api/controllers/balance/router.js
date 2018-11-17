import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/:id', controller.getBalance)
  .post('/', controller.move)
  .post('/user', controller.addUser);
