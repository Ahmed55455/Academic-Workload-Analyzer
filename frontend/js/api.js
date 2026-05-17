// frontend/js/api.js
const API_BASE_URL = '/api';

// Helper function to dynamically generate authentication headers for backend security verification
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// ==================== AUTHENTICATION API ====================
async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    } catch (error) {
        console.error("Login call error:", error);
        return null;
    }
}

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    } catch (error) {
        console.error("Registration call error:", error);
        return null;
    }
}

// ==================== DASHBOARD API ====================
async function fetchDashboardStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: getAuthHeaders() // Pass token security validation
        });
        if (response.status === 401 || response.status === 403) {
            handleLogout();
            return null;
        }
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
        const response = await fetch(`${API_BASE_URL}/courses`, {
            headers: getAuthHeaders()
        });
        if (response.status === 401 || response.status === 403) { handleLogout(); return []; }
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
            headers: getAuthHeaders(),
            body: JSON.stringify(courseData)
        });
        if (!response.ok) throw new Error('Failed to add course');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// 🚨 ADDED/FIXED: This function was completely missing from your file!
async function updateCourse(id, courseData) {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(), // Securely passes Ahmed's active JWT token
            body: JSON.stringify(courseData)
        });
        if (!response.ok) throw new Error('Failed to update course');
        return await response.json();
    } catch (error) {
        console.error("Course update API error:", error);
        return null;
    }
}

async function deleteCourse(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
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
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            headers: getAuthHeaders()
        });
        if (response.status === 401 || response.status === 403) { handleLogout(); return []; }
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
            headers: getAuthHeaders(),
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
            headers: getAuthHeaders(),
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
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete task');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Utility script to clear local session and forcefully sync browser view
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}