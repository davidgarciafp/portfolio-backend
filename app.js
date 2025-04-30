require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');  // Importa las rutas de proyectos

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());  // Para parsear el body en formato JSON

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('🟢 Conectado a MongoDB'))
.catch(err => console.error('🔴 Error MongoDB:', err));

// Usar las rutas
app.use('/api', projectRoutes);  // Todas las rutas de proyectos estarán bajo /api

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API del portfolio funcionando');
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

