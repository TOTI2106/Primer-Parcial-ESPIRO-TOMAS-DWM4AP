import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    color: {
        type: String,
        required: true,
        default: '#777777'
    },
    strengths: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }],
    weaknesses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    }]
}, {
    timestamps: true
});

export default mongoose.model('Type', typeSchema);