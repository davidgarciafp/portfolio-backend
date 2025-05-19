const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Middleware para verificar autenticación mediante token JWT
 */
module.exports = async function(req, res, next) {
  // Obtener token del header
  const token = req.header('x-auth-token');
  
  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada' });
  }
  
  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar si el admin existe
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    
    // Añadir el admin al objeto request
    req.admin = {
      id: admin._id,
      username: admin.username
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};