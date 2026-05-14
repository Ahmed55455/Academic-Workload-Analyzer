// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// GET: Retrieve all tasks (Includes a JOIN to get the course name)
router.get('/', (req, res) => {
    const sql = `
        SELECT tasks.*, courses.name AS course_name 
        FROM tasks 
        LEFT JOIN courses ON tasks.course_id = courses.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST: Create a new task
router.post('/', (req, res) => {
    const { title, description, status, deadline, course_id } = req.body;
    
    // Validation
    if (!title) {
        return res.status(400).json({ error: "Task title is required." });
    }

    const taskStatus = status || 'pending';

    const sql = `
        INSERT INTO tasks (title, description, status, deadline, course_id) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [title, description, taskStatus, deadline, course_id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            id: this.lastID, 
            title, 
            description, 
            status: taskStatus, 
            deadline, 
            course_id 
        });
    });
});

// PUT: Update an existing task
router.put('/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, deadline, course_id } = req.body;

    const sql = `
        UPDATE tasks 
        SET title = ?, description = ?, status = ?, deadline = ?, course_id = ? 
        WHERE id = ?
    `;
    
    db.run(sql, [title, description, status, deadline, course_id, taskId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found." });
        }
        res.json({ message: "Task updated successfully.", id: taskId });
    });
});

// DELETE: Remove a task
router.delete('/:id', (req, res) => {
    const taskId = req.params.id;

    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.run(sql, taskId, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found." });
        }
        res.json({ message: "Task deleted successfully.", id: taskId });
    });
});

module.exports = router;