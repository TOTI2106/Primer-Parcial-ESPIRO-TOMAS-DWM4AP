import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routerAPI from './routes/index.js';
import Type from './models/Type.js';
import Pokemon from './models/Pokemon.js';

dotenv.config();
const urldb = process.env.URI_DB;

// Conectar a MongoDB con mejor manejo de errores
mongoose.connect(urldb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Conexión con MongoDB Atlas exitosa');
})
.catch((error) => {
    console.error('❌ Error de conexión a MongoDB:', error.message);
    console.log('ℹ️  Verifica tu cadena de conexión en el archivo .env');
});

const db = mongoose.connection;

db.on('error', (error) => { 
    console.error('Error de conexión a la DB:', error.message);
});

db.once('open', () => { 
    console.log('✅ Conexión con la DB exitosa');
});

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/', express.static('public'));

app.get('/', (request, response) => {
    response.send(`
        <h1>API REST Pokémon</h1>
        <p>Servidor ejecutándose en el puerto ${PORT}</p>
        <p>Usa POST /api/seed para poblar la base de datos</p>
        <p>Base de datos: ${urldb ? 'Configurada' : 'No configurada'}</p>
    `);
});

// Endpoint para poblar la base de datos
app.post('/api/seed', async (req, res) => {
    try {
        // Verificar conexión a la base de datos
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({
                success: false,
                message: 'No hay conexión a la base de datos'
            });
        }

        // Datos de tipos de Pokémon
        const typesData = [
            { name: 'Normal', color: '#A8A878' },
            { name: 'Fire', color: '#F08030' },
            { name: 'Water', color: '#6890F0' },
            { name: 'Electric', color: '#F8D030' },
            { name: 'Grass', color: '#78C850' },
            { name: 'Ice', color: '#98D8D8' },
            { name: 'Fighting', color: '#C03028' },
            { name: 'Poison', color: '#A040A0' },
            { name: 'Ground', color: '#E0C068' },
            { name: 'Flying', color: '#A890F0' },
            { name: 'Psychic', color: '#F85888' },
            { name: 'Bug', color: '#A8B820' },
            { name: 'Rock', color: '#B8A038' },
            { name: 'Ghost', color: '#705898' },
            { name: 'Dragon', color: '#7038F8' }
        ];

        // Datos de algunos Pokémon de ejemplo
        const pokemonData = [
            {
                pokedexNumber: 1,
                name: 'Bulbasaur',
                types: [], // Se llenará con IDs
                hp: 45,
                attack: 49,
                defense: 49,
                speed: 45,
                height: 0.7,
                weight: 6.9,
                description: 'Una semilla fue plantada en su espalda al nacer. La planta brota y crece con él.',
                isLegendary: false,
                image: 'https://via.placeholder.com/200x200/78C850/FFFFFF?text=Bulbasaur'
            },
            {
                pokedexNumber: 4,
                name: 'Charmander',
                types: [], // Se llenará con IDs
                hp: 39,
                attack: 52,
                defense: 43,
                speed: 65,
                height: 0.6,
                weight: 8.5,
                description: 'Prefiere los lugares calientes. Cuando llueve, le sale vapor de la punta de la cola.',
                isLegendary: false,
                image: 'https://via.placeholder.com/200x200/F08030/FFFFFF?text=Charmander'
            },
            {
                pokedexNumber: 7,
                name: 'Squirtle',
                types: [], // Se llenará con IDs
                hp: 44,
                attack: 48,
                defense: 65,
                speed: 43,
                height: 0.5,
                weight: 9.0,
                description: 'Cuando retrae su largo cuello en el caparazón, dispara agua con una fuerza increíble.',
                isLegendary: false,
                image: 'https://via.placeholder.com/200x200/6890F0/FFFFFF?text=Squirtle'
            },
            {
                pokedexNumber: 25,
                name: 'Pikachu',
                types: [], // Se llenará con IDs
                hp: 35,
                attack: 55,
                defense: 40,
                speed: 90,
                height: 0.4,
                weight: 6.0,
                description: 'Cuando varios de estos Pokémon se juntan, su energía puede causar tormentas eléctricas.',
                isLegendary: false,
                image: 'https://via.placeholder.com/200x200/F8D030/000000?text=Pikachu'
            },
            {
                pokedexNumber: 150,
                name: 'Mewtwo',
                types: [], // Se llenará con IDs
                hp: 106,
                attack: 110,
                defense: 90,
                speed: 130,
                height: 2.0,
                weight: 122.0,
                description: 'Su ADN es casi el mismo que el de Mew. Sin embargo, su tamaño y carácter son muy diferentes.',
                isLegendary: true,
                image: 'https://via.placeholder.com/200x200/F85888/FFFFFF?text=Mewtwo'
            }
        ];

        console.log('🧹 Limpiando colecciones existentes...');
        await Type.deleteMany({});
        await Pokemon.deleteMany({});

        console.log('📝 Insertando tipos...');
        const types = await Type.insertMany(typesData);

        // Crear mapeo de nombres de tipos a IDs
        const typeMap = {};
        types.forEach(type => {
            typeMap[type.name] = type._id;
        });

        // Asignar tipos a los Pokémon
        pokemonData[0].types = [typeMap['Grass'], typeMap['Poison']]; // Bulbasaur
        pokemonData[1].types = [typeMap['Fire']]; // Charmander
        pokemonData[2].types = [typeMap['Water']]; // Squirtle
        pokemonData[3].types = [typeMap['Electric']]; // Pikachu
        pokemonData[4].types = [typeMap['Psychic']]; // Mewtwo

        console.log('🐢 Insertando Pokémon...');
        await Pokemon.insertMany(pokemonData);

        console.log('✅ Base de datos poblada exitosamente');

        res.json({
            success: true,
            message: 'Base de datos poblada exitosamente',
            types: types.length,
            pokemon: pokemonData.length,
            database: mongoose.connection.name
        });

    } catch (error) {
        console.error('❌ Error poblando la base de datos:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error poblando la base de datos',
            error: error.message
        });
    }
});

// Cargar las rutas de la API
routerAPI(app);

app.listen(PORT, () => {
    console.log(`🚀 API Rest ejecutándose en el puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📊 Base de datos: ${urldb ? 'Configurada' : 'No configurada'}`);
    if (urldb) {
        console.log(`🔗 MongoDB: ${urldb.split('@')[1]?.split('/')[0] || 'Conectando...'}`);
    }
});