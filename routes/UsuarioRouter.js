import express from 'express';
import { newUser, listUsers, getUserbyID, deleteUserbyID } from '../controllers/UsuarioController.js';

const router = express.Router();

// Rutas para usuarios
router.post('/', newUser);
router.get('/', listUsers);
router.get('/:id', getUserbyID);
router.delete('/:id', deleteUserbyID);

export default router;