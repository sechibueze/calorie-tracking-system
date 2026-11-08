import { Router } from 'express';
import { env } from '../config/env';
import { authRouter } from './auth.route';
import { userRouter } from './user.route';
import { entryRouter } from './entry.route';
import { adminRouter } from './admin.route';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({ name: env.SERVICE_NAME, version: 'v1'})
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/admin', adminRouter)
apiRouter.use('/users', userRouter)
apiRouter.use('/entries', entryRouter)