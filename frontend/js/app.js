// frontend/js/app.js
// Project: Academic Workload Analyzer
// Author: Ahmed Ehab Hassan Ali (ID: 220303975)

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    loadDashboardStats();
    loadCourses();
    loadTasks();
});

// ==================== UI & TABS MANAGEMENT ====================
function showTab(tabId) {
    // Hide all sections
    document.getElementById('dashboard-section').style.display = 'none';
    document.getElementById('courses-section').style.display = 'none';
    document.getElementById('tasks-section').style.display = 'none';

    // Remove active class from all tabs
    document.getElementById('dashboard-tab').classList.remove('active');
    document.getElementById('courses-tab').classList.remove('active');
    document.getElementById('tasks-tab').classList.remove('active');

    // Show selected section and activate tab
    document.getElementById(`${tabId}-section`).style.display = 'block';
    document.getElementById(`${tabId}-tab`).classList.add('active');

    // Refresh data when navigating
    if (tabId === 'dashboard') loadDashboardStats();
    if (tabId === 'courses') loadCourses();
    if (tabId === 'tasks') loadTasks();
}

function showToast(message) {
    document.getElementById('toast-message').textContent = message;
    const toastElement = document.getElementById('appToast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

// ==================== DASHBOARD LOGIC ====================
async function loadDashboardStats() {
    const stats = await fetchDashboardStats();
    if (!stats) return;

    // Update Top Cards
    document.getElementById('stat-total').textContent = stats.totalTasks;
    document.getElementById('stat-completed').textContent = stats.completedTasks;
    document.getElementById('stat-inprogress').textContent = stats.inProgressTasks;
    document.getElementById('stat-pending').textContent = stats.pendingTasks;
    document.getElementById('stat-overdue').textContent = stats.overdueCount;

    // Update Completion Rate
    document.getElementById('stat-rate').textContent = `${stats.completionRate}%`;
    document.getElementById('stat-progress').style.width = `${stats.completionRate}%`;

    // Update Busiest Course
    document.getElementById('stat-busiest').textContent = stats.busiestCourseName;

    // Update Tasks Per Course (المكان الصحيح هنا)
    const courseBreakdown = document.getElementById('course-breakdown');
    if (stats.tasksPerCourse && stats.tasksPerCourse.length > 0) {
        courseBreakdown.innerHTML = stats.tasksPerCourse.map(c => `
            <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <span class="text-secondary fw-semibold">${c.name}</span>
                <span class="badge bg-primary rounded-pill px-3 py-2">${c.count} Tasks</span>
            </div>
        `).join('');
    } else {
        courseBreakdown.innerHTML = '<p class="text-muted">No course data available.</p>';
    }

    // Update Urgency Status (المكان الصحيح هنا)
    const urgencyBreakdown = document.getElementById('urgency-breakdown');
    if (stats.urgency && (stats.urgency.high > 0 || stats.urgency.medium > 0 || stats.urgency.low > 0)) {
        urgencyBreakdown.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-danger fw-bold"><i class="bi bi-circle-fill me-2"></i>High (≤ 3 Days)</span>
                <span class="fs-5 fw-bold">${stats.urgency.high}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-warning fw-bold"><i class="bi bi-circle-fill me-2"></i>Medium (≤ 7 Days)</span>
                <span class="fs-5 fw-bold">${stats.urgency.medium}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <span class="text-success fw-bold"><i class="bi bi-circle-fill me-2"></i>Low (> 7 Days)</span>
                <span class="fs-5 fw-bold">${stats.urgency.low}</span>
            </div>
        `;
    } else {
        urgencyBreakdown.innerHTML = '<p class="text-muted">No upcoming deadlines.</p>';
    }
}

// ==================== COURSES LOGIC ====================
let courseModalInstance = null;

function getCourseModal() {
    if (!courseModalInstance) {
        courseModalInstance = new bootstrap.Modal(document.getElementById('courseModal'));
    }
    return courseModalInstance;
}

function openCourseModal(course = null) {
    const modal = getCourseModal();
    document.getElementById('courseModalTitle').textContent = course ? 'Edit Course' : 'Add Course';
    
    document.getElementById('course-id').value = course ? course.id : '';
    document.getElementById('course-name').value = course ? course.name : '';
    document.getElementById('course-instructor').value = course ? course.instructor : '';
    
    modal.show();
}

async function loadCourses() {
    const courses = await fetchCourses();
    const tbody = document.getElementById('courses-table-body');
    const taskCourseSelect = document.getElementById('task-course');
    
    tbody.innerHTML = '';
    taskCourseSelect.innerHTML = '<option value="">-- No Course --</option>';

    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No courses found. Add one!</td></tr>';
        return;
    }

    courses.forEach((course, index) => {
        // Populate Table
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td class="fw-bold">${course.name}</td>
            <td>${course.instructor || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick='openCourseModal(${JSON.stringify(course)})'>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="removeCourse(${course.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);

        // Populate Dropdown in Task Modal
        const option = document.createElement('option');
        option.value = course.id;
        option.textContent = course.name;
        taskCourseSelect.appendChild(option);
    });
}

async function saveCourse() {
    const id = document.getElementById('course-id').value;
    const name = document.getElementById('course-name').value;
    const instructor = document.getElementById('course-instructor').value;

    if (!name) {
        alert("Course name is required!");
        return;
    }

    const courseData = { name, instructor };

    if (id) {
        await fetch(`/api/courses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData)
        });
        showToast("Course updated successfully!");
    } else {
        await addCourse(courseData);
        showToast("Course added successfully!");
    }

    getCourseModal().hide();
    loadCourses();
    loadDashboardStats(); 
}

async function removeCourse(id) {
    if (confirm("Are you sure? This will delete the course and all associated tasks!")) {
        await deleteCourse(id);
        showToast("Course deleted.");
        loadCourses();
        loadTasks();
        loadDashboardStats();
    }
}

// ==================== TASKS LOGIC ====================
let taskModalInstance = null;

function getTaskModal() {
    if (!taskModalInstance) {
        taskModalInstance = new bootstrap.Modal(document.getElementById('taskModal'));
    }
    return taskModalInstance;
}

function openTaskModal(task = null) {
    const modal = getTaskModal();
    document.getElementById('taskModalTitle').textContent = task ? 'Edit Task' : 'Add Task';
    
    document.getElementById('task-id').value = task ? task.id : '';
    document.getElementById('task-title').value = task ? task.title : '';
    document.getElementById('task-description').value = task ? task.description : '';
    document.getElementById('task-status').value = task ? task.status : 'pending';
    document.getElementById('task-deadline').value = task ? task.deadline : '';
    document.getElementById('task-course').value = task ? (task.course_id || '') : '';
    
    modal.show();
}

async function loadTasks() {
    const tasks = await fetchTasks();
    const tbody = document.getElementById('tasks-table-body');
    tbody.innerHTML = '';

    if (tasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No tasks found. Get to work!</td></tr>';
        return;
    }

    tasks.forEach((task, index) => {
        let statusBadge = '';
        if (task.status === 'completed') statusBadge = '<span class="badge bg-success">Completed</span>';
        else if (task.status === 'in-progress') statusBadge = '<span class="badge bg-warning text-dark">In Progress</span>';
        else statusBadge = '<span class="badge bg-secondary">Pending</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td class="fw-bold">${task.title}</td>
            <td>${task.description || '-'}</td>
            <td>${statusBadge}</td>
            <td>${task.deadline || '-'}</td>
            <td>${task.course_name || '-'}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick='openTaskModal(${JSON.stringify(task).replace(/'/g, "\\'")})'>
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="removeTask(${task.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function saveTask() {
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const status = document.getElementById('task-status').value;
    const deadline = document.getElementById('task-deadline').value;
    const course_id = document.getElementById('task-course').value;

    if (!title) {
        alert("Task title is required!");
        return;
    }

    const taskData = { 
        title, 
        description, 
        status, 
        deadline: deadline || null, 
        course_id: course_id ? parseInt(course_id) : null 
    };

    if (id) {
        await updateTask(id, taskData);
        showToast("Task updated successfully!");
    } else {
        await addTask(taskData);
        showToast("Task added successfully!");
    }

    getTaskModal().hide();
    loadTasks();
    loadDashboardStats();
}

async function removeTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        await deleteTask(id);
        showToast("Task deleted.");
        loadTasks();
        loadDashboardStats();
    }
}