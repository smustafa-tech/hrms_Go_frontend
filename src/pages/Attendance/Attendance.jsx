import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
// import { Badge } from "@/components/ui/Badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import { useAuth } from "@/components/Context/AuthContext";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Clock, Download, Filter, CalendarDays, BarChart4 } from "lucide-react";
import { useEmployeeStore } from "@/store/employeeStore";
import AdminMarksAttendanceList from "@/features/Attendance/AdminMarksAttendanceList";
// --- Paste the rest of your Attendance.jsx code here as-is ---

// --- 1. Module CSS Simulation (Styles Object) ---
const styles = {
  // Global Layout
  dashboardContainer: {
    padding: "32px",
    minHeight: "100vh",
    backgroundColor: "#f9fafb", // gray-50
    display: "flex",
    flexDirection: "column",
    gap: "24px", // space-y-6
    fontFamily: "Inter, sans-serif",
  },

  // Header
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px", // rounded-xl
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // shadow-md
    flexWrap: "wrap",
    gap: "16px",
  },
  mainTitle: {
    fontSize: "30px", // text-3xl
    fontWeight: "800", // font-extrabold
    color: "#1f2937", // text-gray-900
  },
  subTitle: {
    color: "#6b7280", // text-muted-foreground
    fontSize: "14px", // text-sm
    // display: "flex",
    // justifyContent: "center",
  },

  // Buttons
  filterButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "white",
    border: "1px solid #a5b4fc", // border-indigo-300
    color: "#4f46e5", // text-indigo-700
    transition: "background-color 0.2s",
    borderRadius: "8px",
    padding: "8px 16px",
    fontWeight: "500",
  },
  exportButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#4f46e5", // bg-indigo-600
    color: "white",
    transition: "background-color 0.2s",
    borderRadius: "8px",
    padding: "8px 16px",
    fontWeight: "500",
    boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)", // shadow-lg shadow-indigo-200
  },

  // Stats Grid
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "24px", // gap-6
  },

  // Responsive adjustments for Stats Grid (simulated)
  "@media (min-width: 640px)": {
    statsGrid: { gridTemplateColumns: "repeat(2, 1fr)" }, // sm:grid-cols-2
  },
  "@media (min-width: 1024px)": {
    statsGrid: { gridTemplateColumns: "repeat(4, 1fr)" }, // lg:grid-cols-4
  },

  // Stats Cards
  baseCard: {
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)", // shadow-lg
    borderRadius: "8px",
    borderLeft: "4px solid",
    backgroundColor: "white",
  },
  cardGreen: { borderColor: "#10b981" }, // border-green-500
  cardRed: { borderColor: "#ef4444" }, // border-red-500
  cardBlue: { borderColor: "#3b82f6" }, // border-blue-500
  cardYellow: { borderColor: "#f59e0b" }, // border-yellow-500
  cardHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "8px",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "500",
  },
  cardContentValue: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#1f2937",
  },
  cardContentSub: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },

  // Tabs
  tabsList: {
    backgroundColor: "white",
    padding: "4px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    display: "flex",
    width: "fit-content",
  },
  tabTrigger: {
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.3s",
    fontWeight: "500",
    color: "#6b7280",
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
  },
  tabTriggerActive: {
    backgroundColor: "#f5b700", // bg-indigo-500
    color: "white",
    boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.3)",
  },

  // Table
  employeeName: {
    fontWeight: "500",
    cursor: "pointer",
    color: "#4f46e5", // text-indigo-600
    textDecoration: "underline",
    textUnderlineOffset: "4px",
    transition: "color 0.2s",
    // display: "flex",
    // justifyContent: "center",
  },

  // Badge Styling (used in getStatusBadge)
  badgeBase: {
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "500",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  },
  badgePresent: { backgroundColor: "#dcfce7", color: "#14532d" }, // green-100, green-800
  badgeAbsent: { backgroundColor: "#fee2e2", color: "#991b1b" }, // red-100, red-800
  badgeOnLeave: { backgroundColor: "#eff6ff", color: "#1e40af" }, // blue-100, blue-800
  badgeLate: { backgroundColor: "#fffbe3", color: "#854d0e" }, // yellow-100, yellow-800
  badgeWFH: { backgroundColor: "#f3e8ff", color: "#5b21b6" }, // purple-100, purple-800
  badgeWeekend: { backgroundColor: "#f3f4f6", color: "#4b5563" }, // gray-100, gray-600

  // Dialog/Modal
  dialogHeader: {
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "12px",
    marginBottom: "16px",
  },
  dialogTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#4f46e5",
  },
  dialogLegendContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "24px", // gap-x-6
    gapRow: "12px", // gap-y-3
    padding: "16px",
    backgroundColor: "#eef2ff", // indigo-50
    borderRadius: "12px",
    border: "1px solid #c7d2fe", // border-indigo-200
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  legendColor: {
    width: "16px",
    height: "16px",
    borderRadius: "2px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },

  // Calendar Grid
  calendarGridContainer: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },
  calendarDayHeaders: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    backgroundColor: "#f3f4f6", // gray-100
    borderBottom: "1px solid #e5e7eb",
  },
  calendarDayHeader: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: "14px",
    color: "#4b5563", // gray-700
    padding: "12px",
  },
  calendarDays: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
    padding: "8px",
  },
  calendarDayBase: {
    textAlign: "center",
    padding: "12px 6px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.15s",
    cursor: "default",
  },
};

// --- 2. Utility Functions ---

/**
 * Returns a styled Badge component based on attendance status.
 */
const getStatusBadge = (status) => {
  let badgeStyle = styles.badgeBase;
  let text = status;

  switch (status) {
    case "present":
      badgeStyle = { ...badgeStyle, ...styles.badgePresent };
      break;
    case "absent":
      badgeStyle = { ...badgeStyle, ...styles.badgeAbsent };
      break;
    case "on_leave":
      badgeStyle = { ...badgeStyle, ...styles.badgeOnLeave };
      break;
    case "late_arrivals":
      badgeStyle = { ...badgeStyle, ...styles.badgeLate };
      text = "Late";
      break;
    case "half_day":
      badgeStyle = { ...badgeStyle, ...styles.badgeWFH };
      break;
    case "Weekend":
      badgeStyle = { ...badgeStyle, ...styles.badgeWeekend };
      break;
    default:
      badgeStyle = {
        ...badgeStyle,
        backgroundColor: "#e5e7eb",
        color: "#4b5563",
      };
  }

  // NOTE: Using a simple <div> instead of the imported <Badge> component
  // since Badge component implementation is unknown and it might conflict with inline style.
  return <div style={badgeStyle}>{text}</div>;
};

/**
 * Returns style for coloring the calendar day cell.
 */
const getCalendarDayStyle = (status) => {
  let dayStyle = styles.calendarDayBase;
  let statusSpecificStyle = {};

  switch (status) {
    case "Present":
      statusSpecificStyle = {
        backgroundColor: "#10b981",
        color: "white",
        boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)",
      };
      break;
    case "Absent":
      statusSpecificStyle = {
        backgroundColor: "#ef4444",
        color: "white",
        boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.3)",
      };
      break;
    case "On Leave":
      statusSpecificStyle = {
        backgroundColor: "#3b82f6",
        color: "white",
        boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
      };
      break;
    case "Half Day":
      statusSpecificStyle = {
        backgroundColor: "#9333ea",
        color: "white",
        boxShadow: "0 4px 6px -1px rgba(147, 51, 234, 0.3)",
      };
      break;
    case "Late Arrived":
      statusSpecificStyle = {
        backgroundColor: "#f59e0b",
        color: "black",
        boxShadow: "0 4px 6px -1px rgba(245, 158, 11, 0.3)",
      };
      break;
    case "Weekend":
      statusSpecificStyle = { backgroundColor: "#e5e7eb", color: "#6b7280" };
      break;
    default:
      statusSpecificStyle = { backgroundColor: "#f9fafb", color: "#1f2937" };
  }

  return { ...dayStyle, ...statusSpecificStyle };
};

/**
 * Generates mock attendance data for the current month for the selected employee.
 */

// --- 3. Internal Components ---

// present days, absent today, etc cards
const StatCard = ({ title, value, subText, icon: Icon, colorClass }) => (
  <Card style={{ ...styles.baseCard, ...colorClass }}>
    <CardHeader style={styles.cardHeader}>
      <CardTitle style={styles.cardTitle}>{title}</CardTitle>
      <Icon className="h-4 w-4" style={{ color: colorClass.borderColor }} />
    </CardHeader>
    <CardContent>
      <div style={styles.cardContentValue}>{value}</div>
      <p style={styles.cardContentSub}>{subText}</p>
    </CardContent>
  </Card>
);

const DailyAttendanceTable = ({
  attendanceData = [],
  user,
  selectedDate,
  setSelectedDate,
  handleEmployeeClick,
}) => (
  <Card style={styles.baseCard}>
    <CardHeader
      style={{ ...styles.cardHeader, display: "flex", flexWrap: "wrap" }}
    >
      <div>
        <CardTitle>Today's Attendance Detail</CardTitle>
        <CardDescription>
          Real-time tracking for {new Date().toLocaleDateString()}
        </CardDescription>
      </div>
      <Input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="max-w-48 border-gray-300"
        style={{ maxWidth: "12rem", borderColor: "#d1d5db" }}
      />
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: "200px" }}>Employee</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData?.length > 0 ? (
            attendanceData.map((record) => (
              <TableRow key={record?.id}>
                <TableCell>
                  <div
                    style={styles.employeeName}
                    onClick={() =>
                      handleEmployeeClick(record?.Employee?.emp_id)
                    }
                  >
                    {record?.Employee?.firstName} {record?.Employee?.lastName}
                  </div>
                  <div style={styles.subTitle}>{record?.Employee?.emp_id}</div>
                </TableCell>
                <TableCell>{record?.Employee?.department}</TableCell>
                <TableCell>{record?.checkIn || "--"}</TableCell>
                <TableCell>{record?.checkOut || "--"}</TableCell>
                <TableCell>{getStatusBadge(record?.status)}</TableCell>
              </TableRow>
            ))
          ) : user?.role === "employee" ||
            (user?.role === "manager" && attendanceData) ? (
            <TableRow key={attendanceData?.id}>
              <TableCell>
                <div
                  style={styles.employeeName}
                  onClick={() =>
                    handleEmployeeClick(attendanceData?.Employee?.emp_id)
                  }
                >
                  {attendanceData?.Employee?.firstName}{" "}
                  {attendanceData?.Employee?.lastName}
                </div>
                <div style={styles.subTitle}>
                  {attendanceData?.Employee?.emp_id}
                </div>
              </TableCell>
              <TableCell>{attendanceData?.Employee?.department}</TableCell>
              <TableCell>{attendanceData?.checkIn || "--"}</TableCell>
              <TableCell>{attendanceData?.checkOut || "--"}</TableCell>
              <TableCell>{getStatusBadge(attendanceData?.status)}</TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={5} style={{ textAlign: "center" }}>
                No records for today
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const EmployeeCalendarDialog = ({
  isOpen,
  setIsOpen,
  selectedEmployee,
  attendanceCalendarData,
  attendanceCounts,
}) => {
  // Check if attendanceCounts is ready to render legend
  const isDataReady =
    attendanceCounts && Object.keys(attendanceCounts).length > 0;

  console.log("selectedEmployee from calender", selectedEmployee);
  console.log("attendanceCounts from calender", attendanceCounts);
  console.log("attendanceCalendarData from caledar", attendanceCalendarData);
  // Array of legend items for easy iteration
  const legendItems = [
    {
      status: "present",
      color: styles.cardGreen.borderColor,
      count: attendanceCounts["present"],
    },
    {
      status: "absent",
      color: styles.cardRed.borderColor,
      count: attendanceCounts["absent"],
    },
    {
      status: "half_day",
      color: styles.cardRed.borderColor,
      count: attendanceCounts["half_day"],
    },
    {
      status: "on_leave",
      color: styles.cardBlue.borderColor,
      count: attendanceCounts["on_leave"],
    },
    {
      status: "Late Arrived",
      color: styles.cardYellow.borderColor,
      count: attendanceCounts["late_arrived"],
    },
    { status: "Weekend", color: "#9ca3af", count: attendanceCounts["Weekend"] },
  ];

  const getAllDaysOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth + 1 }, (_, i) => {
      const dayDate = new Date(year, month, i + 1);
      return {
        date: dayDate.toISOString().split("T")[0], // YYYY-MM-DD
        day: i + 1,
        status: null, // default null, will fill if attendance exists
      };
    });
  };

  const calendarData = getAllDaysOfMonth(new Date()); // Sat Oct 11 2025 19:24:07 GMT+0530 (India Standard Time)

  attendanceCalendarData.forEach((att) => {
    const day = calendarData.find((d) => d.date === att.date);
    if (day) day.status = att.status;
  });

  // Calculate the padding required for the first day of the month
  const firstDayOfMonthIndex = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    0
  ).getDay();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl bg-white rounded-xl p-6 shadow-2xl">
        <DialogHeader style={styles.dialogHeader}>
          <DialogTitle style={styles.dialogTitle}>
            <CalendarDays className="h-6 w-6" />
            {selectedEmployee}'s Monthly Attendance
          </DialogTitle>
          <DialogDescription style={{ color: "#4b5563" }}>
            Visual breakdown of attendance status for the current month.
          </DialogDescription>
        </DialogHeader>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Legend */}
          {isDataReady && (
            <div style={styles.dialogLegendContainer}>
              <h3
                style={{ fontSize: "18px", fontWeight: "600", width: "100%" }}
              >
                Legend:
              </h3>
              {legendItems.map((item) => (
                <div key={item.status} style={styles.legendItem}>
                  <div
                    style={{
                      ...styles.legendColor,
                      backgroundColor: item.color,
                    }}
                  ></div>
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    {item.status} ({item.count || 0} days)
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Calendar Grid */}
          {selectedEmployee && (
            <div style={styles.calendarGridContainer}>
              {/* Day Headers */}
              <div style={styles.calendarDayHeaders}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} style={styles.calendarDayHeader}>
                      {day}
                    </div>
                  )
                )}
              </div>

              <div style={styles.calendarDays}>
                {/* Padding for first day */}
                {[...Array(firstDayOfMonthIndex)].map((_, i) => (
                  <div key={`empty-${i}`} style={{ padding: "12px" }}></div>
                ))}

                {/* All Attendance days */}
                {calendarData.map((dayData) => (
                  <div
                    key={dayData.date}
                    style={getCalendarDayStyle(dayData.status)}
                    title={`${dayData.date} - ${dayData.status}`}
                  >
                    {new Date(dayData.date).getDate()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- 4. Main Attendance Component ---

const Attendance = () => {
  const {
    allEmployeeAttendanceData,
    fetchAttendanceRecords,
    fetchEmployees,
    fetchEmployeeData,
    fetchMyAttendanceRecords,
    employeesData,
    loading,
    error,
  } = useEmployeeStore();
  // const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [tabValue, setTabValue] = useState("daily");

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);

  const [attendanceCalendarData, setAttendanceCalendarData] = useState([]);
  const [attendanceCounts, setAttendanceCounts] = useState({});

  const { user } = useAuth();
  // --- Mock Data (Kept the same) ---

  // const monthlyStats = [
  //   {
  //     employee: "John Doe",
  //     present: 22,
  //     absent: 0,
  //     late: 2,
  //     totalHours: "176:00",
  //   },
  //   {
  //     employee: "Jane Smith",
  //     present: 21,
  //     absent: 1,
  //     late: 1,
  //     totalHours: "168:00",
  //   },
  //   {
  //     employee: "Mike Johnson",
  //     present: 20,
  //     absent: 2,
  //     late: 0,
  //     totalHours: "160:00",
  //   },
  //   {
  //     employee: "Sarah Wilson",
  //     present: 22,
  //     absent: 0,
  //     late: 3,
  //     totalHours: "172:30",
  //   },
  // ];

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "hr") fetchEmployees();
    if (user?.role === "employee" || user?.role === "manager")
      fetchEmployeeData();
  }, [fetchEmployees, fetchEmployeeData, user?.role]);

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "hr") fetchAttendanceRecords();
    if (user?.role === "employee" || user?.role === "manager")
      fetchMyAttendanceRecords();
  }, [fetchAttendanceRecords, fetchMyAttendanceRecords, user?.role]);

  if (loading) return <p>Loading attendance data...</p>;
  if (error) return <p>Error: {error}</p>;

  const {
    todayPresentRecords = [],
    todayAbsentRecords = [],
    todayOnLeaveRecords = [],
    todayHalfDayRecords = [],
    lateArrivals = [],
    todayRecords = [],
    employeeMonthlySummary = [],
    employeeData = [],
    // attendanceRecords = [],
  } = allEmployeeAttendanceData || {};

  // console.log(
  //   "today Records",
  //   todayRecords?.map((rec) => rec.Employee)
  // );

  // --- Handlers ---

  console.log("from attendance emp data", employeeData);

  const handleEmployeeClick = (employeeId) => {
    // Suppose you have monthly data keyed by employee name
    const employeeAttendance = employeeMonthlySummary[employeeId] || [];

    if (!employeeAttendance) return;

    console.log("from attendance", employeeAttendance);

    const monthlyData = employeeAttendance.monthlyData;

    // Get the current month in YYYY-MM format
    const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2025-10"

    console.log("monthly data from ", monthlyData[currentMonth]);
    // Extract current month data
    const counts = monthlyData[currentMonth] || {
      present: 0,
      absent: 0,
      on_leave: 0,
      half_day: 0,
      late_arrived: 0,
    };

    setAttendanceCalendarData(employeeAttendance.dailyData || []);
    setAttendanceCounts(counts);
    setSelectedEmployee(employeeId);
    setIsEmployeeDialogOpen(true);
  };

  // // Prepare data for the dialog
  // const employeeData = selectedEmployee
  //   ? generateEmployeeAttendanceData(selectedEmployee)
  //   : { data: [], counts: {} };
  // const attendanceCalendarData = employeeData.data;
  // const attendanceCounts = employeeData.counts;

  return (
    <div style={styles.dashboardContainer}>
      {/* --- Main Header --- */}
      <div style={styles.headerContainer}>
        <div>
          <h1 style={styles.mainTitle}>Attendance Management Dashboard</h1>
          <p style={styles.subTitle}>
            Track employee attendance and working hours efficiently.
          </p>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      {user.role === "admin" || user.role === "hr" ? (
        <div style={styles.statsGrid}>
          <StatCard
            title="Present Today"
            value={todayPresentRecords?.length || 0}
            // subText="94.7% attendance rate"
            icon={Clock}
            colorClass={styles.cardGreen}
          />
          <StatCard
            title="Absent Today"
            value={todayAbsentRecords?.length || 0}
            // subText="3.2% of workforce"
            icon={Clock}
            colorClass={styles.cardRed}
          />
          <StatCard
            title="On Leave"
            value={todayOnLeaveRecords?.length || 0}
            // subText="2.0% on approved leave"
            icon={CalendarDays}
            colorClass={styles.cardBlue}
          />
          <StatCard
            title="Half Day"
            value={todayHalfDayRecords?.length || 0}
            // subText="4.9% arrived late"
            icon={Clock}
            colorClass={styles.cardYellow}
          />
          <StatCard
            title="Late Arrivals"
            value={lateArrivals?.length || 0}
            // subText="4.9% arrived late"
            icon={Clock}
            colorClass={styles.cardBlue}
          />
        </div>
      ) : null}

      {/* --- Tabs View --- */}
      <Tabs value={tabValue} onValueChange={setTabValue} className="space-y-4">
        <TabsList style={styles.tabsList}>
          <TabsTrigger
            value="daily"
            style={{
              ...styles.tabTrigger,
              ...(tabValue === "daily" ? styles.tabTriggerActive : {}),
            }}
          >
            Daily Attendance
          </TabsTrigger>
          <TabsTrigger
            value="markAttendance"
            style={{
              ...styles.tabTrigger,
              ...(tabValue === "markAttendance" ? styles.tabTriggerActive : {}),
            }}
          >
            Mark Attendance
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="daily"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <DailyAttendanceTable
            attendanceData={todayRecords}
            user={user}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handleEmployeeClick={handleEmployeeClick}
          />
        </TabsContent>

        <TabsContent
          value="markAttendance"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {user.role === "admin" || user.role === "hr" ? (
            <AdminMarksAttendanceList
              employeeData={employeesData?.totalEmployees}
              user={user}
            />
          ) : (
            <AdminMarksAttendanceList
              employeeData={employeeData?.employeeData}
              user={user}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* --- Employee Attendance Calendar Dialog (Modal) --- */}
      <EmployeeCalendarDialog
        isOpen={isEmployeeDialogOpen}
        setIsOpen={setIsEmployeeDialogOpen}
        selectedEmployee={selectedEmployee}
        attendanceCalendarData={attendanceCalendarData}
        attendanceCounts={attendanceCounts}
      />
    </div>
  );
};

export default Attendance;
