// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// GET: Retrieve all tasks belonging ONLY to the logged-in user (Includes a JOIN to get the course name)
router.get('/', (req, res) => {
    // Added 'WHERE tasks.user_id = ?' to isolate data per user account
    const sql = `
        SELECT tasks.*, courses.name AS course_name 
        FROM tasks 
        LEFT JOIN courses ON tasks.course_id = courses.id
        WHERE tasks.user_id = ?
    `;
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST: Create a new task tied to the logged-in user
router.post('/', (req, res) => {
    const { title, description, status, deadline, course_id } = req.body;
    
    // Validation
    if (!title) {
        return res.status(400).json({ error: "Task title is required." });
    }

    const taskStatus = status || 'pending';

    // Added user_id to the columns and values list
    const sql = `
        INSERT INTO tasks (title, description, status, deadline, course_id, user_id) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [title, description, taskStatus, deadline, course_id, req.user.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            id: this.lastID, 
            title, 
            description, 
            status: taskStatus, 
            deadline, 
            course_id,
            user_id: req.user.id
        });
    });
});

// PUT: Update an existing task (Only if it belongs to the logged-in user)
router.put('/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, description, status, deadline, course_id } = req.body;

    // Added 'AND user_id = ?' to make sure users can't modify other people's tasks
    const sql = `
        UPDATE tasks 
        SET title = ?, description = ?, status = ?, deadline = ?, course_id = ? 
        WHERE id = ? AND user_id = ?
    `;
    
    db.run(sql, [title, description, status, deadline, course_id, taskId, req.user.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found or unauthorized access." });
        }
        res.json({ message: "Task updated successfully.", id: taskId });
    });
});

// DELETE: Remove a task (Only if it belongs to the logged-in user)
router.delete('/:id', (req, res) => {
    const taskId = req.params.id;

    // Added 'AND user_id = ?' to prevent unauthorized task deletions via direct API exploitation
    const sql = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    db.run(sql, [taskId, req.user.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Task not found or unauthorized access." });
        }
        res.json({ message: "Task deleted successfully.", id: taskId });
    });
});

module.exports = router;