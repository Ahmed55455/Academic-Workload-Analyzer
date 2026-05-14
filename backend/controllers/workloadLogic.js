// backend/controllers/workloadLogic.js

/**
 * Calculates the completion rate of tasks.
 * @param {Array} tasks - Array of task objects.
 * @returns {number} - Completion percentage (0-100).
 */
function calculateCompletionRate(tasks) {
    if (!tasks || tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
}

/**
 * Counts the number of overdue tasks.
 * @param {Array} tasks - Array of task objects.
 * @param {Date|string} currentDate - The current date to compare against.
 * @returns {number} - Number of overdue tasks.
 */
function getOverdueTasksCount(tasks, currentDate = new Date()) {
    if (!tasks || tasks.length === 0) return 0;
    
    const today = new Date(currentDate);
    // Set time to midnight for accurate day comparison
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
        if (task.status === 'completed' || !task.deadline) return false;
        
        const deadlineDate = new Date(task.deadline);
        return deadlineDate < today;
    }).length;
}

/**
 * Identifies the course with the highest number of tasks.
 * @param {Array} courses - Array of course objects.
 * @param {Array} tasks - Array of task objects.
 * @returns {Object|null} - The course object with the most tasks, or null if no tasks.
 */
function getBusiestCourse(courses, tasks) {
    if (!courses || courses.length === 0 || !tasks || tasks.length === 0) return null;

    const courseTaskCounts = {};
    
    // Count tasks per course
    tasks.forEach(task => {
        if (task.course_id) {
            courseTaskCounts[task.course_id] = (courseTaskCounts[task.course_id] || 0) + 1;
        }
    });

    if (Object.keys(courseTaskCounts).length === 0) return null;

    // Find the course ID with the maximum tasks
    let busiestCourseId = null;
    let maxTasks = -1;

    for (const [courseId, count] of Object.entries(courseTaskCounts)) {
        if (count > maxTasks) {
            maxTasks = count;
            busiestCourseId = parseInt(courseId);
        }
    }

    // Find and return the actual course object
    return courses.find(course => course.id === busiestCourseId) || null;
}

// Export the functions so they can be used in routes and unit tests
module.exports = {
    calculateCompletionRate,
    getOverdueTasksCount,
    getBusiestCourse
};