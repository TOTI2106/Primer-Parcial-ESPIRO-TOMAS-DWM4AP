import express from 'express';
import {
    getAllTypes,
    getTypeById
} from '../controllers/typeController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas para tipos
router.get('/', getAllTypes);
router.get('/:id', getTypeById);

export default router;