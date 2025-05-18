const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// Ruta para obtener todos los proyectos
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ message: 'Error al obtener proyectos', error: error.message });
  }
});

// Ruta para obtener un proyecto por ID
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error al obtener el proyecto:', error);
    res.status(500).json({ message: 'Error al obtener el proyecto', error: error.message });
  }
});

// Ruta para agregar un nuevo proyecto
router.post('/projects', async (req, res) => {
  try {
    const { name, description, technologies, url, imageUrl, github } = req.body;
    
    // Validar datos
    if (!name || !description || !technologies) {
      return res.status(400).json({ message: 'Nombre, descripción y tecnologías son obligatorios' });
    }
    
    const project = new Project({
      name,
      description,
      technologies,
      url,
      imageUrl,
      github
    });
    
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    res.status(400).json({ message: 'Error al crear el proyecto', error: error.message });
  }
});

// Ruta para actualizar un proyecto existente
router.put('/projects/:id', async (req, res) => {
  try {
    const { name, description, technologies, url, imageUrl, github } = req.body;
    
    // Validar datos
    if (!name || !description || !technologies) {
      return res.status(400).json({ message: 'Nombre, descripción y tecnologías son obligatorios' });
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        technologies,
        url,
        imageUrl,
        github
      },
      { new: true } // Devuelve el documento actualizado
    );
    
    if (!updatedProject) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    res.status(500).json({ message: 'Error al actualizar el proyecto', error: error.message });
  }
});

// Ruta para eliminar un proyecto
router.delete('/projects/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    
    if (!deletedProject) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    res.json({ message: 'Proyecto eliminado correctamente', project: deletedProject });
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    res.status(500).json({ message: 'Error al eliminar el proyecto', error: error.message });
  }
});

module.exports = router;

