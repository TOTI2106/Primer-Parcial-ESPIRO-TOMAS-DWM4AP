import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Registrar nuevo usuario
router.post('/register', register);

// Iniciar sesión
router.post('/login', login);

export default router;