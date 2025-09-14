// Puedes expandir este middleware con validaciones específicas si es necesario
export const validatePokemon = (req, res, next) => {
    // Ejemplo de validación básica
    const { name, pokedexNumber, types } = req.body;
    
    if (!name || !pokedexNumber || !types || types.length === 0) {
        return res.status(400).json({ 
            message: 'Nombre, número de Pokédex y tipos son requeridos' 
        });
    }
    
    next();
};