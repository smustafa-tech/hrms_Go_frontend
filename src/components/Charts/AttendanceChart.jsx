import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./Chart.module.css";

// const data = [
//   { day: "Mon", present: 80 },
//   { day: "Tue", present: 95 },
//   { day: "Wed", present: 70 },
//   { day: "Thu", present: 85 },
//   { day: "Fri", present: 90 },
// ];

const AttendanceLineChart = (attendanceData = {}) => {
  const allAttendanceData = attendanceData?.attendanceData || [];


  // Function to get past 5 days dynamically
  const getPastFiveDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const pastDays = [];

    // Get past 5 days (excluding today)
    for (let i = 7; i > 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      pastDays.push({
        day: days[date.getDay()],
        present: getPresentCountForDate(date.toISOString().split("T")[0]),
      });
    }
    return pastDays;
  };

  // Helper function to find attendance count for a given date
  const getPresentCountForDate = (date) => {
    const day = Object.entries(allAttendanceData).map(
      (entry) => entry[1]?.dailyData?.filter((record) => record.date === date)[0]
    );
    return day ? day.filter((item) => item?.status === "Present").length : 0;
  };

  const data = getPastFiveDays();
  return (
    <div className={styles.chartCard}>
      <h3>Attendance Trend</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="present"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceLineChart;
