// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Set the path to the root directory for the database file
const dbPath = path.resolve(__dirname, '../workload.sqlite');

// Initialize the database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeTables();
    }
});

// Function to create the necessary tables
function initializeTables() {
    // Schema for Courses
    const createCoursesTable = `
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            instructor TEXT
        )
    `;

    // Schema for Tasks
    const createTasksTable = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'pending',
            deadline DATE,
            course_id INTEGER,
            FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
        )
    `;

    db.serialize(() => {
        // Enforce foreign key constraints in SQLite (important for ON DELETE CASCADE)
        db.run("PRAGMA foreign_keys = ON;");

        // Execute table creation
        db.run(createCoursesTable, (err) => {
            if (err) console.error("Error creating courses table:", err.message);
        });

        db.run(createTasksTable, (err) => {
            if (err) console.error("Error creating tasks table:", err.message);
        });
        
        console.log("Database tables initialized successfully.");
    });
}

// Export the database object to use it in our routes
module.exports = db;