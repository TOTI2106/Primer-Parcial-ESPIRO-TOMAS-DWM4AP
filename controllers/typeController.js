import Type from '../models/Type.js';

// Obtener todos los tipos
export const getAllTypes = async (req, res) => {
    try {
        const types = await Type.find().populate('strengths weaknesses', 'name');
        res.json(types);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tipos', error: error.message });
    }
};

// Obtener un tipo por ID
export const getTypeById = async (req, res) => {
    try {
        const type = await Type.findById(req.params.id)
            .populate('strengths', 'name')
            .populate('weaknesses', 'name');
        
        if (!type) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }
        res.json(type);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'ID inválido' });
        }
        res.status(500).json({ message: 'Error al obtener tipo', error: error.message });
    }
};