// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const { 
    calculateCompletionRate, 
    getOverdueTasksCount, 
    getBusiestCourse 
} = require('../controllers/workloadLogic');

router.get('/stats', (req, res) => {
    const userId = req.user.id; // From our security middleware

    // Step 1: Fetch user-specific courses
    const coursesQuery = 'SELECT id, name FROM courses WHERE user_id = ?';
    
    db.all(coursesQuery, [userId], (err, courses) => {
        if (err) return res.status(500).json({ error: err.message });

        // Step 2: Fetch user-specific tasks
        const tasksQuery = 'SELECT status, deadline, course_id FROM tasks WHERE user_id = ?';
        
        db.all(tasksQuery, [userId], (err, tasks) => {
            if (err) return res.status(500).json({ error: err.message });

            // Step 3: Run counts and calculations for this specific user
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.status === 'completed').length;
            const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
            const pendingTasks = tasks.filter(t => t.status === 'pending').length;

            // Use your business logic functions from workloadLogic.js
            const completionRate = calculateCompletionRate(tasks);
            const overdueCount = getOverdueTasksCount(tasks, new Date());
            const busiestCourseObj = getBusiestCourse(courses, tasks);
            const busiestCourseName = busiestCourseObj ? busiestCourseObj.name : 'N/A';

            // Step 4: Map tasks per course for the frontend dashboard widget
            const tasksPerCourse = courses.map(course => {
                const count = tasks.filter(t => t.course_id === course.id).length;
                return { name: course.name, count };
            });

            // Step 5: Calculate Urgency categories (High, Medium, Low) based on the deadline
            const urgency = { high: 0, medium: 0, low: 0 };
            const now = new Date();

            tasks.forEach(task => {
                if (task.status !== 'completed' && task.deadline) {
                    const diffTime = new Date(task.deadline) - now;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays <= 3) urgency.high++;
                    else if (diffDays <= 7) urgency.medium++;
                    else urgency.low++;
                }
            });

            // Step 6: Send the completely isolated dataset back to the user
            res.json({
                totalTasks,
                completedTasks,
                inProgressTasks,
                pendingTasks,
                completionRate,
                overdueCount,
                busiestCourseName,
                tasksPerCourse,
                urgency
            });
        });
    });
});

module.exports = router;