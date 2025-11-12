import { Router } from 'express';
import { newUsersController } from '../controllers/newUsers.controller';

const router = Router();


router.post('/register', 
  newUsersController.createUser.bind(newUsersController)
);


router.post('/forgot-password', 
  newUsersController.forgotPassword.bind(newUsersController)
);


router.post('/reset-password', 
  newUsersController.resetPassword.bind(newUsersController)
);

export const newUsersRouter = router;