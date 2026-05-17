```markdown
<div align="center">

# 📚 Academic Workload Analyzer

**A full-stack web application designed to help students optimize and manage their academic workload by tracking courses, tasks, and deadlines with secure multi-user data isolation.**

*Built as part of the **System Analysis and Design** course — Spring 2026*

</div>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:-----:|------------|
| 🎨 **Frontend** | HTML5, CSS3, Vanilla JavaScript, Bootstrap 5 |
| ⚙️ **Backend** | Node.js, Express.js |
| 🔒 **Security** | JSON Web Tokens (JWT), Bcrypt.js |
| 🗄️ **Database** | SQLite (Embedded with Foreign Key Constraints) |
| 📄 **Docs** | Swagger / OpenAPI 3.0 (with Bearer Auth support) |
| 🧪 **Testing** | Jest |

</div>

---

## 📁 Project Structure

```text
academic-workload-analyzer/
├── backend/
│   ├── controllers/
│   │   └── workloadLogic.js      # Isolated business logic for calculations
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware for route protection
│   ├── routes/
│   │   ├── auth.js               # Public endpoints for user registration & login
│   │   ├── courses.js            # Course API endpoints (CRUD with user isolation)
│   │   ├── dashboard.js          # Dashboard statistics endpoints (User-specific context)
│   │   └── tasks.js              # Task API endpoints (CRUD with user isolation)
│   ├── tests/
│   │   └── workloadLogic.test.js # Jest unit tests for the business logic
│   ├── database.js               # SQLite database setup, multi-user schema initialization
│   └── server.js                 # Entry point, Express setup, security initialization, SPA fallback
├── frontend/
│   ├── css/
│   │   └── style.css             # Custom UI enhancements and hover effects
│   ├── js/
│   │   ├── api.js                # Fetch API calls to backend with dynamic JWT header injections
│   │   ├── app.js                # UI logic, DOM manipulation, and frontend routing guards
│   │   └── login.js              # Account authentication, registration checking & toggle UI logic
│   ├── index.html                # Main application interface (Dashboard view)
│   └── login.html                # User registration and authentication interface portal
├── package.json                  # Dependencies and scripts
├── swagger.yaml                  # Swagger configuration file with token authentication security locks
└── README.md                     # Project documentation

```

---

## ⚙️ Setup & Installation

### Prerequisites

* Node.js (v14 or higher)
* npm (Node Package Manager)

### Steps

**1. Clone the repository**

```bash
git clone [https://github.com/Ahmed55455/Academic-Workload-Analyzer.git]
          (https://github.com/Ahmed55455/Academic-Workload-Analyzer.git)
cd academic-workload-analyzer

```

**2. Install dependencies**

```bash
npm install

```

**3. Start the backend server**

```bash
node backend/server.js

```

> 💡 The server will start, initialize the SQLite database automatically, and run on `http://localhost:3000`

**4. Access the application**

Open your web browser and navigate to: 🔗 [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

---

## 🚀 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new student account (Enforces double-check confirmation logic) |
| `POST` | `/api/auth/login` | Authenticate student credentials and return an encrypted bearer JWT token |

> 🔒 *Requires Header:* `Authorization: Bearer <JWT_TOKEN>`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/courses` | Get all courses belonging ONLY to the logged-in student account |
| `POST` | `/api/courses` | Create a new course linked directly to the active user profile |
| `PUT` | `/api/courses/:id` | Update a course entity (Ownership context matching enforced) |
| `DELETE` | `/api/courses/:id` | Delete a course and its associated tasks (Ownership context matching enforced) |

> 🔒 *Requires Header:* `Authorization: Bearer <JWT_TOKEN>`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/tasks` | Get all tasks belonging ONLY to the logged-in user (includes joined course names) |
| `POST` | `/api/tasks` | Create a new task tied to the active user account |
| `PUT` | `/api/tasks/:id` | Update an existing task (Ownership context matching enforced) |
| `DELETE` | `/api/tasks/:id` | Delete an assignment task row securely (Ownership context matching enforced) |

> 🔒 *Requires Header:* `Authorization: Bearer <JWT_TOKEN>`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/dashboard/stats` | Retrieve isolated workload statistics and dynamic user-specific metrics |

---

## 🧮 Mathematical Calculations & Business Logic

> To ensure testability and adhere to the **Single Responsibility Principle**, core calculations are isolated in `controllers/workloadLogic.js`.

The system performs the following calculations automatically:

| Calculation | Logic / Description |
| --- | --- |
| ✅ **Completion Rate** | `(completed tasks / total tasks) × 100` — Rounded to the nearest integer |
| ⚠️ **Overdue Count** | Counts tasks where `deadline < today` AND `status ≠ completed` |
| 🏆 **Busiest Course** | Identifies the course entity associated with the highest frequency of tasks |

---

## 📖 API Documentation

Interactive Swagger documentation is integrated directly into the application. Once the server is running, explore and test all API endpoints at:

🔗 **[http://localhost:3000/api-docs](https://www.google.com/search?q=http://localhost:3000/api-docs)**

> 💡 *Testing Secure Endpoints via Swagger UI: Execute your login request under the **Auth** section, copy the parsed text token string from the successful server response, scroll up to click the **Authorize** lock button layout, paste it inside the value input container, and hit close.*

---

## 🧪 Running Tests

The business logic is fully covered by unit tests using **Jest**. To run the test suite:

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

| Feature | Description |
| --- | --- |
| 🔒 **Multi-User Security Guard** | Secure user registration and session state verification via cryptographically signed JSON Web Tokens (JWT) and Bcrypt password hashing |
| 🛡️ **Account Data Isolation** | Complete database query segmentation using parameterized runtime execution locks (`WHERE user_id = ?`) preventing accidental data cross-contamination |
| 🔄 **Full CRUD Operations** | Complete transactional data management operations for tracking Courses and Tasks |
| 🔗 **Relational Data Integrity** | Database level table relations linking Task records safely to Course IDs with cascaded cleanup configurations |
| 🏗️ **Architectural Separation** | Core mathematical algorithms decoupled from network layer routes for structural testability |
| ⚡ **Single Page Application** | Clean, fast view routing management handled using Vanilla JavaScript components with native client tracking restrictions |
| 📄 **Interactive API Docs** | Powered by Swagger UI with unified bearer scheme locking controls |
| 🗄️ **Zero-Config Database** | Embedded SQLite relational storage engine that auto-generates on server bootstrap execution |
| 📊 **Interactive Dashboard** | Real-time calculation widgets showing completion rates, task frequencies, overdue markers, and dynamic course-specific lists |
| 🎨 **Modern UI Layout** | Fully responsive Bootstrap layout system utilizing secure input placeholders, modal boxes, and native Toast notifications |

---

## 👨‍💻 Author

| Field | Details |
| --- | --- |
| 🧑 **Name** | Ahmed Ehab Hassan Ali |
| 🪪 **Student ID** | 220303975 |
| 🏛️ **Institution** | Istanbul Arel University |
| 📚 **Course** | System Analysis and Design — Spring 2026 |

*Made with ❤️ for the System Analysis and Design course*