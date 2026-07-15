import type {
  Student, Teacher, Department,
  AttendanceRecord, Grade, Payment,
  Activity, Notification, DashboardStats
} from '~/types'

// ─── Helpers ───────────────────────────────────────────────────────────────
const randomId = () => Math.random().toString(36).substring(2, 10)

const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString()
    .split('T')[0]
}

const avatarUrl = (seed: string) => null;

// ─── Mock Departments ──────────────────────────────────────────────────────
export const mockDepartments: Department[] = [
  {
    id: 'dept-cs', name: 'Computer Science',
    description: 'Computing, software, and information systems.',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'dept-math', name: 'Mathematics',
    description: 'Pure and applied mathematics.',
    thumbnail: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=600&q=80',
  },
]

// ─── Mock Teachers ─────────────────────────────────────────────────────────
const teacherNames = [
  ['James', 'Wilson'], ['Sarah', 'Chen'], ['Michael', 'Brown'], ['Emily', 'Davis'],
  ['Robert', 'Martinez'], ['Linda', 'Johnson'], ['David', 'Lee'], ['Jessica', 'Taylor'],
]

export const mockTeachers: Teacher[] = teacherNames.map(([first, last], i) => ({
  id: `teacher-${i + 1}`,
  teacherId: `TCH-${String(1000 + i).padStart(4, '0')}`,
  firstName: first,
  lastName: last,
  email: `${first.toLowerCase()}.${last.toLowerCase()}@eduadmin.edu`,
  phone: `+1 (${Math.floor(200 + Math.random() * 800)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
  avatar: avatarUrl(`teacher${i}`),
  gender: i % 3 === 0 ? 'female' : 'male',
  specialization: ['Algorithms', 'Calculus', 'Quantum Physics', 'Data Structures', 'Statistics'][i % 5],
  qualification: ['PhD', 'MSc', 'PhD', 'EdD', 'MSc'][i % 5],
  departmentId: mockDepartments[i % mockDepartments.length].id,
  department: mockDepartments[i % mockDepartments.length],
  courseIds: [],
  status: i % 8 === 0 ? 'on-leave' : 'active',
  hireDate: randomDate(new Date('2015-01-01'), new Date('2022-12-31')),
  salary: 55000 + Math.floor(Math.random() * 45000),
  bio: `Experienced educator with over ${5 + Math.floor(Math.random() * 15)} years of teaching experience.`,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z',
}))

// ─── Mock Students ─────────────────────────────────────────────────────────
const studentFirstNames = [
  'Alex', 'Jordan', 
]

const studentLastNames = [
  'Irving', 'Jones', 
]

export const mockStudents: Student[] = Array.from({ length: 50 }, (_, i) => {
  const first = studentFirstNames[i % studentFirstNames.length]
  const last = studentLastNames[i % studentLastNames.length]
  const dept = mockDepartments[i % mockDepartments.length]
  return {
    id: `student-${i + 1}`,
    studentId: `STU-${String(2000 + i).padStart(4, '0')}`,
    firstName: first,
    lastName: last,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@student.edu`,
    phone: `+1 (${Math.floor(200 + Math.random() * 800)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
    avatar: avatarUrl(`student${i}`),
    gender: i % 2 === 0 ? 'male' : 'female',
    dateOfBirth: randomDate(new Date('1999-01-01'), new Date('2006-12-31')),
    address: `${Math.floor(100 + Math.random() * 9900)} ${['Oak', 'Maple', 'Pine', 'Cedar', 'Elm'][i % 5]} St, City, State`,
    enrollmentDate: randomDate(new Date('2020-09-01'), new Date('2024-01-01')),
    status: (['active', 'active', 'active', 'active', 'inactive', 'graduated'] as const)[i % 6],
    departmentId: dept.id,
    department: dept,
    courseIds: [],
    gpa: parseFloat((2.0 + Math.random() * 2.0).toFixed(2)),
    attendanceRate: parseFloat((65 + Math.random() * 35).toFixed(1)),
    guardianName: `${['Robert', 'Susan', 'William', 'Linda', 'James'][i % 5]} ${last}`,
    guardianPhone: `+1 (${Math.floor(200 + Math.random() * 800)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  }
})

// ─── Mock Courses (legacy shape for schedule/dashboard demos) ───────────────
export interface MockLegacyCourse {
  id: string
  courseCode: string
  name: string
  description: string
  credits: number
  teacherId: string
  teacher?: Teacher
  enrolledStudents: number
  maxCapacity: number
  status: 'active' | 'inactive' | 'upcoming' | 'completed'
  startDate: string
  endDate: string
}

const courseData = [
  { code: 'CS101', name: 'Introduction to Programming', credits: 3 },
  { code: 'CS201', name: 'Data Structures & Algorithms', credits: 4 },
  { code: 'BUS201', name: 'Financial Accounting', credits: 3 },
]

export const mockCourses: MockLegacyCourse[] = courseData.map((c, i) => ({
  id: `course-${i + 1}`,
  courseCode: c.code,
  name: c.name,
  description: `Comprehensive ${c.name} course covering all fundamental concepts.`,
  credits: c.credits,
  teacherId: mockTeachers[i % mockTeachers.length].id,
  teacher: mockTeachers[i % mockTeachers.length],
  enrolledStudents: Math.floor(20 + Math.random() * 60),
  maxCapacity: 80,
  status: (['active', 'active', 'active', 'upcoming', 'completed'] as const)[i % 5],
  startDate: '2024-09-01',
  endDate: '2024-12-31',
}))

// ─── Mock Notifications ────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  {
    id: '1', type: 'info', read: false,
    title: 'New Enrollment Request',
    message: 'Alex Adams has requested enrollment in CS401.',
    link: '/students/student-1',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2', type: 'warning', read: false,
    title: 'Low Attendance Alert',
    message: '3 students have attendance below 70% this semester.',
    link: '/attendance',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: '3', type: 'success', read: false,
    title: 'Payment Received',
    message: 'Tuition payment of $2,400 received from Jordan Baker.',
    link: '/payments',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '4', type: 'error', read: true,
    title: 'System Maintenance',
    message: 'Scheduled maintenance tonight 2:00–4:00 AM.',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '5', type: 'info', read: true,
    title: 'Grade Submission Deadline',
    message: 'Final grades are due in 3 days.',
    link: '/grades',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
]

// ─── Mock Activities ───────────────────────────────────────────────────────
export const mockActivities: Activity[] = [
  {
    id: '1', type: 'student_enrolled',
    description: 'New student enrolled in Computer Science program',
    userId: 'user-1', userName: 'Admin', userAvatar: avatarUrl('admin'),
    entityType: 'student', entityId: 'student-1',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: '2', type: 'grade_submitted',
    description: 'Grades submitted for CS201 — Fall 2024',
    userId: 'teacher-1', userName: 'James Wilson', userAvatar: avatarUrl('teacher0'),
    entityType: 'course', entityId: 'course-2',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
]

// ─── Dashboard Stats ───────────────────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
  totalStudents: 1750,
  totalTeachers: 106,
  activeCourses: 48,
  totalRevenue: 284500,
  attendanceRate: 87.4,
  averageGpa: 3.24,
  newStudentsThisMonth: 42,
  revenueGrowth: 12.5,
  studentsGrowth: 8.3,
  coursesGrowth: 4.2,
}

// ─── Revenue Chart Data ────────────────────────────────────────────────────
export const mockRevenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [42000, 38000, 45000, 51000, 48000, 55000, 49000, 60000, 72000, 68000, 75000, 89000],
      backgroundColor: 'rgba(99,102,241,0.15)',
      borderColor: '#6366f1',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Expenses',
      data: [28000, 26000, 31000, 34000, 32000, 38000, 35000, 40000, 44000, 42000, 47000, 52000],
      backgroundColor: 'rgba(245,158,11,0.1)',
      borderColor: '#f59e0b',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    },
  ],
}

export const mockPerformanceData = {
  labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'],
  datasets: [{
    label: 'Students',
    data: [82, 210, 155, 198, 245, 180, 132, 98, 45, 22],
    backgroundColor: [
      'rgba(16,185,129,0.8)', 'rgba(20,184,166,0.8)', 'rgba(45,212,191,0.8)',
      'rgba(99,102,241,0.8)', 'rgba(129,140,248,0.8)', 'rgba(165,180,252,0.8)',
      'rgba(245,158,11,0.8)', 'rgba(251,191,36,0.8)',
      'rgba(239,68,68,0.8)', 'rgba(220,38,38,0.8)',
    ],
    borderWidth: 0,
  }],
}

export const mockAttendanceData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Present',
      data: [1620, 1580, 1695, 1540, 1720],
      backgroundColor: 'rgba(16,185,129,0.8)',
      borderRadius: 6,
    },
    {
      label: 'Absent',
      data: [130, 170, 55, 210, 30],
      backgroundColor: 'rgba(239,68,68,0.6)',
      borderRadius: 6,
    },
  ],
}

// ─── Upcoming Classes ──────────────────────────────────────────────────────
export const mockUpcomingClasses = [
  { id: '1', course: 'Data Structures & Algorithms', teacher: 'James Wilson', room: 'A201', time: '09:00 AM', duration: '1h 30m', enrolled: 42 },
  { id: '2', course: 'Calculus I', teacher: 'Sarah Chen', room: 'B104', time: '10:30 AM', duration: '1h 30m', enrolled: 58 },
]
