import express from 'express';
import {
    getAllPokemon,
    getPokemonById,
    createPokemon,
    updatePokemon,
    deletePokemon,
    searchPokemonByName,
    filterPokemonByType,
    filterLegendaryPokemon
} from '../controllers/pokemonController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(auth);

// Rutas para Pokémon
router.get('/', getAllPokemon);
router.get('/:id', getPokemonById);
router.post('/', createPokemon);
router.put('/:id', updatePokemon);
router.delete('/:id', deletePokemon);
router.get('/name/:name', searchPokemonByName);
router.get('/filter/type', filterPokemonByType);
router.get('/filter/legendary', filterLegendaryPokemon);

export default router;