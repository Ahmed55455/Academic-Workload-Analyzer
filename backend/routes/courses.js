// backend/routes/courses.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// GET: Retrieve all courses
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM courses';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST: Create a new course
router.post('/', (req, res) => {
    const { name, instructor } = req.body;
    
    // Validation
    if (!name) {
        return res.status(400).json({ error: "Course name is required." });
    }

    const sql = 'INSERT INTO courses (name, instructor) VALUES (?, ?)';
    db.run(sql, [name, instructor], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Return the newly created course with status 201 (Created)
        res.status(201).json({ id: this.lastID, name, instructor });
    });
});

// PUT: Update an existing course
router.put('/:id', (req, res) => {
    const courseId = req.params.id;
    const { name, instructor } = req.body;

    const sql = 'UPDATE courses SET name = ?, instructor = ? WHERE id = ?';
    db.run(sql, [name, instructor, courseId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Course not found." });
        }
        res.json({ message: "Course updated successfully.", id: courseId });
    });
});

// DELETE: Remove a course
router.delete('/:id', (req, res) => {
    const courseId = req.params.id;

    const sql = 'DELETE FROM courses WHERE id = ?';
    db.run(sql, courseId, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Course not found." });
        }
        res.json({ message: "Course deleted successfully.", id: courseId });
    });
});

module.exports = router;