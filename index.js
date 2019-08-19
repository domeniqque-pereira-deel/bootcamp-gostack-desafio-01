const express = require("express");

const server = express();
const projects = [];

/* Functions */
const _getProjectById = id =>
  projects.filter(project => project.id === id)[0] || null;

/* Middlewares */
server.use(express.json());

function validateCreateProject(req, res, next) {
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
    errors.push(`Project with id \`${id}\` already exists`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

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
server.post("/projects", validateCreateProject, (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title });

  return res.json(projects);
});

/* Settings */
server.listen(3000);
