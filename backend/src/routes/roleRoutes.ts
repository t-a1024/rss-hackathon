import { Router } from 'express';
import { RoleController } from '../controllers/roleController.js';

const router = Router();
const roleController = new RoleController();

router.post('/assign', (req, res) => roleController.assignRoles(req, res));

router.get('/health', (req, res) => roleController.healthCheck(req, res));

export default router;