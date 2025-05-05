const mongoose = require('mongoose');
require('../models/Project'); // Importa el modelo

// Obtener la cadena de conexión de MongoDB Atlas desde las variables de entorno
const mongoURI = process.env.MONGO_URI;

async function testConnection() {
  try {
    // Verificar si la variable de entorno MONGO_URI está configurada
    if (!mongoURI) {
      throw new Error('La variable de entorno MONGO_URI no está configurada. Esta variable debe contener tu cadena de conexión de MongoDB Atlas.');
    }

    console.log('Intentando conectar a MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    
    console.log('¡Conexión exitosa a MongoDB Atlas!');
    
    // Intenta obtener los proyectos
    const Project = mongoose.model('Project');
    const projects = await Project.find({});
    
    console.log(`Se encontraron ${projects.length} proyectos:`);
    if (projects.length > 0) {
      projects.forEach(project => {
        console.log(`- ${project.name || 'Sin nombre'}: ${project.description ? project.description.substring(0, 30) + '...' : 'Sin descripción'}`);
      });
    } else {
      console.log('No hay proyectos en la base de datos.');
    }
    
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error.message);
    
    if (error.message.includes('MONGO_URI')) {
      console.error('\nPara configurar la variable de entorno MONGO_URI, ejecuta:');
      console.error('export MONGO_URI="tu_cadena_de_conexion_de_atlas"');
      console.error('\nO ejecuta el script directamente con la variable:');
      console.error('MONGO_URI="tu_cadena_de_conexion_de_atlas" node utils/test-mongodb-connection.js\n');
    } else if (error.name === 'MongoNetworkError' || error.message.includes('ECONNREFUSED')) {
      console.error('Parece ser un problema de red o que el servidor MongoDB Atlas no está accesible.');
      console.error('Verifica tu conexión a internet y que la cadena de conexión sea correcta.');
    }
  } finally {
    if (mongoose.connection.readyState !== 0) {
      // Cerrar la conexión solo si está abierta
      await mongoose.connection.close();
      console.log('Conexión cerrada');
    }
  }
}

testConnection();
