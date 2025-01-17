import { Router } from 'express';

import users from './users';
import mail from './mail/index';
import auth from './auth';

import { isAuth } from '../middlewares/auth';

const router = Router();

router.use('/users', users);
router.use('/auth', auth);
router.use('/mail', isAuth, mail);

export default router;
