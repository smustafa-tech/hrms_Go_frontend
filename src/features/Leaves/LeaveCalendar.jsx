import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import styles from "../../pages/leaves/Leaves.module.css";

const LeaveCalendar = ({
  country = "IN",
  year = new Date().getFullYear(),
  stylesProp,
}) => {
  const stylesUsed = stylesProp || styles;

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
  const [error, setError] = useState(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fetch holidays from Calendarific
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch(
          `https://calendarific.com/api/v2/holidays?&api_key=YOUR_API_KEY&country=${country}&year=${year}`
        );
        if (!res.ok) throw new Error("API request failed");
        const data = await res.json();
        setHolidays(data.response.holidays || []);
      } catch (err) {
        console.error("Failed to fetch holidays:", err);
        setError("Failed to load holidays");
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [country, year]);

  const daysInMonth = (month) => new Date(year, month + 1, 0).getDate();

  //   const isHoliday = (dateStr) =>
  //     holidays?.some((h) => h.date?.iso === dateStr);

  const handlePrevMonth = () =>
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));

  const handleNextMonth = () =>
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));

  return (
    <Card className={stylesUsed.calendarCard}>
      <CardHeader className={stylesUsed.calendarHeader}>
        <Button onClick={handlePrevMonth} variant="outline">
          ◀
        </Button>
        <CardTitle>
          {monthNames[currentMonth]} {year}
        </CardTitle>
        <Button onClick={handleNextMonth} variant="outline">
          ▶
        </Button>
      </CardHeader>
      <CardContent className={stylesUsed.calendarContent}>
        {loading && <p>Loading holidays...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <div className={stylesUsed.calendarGrid}>
            {[...Array(daysInMonth(currentMonth))].map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(currentMonth + 1).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;
              const holiday = holidays.find((h) => h.date.iso === dateStr);

              return (
                <div
                  key={day}
                  className={`${stylesUsed.calendarDay} ${
                    [0, 6].includes(new Date(year, currentMonth, day).getDay())
                      ? stylesUsed.weekend
                      : ""
                  }`}
                >
                  <span>{day}</span>
                  {holiday && <Badge variant="secondary">{holiday.name}</Badge>}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <div className={stylesUsed.calendarLegend}>
        <div>
          <Badge variant="destructive">Holiday</Badge> Holiday
        </div>
        <div>
          <Badge variant="outline">Weekend</Badge> Weekend
        </div>
      </div>
    </Card>
  );
};

export default LeaveCalendar;
