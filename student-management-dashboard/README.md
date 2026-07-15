##  Features

###  Dashboard
- Real-time stats cards (students, teachers, courses, revenue)
- Revenue vs Expenses chart (Line)
- Grade distribution chart (Doughnut)
- Weekly attendance bar chart
- Today's schedule widget
- Recent activity feed
- Quick action buttons

###  Students Module
- Full CRUD (create, read, update, delete)
- Advanced table with sorting, filtering, search, pagination
- Row selection + bulk delete
- Student detail page with tabs (Overview, Grades, Attendance, Contact)
- Add/Edit modal with form validation
- Export CSV/PDF button UI
- Status badges (Active, Graduated, Suspended, Inactive)

###  Teachers Module
- Grid and List view toggle
- Teacher profile cards with hover actions
- Department/status filtering
- Qualification badges

###  Courses Module
- Course cards with enrollment progress bars
- Status filtering (Active, Upcoming, Completed)
- Capacity indicators

###  Departments
- Department overview cards with student/teacher/course counts
- Color-coded by department code

###  Attendance
- Weekly attendance bar chart
- Monthly attendance heatmap calendar
- Attendance records table with status filtering
- Summary stat cards

###  Grades
- Grade distribution breakdown (A–F)
- Grades table with score progress bars
- Letter grade color coding
- Semester and course filtering

###  Payments & Finance
- Finance KPI cards (total collected, pending, overdue)
- Payment records table with status, type, and invoice number
- Mark as paid action

###  Schedule / Timetable
- Week view grid timetable
- List view by day
- Color-coded course blocks
- Week navigation

###  Reports & Analytics
- KPI metrics row
- Enrollment trend chart (Line)
- Revenue by type chart (Doughnut)
- Department GPA performance chart (Bar)
- Course attendance bar chart
- Downloadable report cards

###  Settings
- Profile editing with avatar upload UI
- Dark / Light mode theme switcher
- Password change form
- Notification preferences toggles

###  Auth Pages
- Sign In with show/hide password
- Register with password strength meter
- Forgot Password with success state
- Form validation on all fields

### Audit Log
- view audit

---

##  Getting Started

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x

### Installation

```bash
# Clone or extract the project
cd student-management-dashboard

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```


Expected endpoints:
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh

GET    /api/students?page=1&pageSize=10&search=&status=
POST   /api/students
GET    /api/students/:id
PUT    /api/students/:id
DELETE /api/students/:id
POST   /api/students/bulk-delete

GET    /api/teachers
GET    /api/courses
GET    /api/departments
GET    /api/attendance
GET    /api/grades
GET    /api/payments
```

To switch from mock data to live API, update the store actions — replace `await new Promise(r => setTimeout(r, 800))` calls with the real service calls already defined in `/services/`.

---

##  Build for Production

```bash
npm run build
npm run preview
```

---

##  License

MIT License — free to use for personal and commercial projects.

---
