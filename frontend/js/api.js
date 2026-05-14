// frontend/js/api.js

const API_BASE_URL = '/api';

// ==================== DASHBOARD API ====================
async function fetchDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// ==================== COURSES API ====================
async function fetchCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        if (!response.ok) throw new Error('Failed to fetch courses');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function addCourse(courseData) {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData)
        });
        if (!response.ok) throw new Error('Failed to add course');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deleteCourse(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete course');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// ==================== TASKS API ====================
async function fetchTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function addTask(taskData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        if (!response.ok) throw new Error('Failed to add task');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function updateTask(id, taskData) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete task');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}