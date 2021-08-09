import { Router } from 'express';

import * as IndexController from '../controllers';

const router = Router();

router.get('/home', IndexController.index);

export default router;
