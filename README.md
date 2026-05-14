# 📚 Academic Workload Analyzer

A full-stack web application designed to help students optimize and manage their academic workload by tracking courses, tasks, and deadlines. Built as part of the System Analysis and Design course - Spring 2026.

---

## 🛠️ Tech Stack

| Layer      |                 Technology                   |
|------------|----------------------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript, Bootstrap 5 |
| Backend    | Node.js, Express.js                          |
| Database   | SQLite (Embedded)                            |
| Docs       | Swagger / OpenAPI 3.0                        |
| Testing    | Jest                                         |

---

## 📁 Project Structure

```text
academic-workload-analyzer/
├── backend/
│   ├── controllers/
│   │   └── workloadLogic.js      # Isolated business logic for calculations
│   ├── routes/
│   │   ├── courses.js            # Course API endpoints (CRUD)
│   │   ├── dashboard.js          # Dashboard statistics endpoints
│   │   └── tasks.js              # Task API endpoints (CRUD)
│   ├── tests/
│   │   └── workloadLogic.test.js # Jest unit tests for the business logic
│   ├── database.js               # SQLite database setup and schema initialization
│   └── server.js                 # Entry point, Express setup, and SPA fallback
├── frontend/
│   ├── css/
│   │   └── style.css             # Custom UI enhancements and hover effects
│   ├── js/
│   │   ├── api.js                # Fetch API calls to backend
│   │   └── app.js                # UI logic, DOM manipulation, and SPA routing
│   └── index.html                # Main application interface
├── package.json                  # Dependencies and scripts
├── swagger.yaml                  # Swagger configuration file
└── README.md                     # Project documentation

```

---

## ⚙️ Setup & Installation

### Prerequisites

* Node.js (v14 or higher)
* npm (Node Package Manager)

### Steps

1. **Clone the repository**
```bash
git clone [https://github.com/Ahmed55455/Academic-Workload-Analyzer.git]
 cd academic-workload-analyzer

```

2. **Install backend dependencies**

```bash
npm install

```

3. **Start the backend server**

```bash
node backend/server.js

```

*The server will start, initialize the SQLite database automatically, and run on 
`http://localhost:3000*`

4. **Access the application**
Open your web browser and navigate directly to: `http://localhost:3000`

---

## 🚀 API Endpoints

### Courses API (`/api/courses`)

| Method |       Endpoint     |      Description    |
| GET    | `/api/courses`     | Get all courses     |
| POST   | `/api/courses`     | Create a new course |
| PUT    | `/api/courses/:id` | Update a course     |
| DELETE | `/api/courses/:id` | Delete a course     |

### Tasks API (`/api/tasks`)

| Method |     Endpoint     |                Description                   |
| GET    | `/api/tasks`     | Get all tasks (includes joined course names) |
| POST   | `/api/tasks`     | Create a new task                            |
| PUT    | `/api/tasks/:id` | Update a task                                |
| DELETE | `/api/tasks/:id` | Delete a task                                |

### Dashboard API (`/api/dashboard`)

| Method |        Endpoint        |                   Description                    |
| GET    | `/api/dashboard/stats` | Retrieve workload statistics and dynamic metrics |

---

## 🧮 Mathematical Calculations & Business Logic

To ensure testability and adhere to the Single Responsibility Principle, core calculations are isolated in `controllers/workloadLogic.js`. The system performs the following calculations automatically:

|     Calculation     |                           Logic / Description                               |
| **Completion Rate** | `(completed tasks / total tasks) × 100` (Rounded to the nearest integer)    |
| **Overdue Count**   | Counts tasks where `deadline < today` AND `status ≠ completed`              |
| **Busiest Course**  | Identifies the course entity associated with the highest frequency of tasks |

---

## 📖 API Documentation

Interactive Swagger documentation is integrated directly into the application. Once the server is running, you can test and explore the APIs at:

[http://localhost:3000/api-docs](https://www.google.com/search?q=http://localhost:3000/api-docs)

---

## 🧪 Running Tests

The business logic is fully covered by unit tests using Jest. To run the test suite:

```bash
npx jest

```

**Expected output:**

```text
PASS  backend/tests/workloadLogic.test.js
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total

```

---

## ✅ Key Features

* **Full CRUD operations:** Complete data management for Courses and Tasks.
* **Relational Data:** Tasks linked to Courses via `course_id` foreign keys.
* **Architectural Separation:** Business logic decoupled from API routes for robust testing.
* **Single Page Application (SPA):** Seamless navigation using Vanilla JavaScript with no full page reloads.
* **Interactive API Documentation:** Powered by Swagger UI.
* **Zero-Config Database:** Embedded SQLite database auto-generates on server start.
* **Interactive Dashboard:**
* Real-time task status counters (Total, Completed, In Progress, Pending).
* Overdue tasks detection.
* Completion rate percentage with visual progress bar.
* Busiest (Most Loaded) course detection.


* **Modern UI:** Responsive layout with Bootstrap 5, interactive modals, and Toast notifications for user feedback.

---

## 👨‍💻 Author

* **Name:** Ahmed Ehab Hassan Ali
* **Student ID:** 220303975
* **Institution:** Istanbul Arel University
* **Course:** System Analysis and Design (Spring 2026)
