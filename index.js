const express = require("express");

const server = express();
const projects = [];

/* Functions */
const _getProjectById = id =>
  projects.filter(project => project.id === id)[0] || null;

/* Middlewares */
server.use(express.json());

function validateProjectCreation(req, res, next) {
  const { id, title } = req.body;
  const errors = [];

  if (!id) {
    errors.push("Project `id` is required");
  }

  if (!title) {
    errors.push("Project `title` is required");
  }

  const project = _getProjectById(id);

  if (project) {
    errors.push(`Project with \`id\` ${id} already exists`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  return next();
}

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;
  const project = _getProjectById(id);

  if (!project) {
    return res.status(400).json({
      error: "Project does not exits"
    });
  }

  req.project = project;

  return next();
}

/* Routes */
// Home
server.get("/", (req, res) => {
  return res.json({
    data: {
      message: "Welcome to Bootcamp Todo List!"
    },
    links: ["http://localhost:3000/projects"]
  });
});

// Create Project
server.post("/projects", validateProjectCreation, (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title });

  return res.status(201).json(projects);
});

// Edit Projects
server.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(req.project);
});

/* Settings */
server.listen(3000);
