const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Servicio para manejar la autenticación de administradores
 */
const authService = {
  /**
   * Autentica a un administrador y genera un token JWT
   * @param {string} username - Nombre de usuario del administrador
   * @param {string} password - Contraseña del administrador
   * @returns {Promise<{token: string, admin: object}>} - Token JWT y datos del administrador
   */
  async login(username, password) {
    try {
      // Buscar el administrador por nombre de usuario
      const admin = await Admin.findOne({ username });
      
      if (!admin) {
        throw new Error('Credenciales inválidas');
      }
      
      // Verificar si la contraseña coincide
      const isMatch = await bcrypt.compare(password, admin.password);
      
      if (!isMatch) {
        throw new Error('Credenciales inválidas');
      }
      
      // Generar token JWT
      const token = jwt.sign(
        { id: admin._id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return {
        token,
        admin: {
          id: admin._id,
          username: admin.username
        }
      };
    } catch (error) {
      throw error;
    }
  },
  
  /**
   * Verifica si un token JWT es válido
   * @param {string} token - Token JWT a verificar
   * @returns {Promise<object>} - Datos del administrador decodificados del token
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id);
      
      if (!admin) {
        throw new Error('Administrador no encontrado');
      }
      
      return {
        id: admin._id,
        username: admin.username
      };
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
};

module.exports = authService;