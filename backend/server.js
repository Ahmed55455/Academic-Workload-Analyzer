// backend/server.js
// Project: Academic Workload Analyzer
// Author: Ahmed Ehab Hassan Ali (ID: 220303975)

const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Import the authentication middleware (Security Guard)
const authenticateToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and enabling CORS
app.use(cors());
app.use(express.json());

// Serve Static Frontend Files (SPA requirement)
app.use(express.static(path.join(__dirname, '../frontend')));

// Load and setup Swagger UI for API Documentation
try {
    const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.log("Note: swagger.yaml not found or has an issue.");
}

// Import API Routes
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const tasksRoutes = require('./routes/tasks');
const dashboardRoutes = require('./routes/dashboard');

// Register API Routes
// 1. Auth routes must stay PUBLIC so users can register and login
app.use('/api/auth', authRoutes);

// 2. Data routes are now PROTECTED. The security guard checks the token first!
app.use('/api/courses', authenticateToken, coursesRoutes);
app.use('/api/tasks', authenticateToken, tasksRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// Fallback route to serve index.html for Single Page Application (SPA)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});