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
            const overdueCount = getOverdueTasksCount(tasks, new Date());
            const busiestCourse = getBusiestCourse(courses, tasks);

            // --- NEW LOGIC: Tasks Per Course ---
            const tasksPerCourse = courses.map(course => {
                const count = tasks.filter(t => t.course_id === course.id).length;
                return { name: course.name, count };
            }).filter(c => c.count > 0); // Only show courses that have tasks

            // --- NEW LOGIC: Urgency Status ---
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const urgency = { high: 0, medium: 0, low: 0 };
            
            tasks.forEach(t => {
                if(t.status === 'completed' || !t.deadline) return;
                
                const deadlineDate = new Date(t.deadline);
                const diffTime = deadlineDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays >= 0 && diffDays <= 3) urgency.high++;
                else if (diffDays > 3 && diffDays <= 7) urgency.medium++;
                else if (diffDays > 7) urgency.low++;
            });

            // 4. Send the compiled stats to the frontend
            res.json({
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                completionRate,
                overdueCount,
                busiestCourseName: busiestCourse ? busiestCourse.name : 'N/A',
                tasksPerCourse, // Sent to frontend
                urgency         // Sent to frontend
            });
        });
    });
});

module.exports = router;