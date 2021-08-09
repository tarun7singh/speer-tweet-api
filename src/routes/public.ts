import { Router } from 'express';
import * as AuthController from '../controllers/authentication';
import * as IndexController from '../controllers';

const router = Router();

router.get('/', IndexController.index);
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);

export default router;
