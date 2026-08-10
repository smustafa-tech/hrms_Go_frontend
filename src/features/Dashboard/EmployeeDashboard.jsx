import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Calendar,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  Users,
  PlayCircle,
  StopCircle,
  LogIn,
  Coffee,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../components/Context/AuthContext";
import { useEmployeeStore } from "@/store/employeeStore";
import api from "@/Services/api";
import styles from "./Dashboard.module.css";

export default function EmployeeDashboard() {
  const [workedTimeLive, setWorkedTimeLive] = useState("0h 0m");
  const [breakTimeLive, setBreakTimeLive] = useState("0h 0m");
  const [isOnBreak, setIsOnBreak] = useState(false);
  const { user } = useAuth();
  const { fetchMyAttendanceRecords, allEmployeeAttendanceData, markAttendance } =
    useEmployeeStore();
  
  useEffect(() => {
    fetchMyAttendanceRecords();
  }, [fetchMyAttendanceRecords]);

  const { todayRecords } = allEmployeeAttendanceData;

  const clockInRecord = todayRecords?.checkIn;
  const breakStart = todayRecords?.breakStart;
  const breakEnd = todayRecords?.breakEnd;
  const totalBreakTime = todayRecords?.totalBreakTime || 0;
  const hasCheckedIn = !!clockInRecord;
  const officeStartTime = "09:30:00";

  // Check if currently on break (breakStart exists but breakEnd doesn't)
  useEffect(() => {
    if (breakStart && !breakEnd) {
      setIsOnBreak(true);
    } else {
      setIsOnBreak(false);
    }
  }, [breakStart, breakEnd]);

  // Convert 24hr to 12hr format with AM/PM
  function convertTo12Hour(time24) {
    if (!time24) return "--";
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  function calculateLateTime(officeTime, checkInTime) {
    if (!checkInTime) return "--";

    // Convert both times into Date objects for comparison
    const [oh, om, os] = officeTime.split(":").map(Number);
    const [ch, cm, cs] = checkInTime.split(":").map(Number);

    const officeDate = new Date();
    officeDate.setHours(oh, om, os);

    const checkInDate = new Date();
    checkInDate.setHours(ch, cm, cs);

    const diffMs = checkInDate - officeDate;

    // If not late
    if (diffMs <= 0) return "On Time";

    // Convert to hours and minutes
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    return hours > 0
      ? `${hours} hr ${minutes} min late`
      : `${minutes} min late`;
  }

  const lateTime = calculateLateTime(officeStartTime, clockInRecord);

  // Calculate worked hours from check-in (excluding break time)
  function calculateWorkedHours() {
    if (!clockInRecord) return "0h 0m";

    const [ch, cm, cs] = clockInRecord.split(":").map(Number);
    const checkInDate = new Date();
    checkInDate.setHours(ch, cm, cs, 0);

    const now = new Date();
    let totalWorkMs = now - checkInDate;

    // Subtract total break time
    if (totalBreakTime > 0) {
      totalWorkMs -= totalBreakTime * 60000;
    }

    // Subtract current break time if on break
    if (isOnBreak && breakStart) {
      const [bh, bm, bs] = breakStart.split(":").map(Number);
      const breakStartDate = new Date();
      breakStartDate.setHours(bh, bm, bs, 0);
      const currentBreakMs = now - breakStartDate;
      totalWorkMs -= currentBreakMs;
    }

    if (totalWorkMs <= 0) return "0h 0m";

    const totalWorkMins = Math.floor(totalWorkMs / 60000);
    const hours = Math.floor(totalWorkMins / 60);
    const minutes = totalWorkMins % 60;

    return `${hours}h ${minutes}m`;
  }

  // Calculate break time
  function calculateBreakTime() {
    // If currently on break, add current break duration to total
    if (isOnBreak && breakStart) {
      const [bh, bm, bs] = breakStart.split(":").map(Number);
      const breakStartDate = new Date();
      breakStartDate.setHours(bh, bm, bs, 0);

      const now = new Date();
      const currentBreakMs = now - breakStartDate;
      const currentBreakMins = Math.floor(currentBreakMs / 60000);
      
      const totalMins = totalBreakTime + currentBreakMins;
      const hours = Math.floor(totalMins / 60);
      const minutes = totalMins % 60;

      return `${hours}h ${minutes}m`;
    }
    
    // If not on break, show total accumulated break time
    if (totalBreakTime > 0) {
      const hours = Math.floor(totalBreakTime / 60);
      const minutes = totalBreakTime % 60;
      return `${hours}h ${minutes}m`;
    }
    
    return "0h 0m";
  }

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (clockInRecord) {
        setWorkedTimeLive(calculateWorkedHours());
      }
      setBreakTimeLive(calculateBreakTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [clockInRecord, breakStart, isOnBreak, totalBreakTime]);

  const todayStats = [
    {
      title: "Check In Time",
      value: clockInRecord ? convertTo12Hour(clockInRecord) : "--",
      change: lateTime,
      changeType: lateTime === "On Time" ? "positive" : "warning",
      icon: Clock,
    },
    {
      title: "Hours Worked",
      value: workedTimeLive,
      change: "",
      changeType: "neutral",
      icon: Target,
    },
    {
      title: "Break Time",
      value: breakTimeLive,
      change: "",
      changeType: "neutral",
      icon: Coffee,
    },
  ];

  const handleAttendanceAction = async (action) => {
    const userId = user?.id || user?.emp_id || user?.userId;
    if (!userId) {
      alert("User ID not found");
      return;
    }
    
    try {
      if (action === 'startBreak' || action === 'endBreak') {
        const attendanceId = todayRecords?.id;
        if (!attendanceId) {
          alert('Please check in first');
          return;
        }
        
        if (action === 'endBreak') {
          const res = await api.post('/attendance/end-break', { attendanceId });
          if (res.status === 200 || res.status === 201) {
            setIsOnBreak(false);
            await fetchMyAttendanceRecords();
            alert('Break ended successfully!');
          }
        } else {
          const res = await api.post('/attendance/start-break', { attendanceId });
          if (res.status === 200 || res.status === 201) {
            setIsOnBreak(true);
            await fetchMyAttendanceRecords();
            alert('Break started successfully!');
          }
        }
      } else {
        await markAttendance(userId, "present", user, action);
        const actionName = action === 'checkIn' ? 'Check In' : 'Check Out';
        alert(`${actionName} marked successfully!`);
        await fetchMyAttendanceRecords();
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      const errorMsg = error.response?.data?.message || "Failed to mark attendance. Please try again.";
      alert(errorMsg);
    }
  };

  const attendanceActions = [
    {
      title: "Check In",
      desc: "Mark your arrival",
      icon: LogIn,
      action: "checkIn",
      color: "#10b981",
      disabled: hasCheckedIn,
    },
    {
      title: "Start Break",
      desc: "Take a break",
      icon: Coffee,
      action: "startBreak",
      color: "#f59e0b",
      disabled: !hasCheckedIn || isOnBreak,
    },
    {
      title: "End Break",
      desc: "Resume work",
      icon: Coffee,
      action: "endBreak",
      color: "#3b82f6",
      disabled: !hasCheckedIn || !isOnBreak,
    },
    {
      title: "Check Out",
      desc: "End your day",
      icon: LogOut,
      action: "checkOut",
      color: "#ef4444",
      disabled: !hasCheckedIn,
    },
  ];

  const quickActions = [
    {
      title: "Request Leave",
      desc: "Apply for time off",
      icon: Calendar,
      href: "/leaves",
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            Welcome back, {todayRecords?.Employee?.firstName} {todayRecords?.Employee?.lastName}!
          </h1>
          <p className={styles.subtitle}>
            Here's what's happening with your work today
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {todayStats.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statTitle}>{stat.title}</div>
              <stat.icon className={styles.statIcon} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stat.value}</div>
              <p className={styles.statChange}>
                <span
                  className={
                    stat.changeType === "positive"
                      ? styles.statChangePositive
                      : stat.changeType === "warning"
                      ? styles.statChangeWarning
                      : stat.changeType === "negative"
                      ? styles.statChangeNegative
                      : styles.statChange
                  }
                >
                  {stat.change}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>Quick Actions</div>
          <div className={styles.cardDescription}>
            Common tasks and shortcuts
          </div>
        </div>
        <div className={styles.cardContent}>
          {/* Attendance Actions */}
          <div className={styles.quickActions}>
            {attendanceActions.map((action) => (
              <button
                key={action.title}
                onClick={() => handleAttendanceAction(action.action)}
                className={styles.actionButton}
                style={{ borderLeft: `4px solid ${action.color}` }}
                disabled={action.disabled}
              >
                <action.icon className={styles.actionIcon} style={{ color: action.color }} />
                <div className={styles.actionText}>
                  <p className={styles.actionTitle}>{action.title}</p>
                  <p className={styles.actionDescription}>{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
          
          {/* Other Quick Actions */}
          <div className={styles.quickActions} style={{ marginTop: "1rem" }}>
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.href}
                className={styles.actionButton}
              >
                <action.icon className={styles.actionIcon} />
                <div className={styles.actionText}>
                  <p className={styles.actionTitle}>{action.title}</p>
                  <p className={styles.actionDescription}>{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
