import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

interface StudentProfile {
  name: string;
  class: string;
  section: string;
  rollNo: number;
  admissionId: string;
  avatar: string;
}

interface ClassSchedule {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  period: number;
  isCurrent?: boolean;
}

interface Homework {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
}

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface AcademicSubject {
  name: string;
  code: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

const Header: React.FC<{ profile: StudentProfile }> = ({ profile }) => {
  const firstName = profile.name.split(' ')[0];
  return (
    <header className="rounded-b-[2rem] bg-gradient-to-br from-primary to-primary/80 px-5 pb-16 pt-10 text-primary-foreground">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-primary-foreground/80">Good morning 👋</p>
          <h1 className="mt-1 text-3xl font-heading font-bold">{firstName}</h1>
          <p className="mt-1 text-sm text-primary-foreground/80">Ready for another productive day?</p>
        </div>
        <div className="relative">
          <img
            className="h-14 w-14 rounded-full border-4 border-card object-cover shadow-md"
            src={profile.avatar}
            alt={profile.name}
          />
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-accent animate-ping"></span>
        </div>
      </div>
    </header>
  );
};

const StudentCard: React.FC<{ profile: StudentProfile }> = ({ profile }) => {
  return (
    <section className="rounded-xl bg-card p-5 shadow-md border border-border/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-heading font-bold text-foreground">{profile.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.class} • Section {profile.section} • Roll No. {profile.rollNo}
          </p>
        </div>
        <span className="rounded-lg bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
          {profile.admissionId}
        </span>
      </div>
    </section>
  );
};

const TodayAtAGlance: React.FC<{
  attendancePercentage: number;
  pendingHomeworkCount: number;
  feesDueAmount: string;
  feesDueDate: string;
  onTabChange: (tab: string) => void;
}> = ({ attendancePercentage, pendingHomeworkCount, feesDueAmount, feesDueDate, onTabChange }) => {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-foreground">Today at a glance</h2>
        <span className="text-sm font-semibold text-primary flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-tertiary animate-pulse"></span> Live
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => onTabChange('attendance')}
          className="rounded-xl bg-card p-4 shadow-sm border border-border/40 cursor-pointer hover:border-primary/30 transition-all"
        >
          <p className="text-xs font-semibold text-muted-foreground">ATTENDANCE</p>
          <p className="mt-2 text-2xl font-heading font-bold text-tertiary">{attendancePercentage}%</p>
          <p className="text-xs text-muted-foreground">This term</p>
        </div>

        <div
          onClick={() => onTabChange('homework')}
          className="rounded-xl bg-card p-4 shadow-sm border border-border/40 cursor-pointer hover:border-primary/30 transition-all"
        >
          <p className="text-xs font-semibold text-muted-foreground">HOMEWORK</p>
          <p className="mt-2 text-2xl font-heading font-bold text-foreground">{pendingHomeworkCount}</p>
          <p className="text-xs text-muted-foreground">Pending tasks</p>
        </div>

        <div
          onClick={() => onTabChange('fees')}
          className="rounded-xl bg-card p-4 shadow-sm border border-border/40 cursor-pointer hover:border-primary/30 transition-all"
        >
          <p className="text-xs font-semibold text-muted-foreground">FEES</p>
          <p className="mt-2 text-2xl font-heading font-bold text-foreground">{feesDueAmount}</p>
          <p className="text-xs text-muted-foreground">Due {feesDueDate}</p>
        </div>

        <div
          onClick={() => onTabChange('timetable')}
          className="rounded-xl bg-accent p-4 cursor-pointer hover:opacity-95 transition-all"
        >
          <p className="text-xs font-semibold text-accent-foreground">NEXT CLASS</p>
          <p className="mt-2 text-lg font-heading font-bold text-foreground">Mathematics</p>
          <p className="text-xs text-muted-foreground">09:30 AM</p>
        </div>
      </div>
    </section>
  );
};

const QuickAccess: React.FC<{ onTabChange: (tab: string) => void }> = ({ onTabChange }) => {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-foreground">Quick access</h2>
        <button onClick={() => onTabChange('academics')} className="text-sm font-semibold text-primary">
          See all
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onTabChange('timetable')}
          className="rounded-xl bg-secondary p-3 text-center hover:opacity-90 transition-all flex flex-col items-center justify-center"
        >
          <Icon icon="lucide:calendar" className="text-2xl text-primary" />
          <p className="mt-2 text-xs font-semibold text-foreground">Timetable</p>
        </button>
        <button
          onClick={() => onTabChange('homework')}
          className="rounded-xl bg-accent p-3 text-center hover:opacity-90 transition-all flex flex-col items-center justify-center"
        >
          <Icon icon="lucide:book-open" className="text-2xl text-accent-foreground" />
          <p className="mt-2 text-xs font-semibold text-foreground">Homework</p>
        </button>
        <button
          onClick={() => onTabChange('exams')}
          className="rounded-xl bg-muted p-3 text-center hover:opacity-90 transition-all flex flex-col items-center justify-center"
        >
          <Icon icon="lucide:award" className="text-2xl text-primary" />
          <p className="mt-2 text-xs font-semibold text-foreground">Exams</p>
        </button>
      </div>
    </section>
  );
};

const TodayClasses: React.FC<{
  classes: ClassSchedule[];
  onTabChange: (tab: string) => void;
}> = ({ classes, onTabChange }) => {
  const currentClass = classes.find((c) => c.isCurrent) || classes[0];

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-foreground">Today's classes</h2>
        <button onClick={() => onTabChange('timetable')} className="text-sm font-semibold text-primary">
          View schedule
        </button>
      </div>
      <div
        onClick={() => onTabChange('timetable')}
        className="rounded-xl border border-border bg-card p-4 shadow-sm cursor-pointer hover:border-primary/30 transition-all"
      >
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-primary">{currentClass.time}</span>
            <span className="mt-2 h-2 w-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="h-10 w-px bg-border"></span>
          </div>
          <div>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
              NOW
            </span>
            <h3 className="mt-2 text-base font-heading font-bold text-foreground">
              {currentClass.subject}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentClass.teacher} • {currentClass.room} • Period {currentClass.period}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const HomeworkSummary: React.FC<{
  homeworkList: Homework[];
  onTabChange: (tab: string) => void;
  onToggleStatus: (id: string) => void;
}> = ({ homeworkList, onTabChange, onToggleStatus }) => {
  const pendingHomework = homeworkList.filter((h) => h.status === 'Pending');

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-foreground">Homework</h2>
        <button onClick={() => onTabChange('homework')} className="text-sm font-semibold text-primary">
          View all
        </button>
      </div>
      {pendingHomework.length > 0 ? (
        <div className="space-y-3">
          {pendingHomework.slice(0, 2).map((hw) => (
            <div
              key={hw.id}
              className="rounded-xl bg-card p-4 shadow-sm border border-border/40 flex items-center justify-between hover:border-primary/20 transition-all"
            >
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon icon="lucide:calculator" className="text-xl" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{hw.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {hw.subject} • Due {hw.dueDate}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(hw.id);
                }}
                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-accent/80 transition-all"
              >
                Complete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-card p-6 text-center border border-dashed border-border">
          <Icon icon="lucide:check-circle" className="text-3xl text-tertiary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">All caught up!</p>
          <p className="text-xs text-muted-foreground">No pending homework assignments.</p>
        </div>
      )}
    </section>
  );
};

const BottomNavigation: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', icon: 'lucide:house', label: 'Home' },
    { id: 'academics', icon: 'lucide:book-open', label: 'Academics' },
    { id: 'attendance', icon: 'lucide:activity', label: 'Attendance' },
    { id: 'fees', icon: 'lucide:credit-card', label: 'Fees' },
    { id: 'profile', icon: 'lucide:user', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-5 left-4 right-4 flex items-center justify-around rounded-2xl bg-card px-2 py-3 shadow-lg border border-border/50 z-50">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center transition-all ${
              isActive ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon icon={item.icon} className="text-xl" />
            <span className="mt-1 text-[10px] font-bold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const StudentDashboardScreen: React.FC = () => {
  // State variables
  const [activeTab, setActiveTab] = useState<string>('home');
  const [studentProfile] = useState<StudentProfile>({
    name: 'Jay Shankar',
    class: 'Class 10',
    section: 'A',
    rollNo: 12,
    admissionId: 'ADM-1024',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const [attendancePercentage, setAttendancePercentage] = useState<number>(88);
  const [feesDueAmount, setFeesDueAmount] = useState<string>('₹2,500');
  const [feesDueDate] = useState<string>('Sep 10');

  const [todayClasses] = useState<ClassSchedule[]>([
    {
      time: '09:00',
      subject: 'Mathematics',
      teacher: 'Mr. Sharma',
      room: 'Room 203',
      period: 2,
      isCurrent: true,
    },
    {
      time: '10:30',
      subject: 'Science',
      teacher: 'Mrs. Verma',
      room: 'Lab 2',
      period: 3,
    },
    {
      time: '11:45',
      subject: 'English Literature',
      teacher: 'Ms. Davis',
      room: 'Room 101',
      period: 4,
    },
  ]);

  const [homeworkList, setHomeworkList] = useState<Homework[]>([
    {
      id: 'hw-1',
      title: 'Chapter 6 Exercise',
      subject: 'Mathematics',
      dueDate: 'tomorrow',
      status: 'Pending',
    },
    {
      id: 'hw-2',
      title: 'Photosynthesis Lab Report',
      subject: 'Science',
      dueDate: 'in 2 days',
      status: 'Pending',
    },
    {
      id: 'hw-3',
      title: 'Essay on Shakespeare',
      subject: 'English',
      dueDate: 'Sep 12',
      status: 'Pending',
    },
  ]);

  // Additional interactive states
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'lr-1',
      startDate: '2023-09-15',
      endDate: '2023-09-16',
      reason: 'Family function',
      status: 'Approved',
    },
  ]);
  const [newLeave, setNewLeave] = useState({ startDate: '', endDate: '', reason: '' });
  const [leaveSuccess, setLeaveSuccess] = useState<boolean>(false);
  const [showAddHomework, setShowAddHomework] = useState<boolean>(false);
  const [newHomework, setNewHomework] = useState({ title: '', subject: '', dueDate: '' });

  // Derived state
  const pendingHomeworkCount = homeworkList.filter((h) => h.status === 'Pending').length;

  // Event Handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleHomeworkStatus = (id: string) => {
    setHomeworkList((prev) =>
      prev.map((hw) => (hw.id === id ? { ...hw, status: hw.status === 'Pending' ? 'Completed' : 'Pending' } : hw))
    );
  };

  const handlePayFees = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      setFeesDueAmount('₹0');
    }, 1500);
  };

  const handleRequestLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) return;

    const request: LeaveRequest = {
      id: `lr-${Date.now()}`,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      reason: newLeave.reason,
      status: 'Pending',
    };

    setLeaveRequests([request, ...leaveRequests]);
    setNewLeave({ startDate: '', endDate: '', reason: '' });
    setLeaveSuccess(true);
    setTimeout(() => setLeaveSuccess(false), 3000);
  };

  const handleAddHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHomework.title || !newHomework.subject || !newHomework.dueDate) return;

    const hw: Homework = {
      id: `hw-${Date.now()}`,
      title: newHomework.title,
      subject: newHomework.subject,
      dueDate: newHomework.dueDate,
      status: 'Pending',
    };

    setHomeworkList([hw, ...homeworkList]);
    setNewHomework({ title: '', subject: '', dueDate: '' });
    setShowAddHomework(false);
  };

  // Academic data
  const academicSubjects: AcademicSubject[] = [
    { name: 'Mathematics', code: 'MAT-10', marksObtained: 92, maxMarks: 100, grade: 'A+' },
    { name: 'Science', code: 'SCI-10', marksObtained: 88, maxMarks: 100, grade: 'A' },
    { name: 'English Literature', code: 'ENG-10', marksObtained: 85, maxMarks: 100, grade: 'A' },
    { name: 'Social Studies', code: 'SST-10', marksObtained: 78, maxMarks: 100, grade: 'B+' },
    { name: 'Computer Applications', code: 'COMP-10', marksObtained: 95, maxMarks: 100, grade: 'O' },
  ];

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative pb-28">
      {/* Injecting Custom CSS Variables & Utility Classes */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --background: #F7F7FB;
          --foreground: #15213B;
          --primary: #4355D8;
          --primary-foreground: #FFFFFF;
          --secondary: #EEF0FF;
          --secondary-foreground: #27327C;
          --tertiary: #2BAA7B;
          --muted: #EFF1F6;
          --muted-foreground: #606F88;
          --accent: #FFF2DE;
          --accent-foreground: #7D4B0A;
          --card: #FFFFFF;
          --card-foreground: #15213B;
          --destructive: #DC4C5A;
          --border: #E5E8F0;
          --input: #D8DDEA;
          --ring: #4355D8;
          --radius: 1.25rem;
          --font-sans: Inter,sans-serif;
          --font-heading: Inter,sans-serif;
          --font-mono: JetBrains Mono, monospace;
          --tertiary-foreground: #302F2F;
          --destructive-foreground: #161616;
          --primary-text: #4355D8;
          --secondary-text: #70717F;
          --tertiary-text: #008256;
          --accent-text: #7C705F;
          --destructive-text: #CC3D4E;
        }
        .text-primary { color: var(--primary-text, var(--primary)); }
        .text-secondary { color: var(--secondary-text, var(--secondary)); }
        .text-tertiary { color: var(--tertiary-text, var(--tertiary)); }
        .text-accent { color: var(--accent-text, var(--accent)); }
        .text-destructive { color: var(--destructive-text, var(--destructive)); }
      `}} />

      {/* HEADER */}
      <Header profile={studentProfile} />

      {/* MAIN CONTENT CONTAINER */}
      <main className="-mt-10 space-y-6 px-5 z-10">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            <StudentCard profile={studentProfile} />
            <TodayAtAGlance
              attendancePercentage={attendancePercentage}
              pendingHomeworkCount={pendingHomeworkCount}
              feesDueAmount={feesDueAmount}
              feesDueDate={feesDueDate}
              onTabChange={handleTabChange}
            />
            <QuickAccess onTabChange={handleTabChange} />
            <TodayClasses classes={todayClasses} onTabChange={handleTabChange} />
            <HomeworkSummary
              homeworkList={homeworkList}
              onTabChange={handleTabChange}
              onToggleStatus={handleToggleHomeworkStatus}
            />
          </>
        )}

        {/* ACADEMICS TAB */}
        {activeTab === 'academics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-foreground">Academic Performance</h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                CGPA: 8.9
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-card p-4 border border-border/50 shadow-sm">
                <p className="text-xs text-muted-foreground">CLASS RANK</p>
                <p className="text-2xl font-bold text-primary mt-1">4th / 42</p>
              </div>
              <div className="rounded-xl bg-card p-4 border border-border/50 shadow-sm">
                <p className="text-xs text-muted-foreground">TOTAL MARKS</p>
                <p className="text-2xl font-bold text-tertiary mt-1">438 / 500</p>
              </div>
            </div>

            <div className="rounded-xl bg-card p-5 border border-border/50 shadow-sm space-y-4">
              <h3 className="font-heading font-semibold text-foreground">Subject-wise Grades</h3>
              <div className="space-y-3">
                {academicSubjects.map((subject) => (
                  <div key={subject.code} className="flex items-center justify-between border-b border-border/30 pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-foreground">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">{subject.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{subject.marksObtained}/{subject.maxMarks}</p>
                      <span className="inline-block rounded bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
                        {subject.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-foreground">Attendance Tracker</h2>
              <span className="rounded-full bg-tertiary/10 px-3 py-1 text-xs font-bold text-tertiary">
                Good Standing
              </span>
            </div>

            <div className="rounded-xl bg-card p-6 border border-border/50 shadow-sm flex items-center justify-around">
              <div className="relative flex items-center justify-center h-28 w-28">
                <svg className="absolute transform -rotate-90 w-full h-full">
                  <circle cx="56" cy="56" r="48" stroke="var(--border)" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="var(--tertiary)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - attendancePercentage / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-2xl font-bold text-foreground">{attendancePercentage}%</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-tertiary"></span>
                  <span className="text-sm text-muted-foreground">Attended: 88 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-destructive"></span>
                  <span className="text-sm text-muted-foreground">Absent: 12 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-accent"></span>
                  <span className="text-sm text-muted-foreground">Total: 100 days</span>
                </div>
              </div>
            </div>

            {/* Leave Request Form */}
            <div className="rounded-xl bg-card p-5 border border-border/50 shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-4">Apply for Leave</h3>
              {leaveSuccess && (
                <div className="mb-4 rounded-lg bg-tertiary/10 p-3 text-sm text-tertiary font-medium flex items-center gap-2">
                  <Icon icon="lucide:check-circle" /> Leave request submitted successfully!
                </div>
              )}
              <form onSubmit={handleRequestLeave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Start Date</label>
                    <input
                      type="date"
                      required
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">End Date</label>
                    <input
                      type="date"
                      required
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Reason</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="State the reason for leave..."
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  Submit Request
                </button>
              </form>
            </div>

            {/* Leave History */}
            <div className="rounded-xl bg-card p-5 border border-border/50 shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-3">Leave History</h3>
              <div className="space-y-3">
                {leaveRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between border-b border-border/30 pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-foreground">{req.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {req.startDate} to {req.endDate}
                      </p>
                    </div>
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        req.status === 'Approved'
                          ? 'bg-tertiary/10 text-tertiary'
                          : req.status === 'Pending'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEES TAB */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-bold text-foreground">Fee Details</h2>

            <div className="rounded-xl bg-card p-6 border border-border/50 shadow-sm text-center">
              <p className="text-sm text-muted-foreground">Outstanding Balance</p>
              <p className="text-4xl font-heading font-bold text-foreground mt-2">{feesDueAmount}</p>
              {feesDueAmount !== '₹0' ? (
                <p className="text-xs text-destructive font-semibold mt-1">Due Date: {feesDueDate}</p>
              ) : (
                <p className="text-xs text-tertiary font-semibold mt-1">All dues cleared!</p>
              )}

              {feesDueAmount !== '₹0' && (
                <button
                  onClick={handlePayFees}
                  disabled={isPaying}
                  className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  {isPaying ? (
                    <>
                      <Icon icon="lucide:loader-2" className="animate-spin text-lg" /> Processing...
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              )}
            </div>

            {paymentSuccess && (
              <div className="rounded-xl bg-tertiary/10 p-4 text-center border border-tertiary/20">
                <Icon icon="lucide:check-circle" className="text-3xl text-tertiary mx-auto mb-2" />
                <p className="text-sm font-bold text-foreground">Payment Successful!</p>
                <p className="text-xs text-muted-foreground">Thank you. Your receipt has been sent to your registered email.</p>
              </div>
            )}

            <div className="rounded-xl bg-card p-5 border border-border/50 shadow-sm">
              <h3 className="font-heading font-semibold text-foreground mb-3">Payment History</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">Term 1 Tuition Fee</p>
                    <p className="text-xs text-muted-foreground">Paid on Aug 12, 2023</p>
                  </div>
                  <span className="text-sm font-bold text-tertiary">₹15,000</span>
                </div>
                <div className="flex items-center justify-between border-b border-border/30 pb-2">
                  <div>
                    <p className="text-sm font-bold text-foreground">Lab & Library Fee</p>
                    <p className="text-xs text-muted-foreground">Paid on Jul 05, 2023</p>
                  </div>
                  <span className="text-sm font-bold text-tertiary">₹3,500</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <img
                className="h-24 w-24 rounded-full border-4 border-card object-cover shadow-md"
                src={studentProfile.avatar}
                alt={studentProfile.name}
              />
              <h2 className="mt-3 text-xl font-heading font-bold text-foreground">{studentProfile.name}</h2>
              <p className="text-sm text-muted-foreground">{studentProfile.class} • Section {studentProfile.section}</p>
            </div>

            <div className="rounded-xl bg-card p-5 border border-border/50 shadow-sm space-y-4">
              <h3 className="font-heading font-semibold text-foreground border-b border-border/30 pb-2">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Admission ID</p>
                  <p className="text-sm font-bold text-foreground">{studentProfile.admissionId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Roll Number</p>
                  <p className="text-sm font-bold text-foreground">{studentProfile.rollNo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm font-bold text-foreground">Oct 14, 2008</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Blood Group</p>
                  <p className="text-sm font-bold text-foreground">O+</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-card p-5 border border-border/50 shadow-sm space-y-4">
              <h3 className="font-heading font-semibold text-foreground border-b border-border/30 pb-2">Parent Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Father's Name</p>
                  <p className="text-sm font-bold text-foreground">Ravi Shankar</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Mother's Name</p>
                  <p className="text-sm font-bold text-foreground">Sita Shankar</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Emergency Contact</p>
                  <p className="text-sm font-bold text-foreground">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TIMETABLE TAB */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-foreground">Weekly Timetable</h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                Mon - Fri
              </span>
            </div>

            <div className="space-y-4">
              {todayClasses.map((cls, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 border shadow-sm transition-all ${
                    cls.isCurrent
                      ? 'bg-accent border-accent-foreground/20'
                      : 'bg-card border-border/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-primary">{cls.time}</span>
                      <h3 className="text-base font-heading font-bold text-foreground mt-1">
                        {cls.subject}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {cls.teacher} • {cls.room}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-md bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                        Period {cls.period}
                      </span>
                      {cls.isCurrent && (
                        <span className="block mt-2 text-xs font-bold text-tertiary animate-pulse">
                          ● Active Now
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOMEWORK TAB */}
        {activeTab === 'homework' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-foreground">All Homework</h2>
              <button
                onClick={() => setShowAddHomework(true)}
                className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1"
              >
                <Icon icon="lucide:plus" /> Add Task
              </button>
            </div>

            {/* Add Homework Modal/Form */}
            {showAddHomework && (
              <div className="rounded-xl bg-card p-5 border border-primary/30 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-heading font-semibold text-foreground">Add New Homework</h3>
                  <button onClick={() => setShowAddHomework(false)} className="text-muted-foreground hover:text-foreground">
                    <Icon icon="lucide:x" className="text-lg" />
                  </button>
                </div>
                <form onSubmit={handleAddHomework} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Chapter 6 Exercise"
                      value={newHomework.title}
                      onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Subject</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Mathematics"
                        value={newHomework.subject}
                        onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground">Due Date</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., tomorrow"
                        value={newHomework.dueDate}
                        onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    Add Homework
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {homeworkList.map((hw) => (
                <div
                  key={hw.id}
                  className="rounded-xl bg-card p-4 shadow-sm border border-border/40 flex items-center justify-between hover:border-primary/20 transition-all"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Icon icon="lucide:calculator" className="text-xl" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold text-foreground ${hw.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}>
                        {hw.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {hw.subject} • Due {hw.dueDate}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleHomeworkStatus(hw.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      hw.status === 'Completed'
                        ? 'bg-tertiary/10 text-tertiary'
                        : 'bg-accent text-accent-foreground hover:bg-accent/80'
                    }`}
                  >
                    {hw.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXAMS TAB */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-foreground">Upcoming Exams</h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                Term 2
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-card p-4 border border-border/50 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-destructive">SEP 18, 09:00 AM</span>
                    <h3 className="text-base font-heading font-bold text-foreground mt-1">
                      Mathematics Theory
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Syllabus: Chapters 1 to 6
                    </p>
                  </div>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                    100 Marks
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-card p-4 border border-border/50 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-destructive">SEP 20, 09:00 AM</span>
                    <h3 className="text-base font-heading font-bold text-foreground mt-1">
                      Physics & Chemistry
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Syllabus: Light, Electricity, Carbon Compounds
                    </p>
                  </div>
                  <span className="rounded-md bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                    100 Marks
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default StudentDashboardScreen;