import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
    pokedexNumber: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 151
    },
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    types: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
        required: true
    }],
    hp: {
        type: Number,
        required: true,
        min: 1,
        max: 255
    },
    attack: {
        type: Number,
        required: true,
        min: 5,
        max: 190
    },
    defense: {
        type: Number,
        required: true,
        min: 5,
        max: 230
    },
    speed: {
        type: Number,
        required: true,
        min: 5,
        max: 180
    },
    height: {
        type: Number,
        required: true,
        min: 0.1
    },
    weight: {
        type: Number,
        required: true,
        min: 0.1
    },
    description: {
        type: String,
        required: true
    },
    isLegendary: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/200x200/3B4CCA/FFFFFF?text=Pokemon'
    }
}, {
    timestamps: true
});

// Índices para búsquedas eficientes
pokemonSchema.index({ name: 'text' });
pokemonSchema.index({ pokedexNumber: 1 });
pokemonSchema.index({ types: 1 });
pokemonSchema.index({ isLegendary: 1 });

export default mongoose.model('Pokemon', pokemonSchema);