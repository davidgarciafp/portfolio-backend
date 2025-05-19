require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');  // Importa las rutas de proyectos
const contactRoutes = require('./routes/contactRoutes');  // Importar las rutas de contacto
const authRoutes = require('./routes/authRoutes');  // Importar las rutas de autenticación
const nodemailer = require('nodemailer');  // Importar nodemailer

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());  // Para parsear el body en formato JSON

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('🟢 Conectado a MongoDB'))
.catch(err => console.error('🔴 Error MongoDB:', err));

// Usar las rutas
app.use('/api', projectRoutes);  // Todas las rutas de proyectos estarán bajo /api
app.use('/api', contactRoutes);  // Todas las rutas de contacto estarán bajo /api
app.use('/api/auth', authRoutes); // Todas las rutas de autenticación estarán bajo /api/auth

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API del portfolio funcionando');
});

// Ruta de prueba para verificar la configuración de correo
app.get('/api/test-email', (req, res) => {
  const config = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: '********' // Ocultamos la contraseña por seguridad
    },
    recipient: process.env.EMAIL_RECIPIENT
  };
  
  res.json({
    message: 'Configuración de correo electrónico',
    config
  });
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

