// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const { 
    calculateCompletionRate, 
    getOverdueTasksCount, 
    getBusiestCourse 
} = require('../controllers/workloadLogic');

// GET: Retrieve dashboard statistics
router.get('/stats', (req, res) => {
    // 1. Fetch all courses
    db.all('SELECT * FROM courses', [], (err, courses) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // 2. Fetch all tasks
        db.all('SELECT * FROM tasks', [], (err, tasks) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Calculate basic counts
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.status === 'completed').length;
            const pendingTasks = tasks.filter(t => t.status === 'pending').length;
            const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

            // 3. Apply isolated business logic functions
            const completionRate = calculateCompletionRate(tasks);
            const overdueCount = getOverdueTasksCount(tasks);
            const busiestCourse = getBusiestCourse(courses, tasks);

            // 4. Send the compiled stats to the frontend
            res.json({
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                completionRate,
                overdueCount,
                busiestCourseName: busiestCourse ? busiestCourse.name : 'N/A'
            });
        });
    });
});

module.exports = router;