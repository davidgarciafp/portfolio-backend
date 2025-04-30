const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// Ruta para obtener todos los proyectos
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para agregar un nuevo proyecto
router.post('/projects', async (req, res) => {
  const { name, description, technologies, url, imageUrl } = req.body;

  const project = new Project({
    name,
    description,
    technologies,
    url,
    imageUrl
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

