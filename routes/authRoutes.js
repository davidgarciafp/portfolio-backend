const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

/**
 * @route   POST /api/auth/login
 * @desc    Autenticar administrador y obtener token
 * @access  Público
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Por favor, proporciona nombre de usuario y contraseña' });
    }
    
    const authResult = await authService.login(username, password);
    
    res.json({
      success: true,
      token: authResult.token,
      admin: authResult.admin
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar token JWT
 * @access  Privado
 */
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }
    
    const admin = await authService.verifyToken(token);
    
    res.json({
      success: true,
      admin
    });
  } catch (error) {
    console.error('Error en verificación de token:', error.message);
    res.status(401).json({ message: 'Token inválido' });
  }
});

/**
 * @route   POST /api/auth/init
 * @desc    Inicializar el usuario admin por defecto (solo para desarrollo)
 * @access  Público
 */
router.post('/init', async (req, res) => {
  try {
    // Verificar si ya existe un admin
    const adminExists = await Admin.findOne({ username: 'admin' });
    
    if (adminExists) {
      return res.json({ message: 'El usuario admin ya existe' });
    }
    
    // Crear el admin por defecto
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword
    });
    
    await admin.save();
    
    res.json({ message: 'Usuario admin creado correctamente' });
  } catch (error) {
    console.error('Error al inicializar admin:', error.message);
    res.status(500).json({ message: 'Error al inicializar admin' });
  }
});

module.exports = router;