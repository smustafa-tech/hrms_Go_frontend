import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- Module CSS Simulation (Styles Object) ---
const styles = {
  // Main Container
  calendarContainer: {
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    maxWidth: "400px",
    margin: "20px auto",
    fontFamily: "Inter, sans-serif",
    border: "1px solid #e5e7eb",
  },

  // Header
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  monthTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    flexGrow: 1,
  },
  navButton: {
    backgroundColor: "transparent",
    border: "none",
    padding: "8px",
    borderRadius: "50%",
    cursor: "pointer",
    color: "#4f46e5", // Indigo-600
    transition: "background-color 0.2s, transform 0.1s",
  },
  navButtonHover: {
    backgroundColor: "#eef2ff", // Indigo-50
  },

  // Days of the Week Header
  daysHeader: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    marginBottom: "8px",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "14px",
    color: "#6b7280", // Gray-500
  },

  // Date Grid
  dateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "4px",
  },

  // Day Cells
  dayCell: {
    height: "40px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "500",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.15s, color 0.15s",
    userSelect: "none",
  },
  dayCellHover: {
    backgroundColor: "#f3f4f6", // Gray-100
  },

  // States
  inactiveMonth: {
    color: "#9ca3af", // Gray-400
    cursor: "default",
  },
  today: {
    backgroundColor: "#f0fdf4", // Green-50
    border: "2px solid #10b981", // Green-500
    color: "#10b981",
    fontWeight: "700",
  },
  selected: {
    backgroundColor: "#4f46e5", // Indigo-600
    color: "white",
    fontWeight: "700",
    boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.4)",
  },
  weekend: {
    color: "#ef4444", // Red-500
  },
};

/**
 * Utility function to get the full month name.
 * @param {number} monthIndex - 0-indexed month (0=Jan, 11=Dec)
 * @returns {string} The full month name.
 */
const getMonthName = (monthIndex) => {
  const date = new Date(2000, monthIndex, 1);
  return date.toLocaleString("en-US", { month: "long" });
};

/**
 * Calendar Component
 * This is a reusable, self-contained component for date navigation and selection.
 * It does not take props but uses internal state for the date tracking.
 */
const Calendar = () => {
  // currentDate determines which month/year is currently displayed
  const [currentDate, setCurrentDate] = useState(new Date());
  // selectedDate is the date the user clicks on
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Use state to track hover for visual feedback on buttons
  const [hoverState, setHoverState] = useState({ prev: false, next: false });

  // Get date information for the currently viewed month
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const totalCalendarDays = 42; // 6 rows * 7 days
  const startDay = 1 - firstDayOfMonth; // Day of the month to start the loop

  // Helper to check if a date matches today's date
  const isToday = (date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  // Helper to check if a date matches the selected date
  const isSelected = (date) =>
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear();

  // --- Navigation Handlers ---
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (dayDate) => {
    setSelectedDate(dayDate);
  };

  // --- Render Days ---
  const renderDays = () => {
    const days = [];

    for (let i = 0; i < totalCalendarDays; i++) {
      const dayIndex = startDay + i;
      const dayDate = new Date(year, month, dayIndex);

      const dayOfMonth = dayDate.getDate();
      const dayOfWeek = dayDate.getDay(); // 0 (Sun) to 6 (Sat)
      const isCurrentMonth = dayDate.getMonth() === month;

      // Determine CSS styles based on date properties
      let cellStyle = styles.dayCell;

      if (!isCurrentMonth) {
        cellStyle = { ...cellStyle, ...styles.inactiveMonth };
      } else {
        // Active month days can be hovered/selected
        // NOTE: React inline styles don't support :hover pseudo-class, this is a conceptual placeholder.
      }

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        cellStyle = { ...cellStyle, ...styles.weekend };
      }

      if (isToday(dayDate) && isCurrentMonth) {
        cellStyle = { ...cellStyle, ...styles.today };
      }

      if (isSelected(dayDate) && isCurrentMonth) {
        // Selected style overrides today's highlight for the selected day
        cellStyle = { ...cellStyle, ...styles.selected, border: "none" };
      }

      // Handle the onClick only for active month days
      const clickHandler = isCurrentMonth
        ? () => handleDateClick(dayDate)
        : undefined;

      days.push(
        <div
          key={i}
          style={cellStyle}
          onClick={clickHandler}
          title={dayDate.toDateString()}
        >
          {dayOfMonth}
        </div>
      );
    }

    return days;
  };

  return (
    <div style={styles.calendarContainer}>
      {/* Calendar Header: Month and Navigation */}
      <div style={styles.header}>
        <button
          style={{
            ...styles.navButton,
            ...(hoverState.prev ? styles.navButtonHover : {}),
          }}
          onClick={goToPrevMonth}
          onMouseEnter={() => setHoverState({ ...hoverState, prev: true })}
          onMouseLeave={() => setHoverState({ ...hoverState, prev: false })}
        >
          <ChevronLeft size={20} />
        </button>

        <div style={styles.monthTitle}>
          {getMonthName(month)} {year}
        </div>

        <button
          style={{
            ...styles.navButton,
            ...(hoverState.next ? styles.navButtonHover : {}),
          }}
          onClick={goToNextMonth}
          onMouseEnter={() => setHoverState({ ...hoverState, next: true })}
          onMouseLeave={() => setHoverState({ ...hoverState, next: false })}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Days of the Week */}
      <div style={styles.daysHeader}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Date Grid */}
      <div style={styles.dateGrid}>{renderDays()}</div>

      {/* Footer/Selection Info */}
      <div
        style={{
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "14px", color: "#4f46e5", fontWeight: "600" }}>
          Selected Date:{" "}
          {selectedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
          Click a date to select it.
        </p>
      </div>
    </div>
  );
};

export default Calendar;
