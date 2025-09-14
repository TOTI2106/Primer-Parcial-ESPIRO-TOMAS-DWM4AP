import Pokemon from '../models/Pokemon.js';
import Type from '../models/Type.js';

// Obtener todos los Pokémon
export const getAllPokemon = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const pokemon = await Pokemon.find()
            .populate('types', 'name color')
            .skip(skip)
            .limit(limit)
            .sort({ pokedexNumber: 1 });

        const total = await Pokemon.countDocuments();

        res.json({
            pokemon,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPokemon: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener Pokémon', error: error.message });
    }
};

// Obtener un Pokémon por ID
export const getPokemonById = async (req, res) => {
    try {
        const pokemon = await Pokemon.findById(req.params.id).populate('types', 'name color');
        if (!pokemon) {
            return res.status(404).json({ message: 'Pokémon no encontrado' });
        }
        res.json(pokemon);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        res.status(500).json({ message: 'Error al obtener Pokémon', error: error.message });
    }
};

// Crear un nuevo Pokémon
export const createPokemon = async (req, res) => {
    try {
        // Verificar si ya existe un Pokémon con el mismo número o nombre
        const existingPokemon = await Pokemon.findOne({
            $or: [
                { pokedexNumber: req.body.pokedexNumber },
                { name: req.body.name }
            ]
        });

        if (existingPokemon) {
            return res.status(400).json({ 
                message: 'Ya existe un Pokémon con ese número o nombre' 
            });
        }

        // Verificar que los tipos existan
        if (req.body.types && req.body.types.length > 0) {
            const types = await Type.find({ _id: { $in: req.body.types } });
            if (types.length !== req.body.types.length) {
                return res.status(400).json({ message: 'Uno o más tipos no existen' });
            }
        }

        const pokemon = new Pokemon(req.body);
        await pokemon.save();
        await pokemon.populate('types', 'name color');

        res.status(201).json(pokemon);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Datos inválidos', errors });
        }
        res.status(500).json({ message: 'Error al crear Pokémon', error: error.message });
    }
};

// Actualizar un Pokémon
export const updatePokemon = async (req, res) => {
    try {
        // Verificar que los tipos existan si se están actualizando
        if (req.body.types && req.body.types.length > 0) {
            const types = await Type.find({ _id: { $in: req.body.types } });
            if (types.length !== req.body.types.length) {
                return res.status(400).json({ message: 'Uno o más tipos no existen' });
            }
        }

        const pokemon = await Pokemon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('types', 'name color');

        if (!pokemon) {
            return res.status(404).json({ message: 'Pokémon no encontrado' });
        }

        res.json(pokemon);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: 'Datos inválidos', errors });
        }
        res.status(500).json({ message: 'Error al actualizar Pokémon', error: error.message });
    }
};

// Eliminar un Pokémon
export const deletePokemon = async (req, res) => {
    try {
        const pokemon = await Pokemon.findByIdAndDelete(req.params.id);
        if (!pokemon) {
            return res.status(404).json({ message: 'Pokémon no encontrado' });
        }
        res.json({ message: 'Pokémon eliminado exitosamente' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        res.status(500).json({ message: 'Error al eliminar Pokémon', error: error.message });
    }
};

// Buscar Pokémon por nombre
export const searchPokemonByName = async (req, res) => {
    try {
        const name = req.params.name;
        const pokemon = await Pokemon.find({ 
            name: { $regex: name, $options: 'i' } 
        }).populate('types', 'name color');

        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar Pokémon', error: error.message });
    }
};

// Filtrar Pokémon por tipo
export const filterPokemonByType = async (req, res) => {
    try {
        const typeName = req.query.type;
        
        if (!typeName) {
            return res.status(400).json({ message: 'Parámetro "type" es requerido' });
        }

        // Buscar el tipo por nombre
        const type = await Type.findOne({ name: { $regex: new RegExp(`^${typeName}$`, 'i') } });
        if (!type) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }

        const pokemon = await Pokemon.find({ types: type._id }).populate('types', 'name color');
        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar Pokémon', error: error.message });
    }
};

// Filtrar Pokémon legendarios
export const filterLegendaryPokemon = async (req, res) => {
    try {
        const pokemon = await Pokemon.find({ isLegendary: true }).populate('types', 'name color');
        res.json(pokemon);
    } catch (error) {
        res.status(500).json({ message: 'Error al filtrar Pokémon legendarios', error: error.message });
    }
};