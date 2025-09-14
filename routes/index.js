import express from 'express';
import authRoutes from './auth.js';
import pokemonRoutes from './pokemon.js';
import typeRoutes from './types.js';
import usuarioRoutes from './UsuarioRouter.js'; // Verifica que el nombre sea correcto

const routerAPI = (app) => {
    const router = express.Router();
    app.use('/api', router);
    
    router.use('/auth', authRoutes);
    router.use('/pokemon', pokemonRoutes);
    router.use('/types', typeRoutes);
    router.use('/users', usuarioRoutes); // o el endpoint que uses
};

export default routerAPI;