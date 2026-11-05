import { Router } from 'express';
import { env } from '../config/env';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({ name: env.SERVICE_NAME, version: 'v1'})
})