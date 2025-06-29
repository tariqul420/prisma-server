import { RequestHandler, Router } from 'express';
import {
  createUser,
  getUserRole,
  updateUser,
} from '../controllers/user-controller';

const router = Router();

// User routes
router.post('/create', createUser as RequestHandler);
router.get('/role/:email', getUserRole as RequestHandler);
router.put('/update/:email', updateUser as RequestHandler);

export default router;
