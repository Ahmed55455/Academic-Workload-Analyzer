// backend/routes/courses.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// GET: Retrieve only the courses belonging to the logged-in user
router.get('/', (req, res) => {
    // req.user.id comes directly from our authenticateToken middleware
    const sql = 'SELECT * FROM courses WHERE user_id = ?';
    
    db.all(sql, [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST: Create a new course tied to the logged-in user
router.post('/', (req, res) => {
    const { name, instructor } = req.body;
    
    // Validation
    if (!name) {
        return res.status(400).json({ error: "Course name is required." });
    }

    // Now including user_id in the insert statement
    const sql = 'INSERT INTO courses (name, instructor, user_id) VALUES (?, ?, ?)';
    
    db.run(sql, [name, instructor, req.user.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Return the newly created course with its assigned user_id
        res.status(201).json({ id: this.lastID, name, instructor, user_id: req.user.id });
    });
});

// PUT: Update an existing course (Only if it belongs to the logged-in user)
router.put('/:id', (req, res) => {
    const courseId = req.params.id;
    const { name, instructor } = req.body;

    // Added 'AND user_id = ?' to prevent editing someone else's course data
    const sql = 'UPDATE courses SET name = ?, instructor = ? WHERE id = ? AND user_id = ?';
    
    db.run(sql, [name, instructor, courseId, req.user.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Course not found or unauthorized access." });
        }
        res.json({ message: "Course updated successfully.", id: courseId });
    });
});

// DELETE: Remove a course (Only if it belongs to the logged-in user)
router.delete('/:id', (req, res) => {
    const courseId = req.params.id;

    // Added 'AND user_id = ?' to prevent deleting someone else's course data
    const sql = 'DELETE FROM courses WHERE id = ? AND user_id = ?';
    
    db.run(sql, [courseId, req.user.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Course not found or unauthorized access." });
        }
        res.json({ message: "Course deleted successfully.", id: courseId });
    });
});

module.exports = router;