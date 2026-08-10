import React, { useEffect, useState } from "react";
import { Trash, Edit, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useEmployeeStore } from "@/store/employeeStore";
import styles from "./AdminMarksAttendanceList.module.css";

const AdminMarksAttendanceList = ({ employeeData, user }) => {
  console.log("from admin attendance employeeData", employeeData);
  const [filter, setFilter] = useState("");
  const { markAttendance, allEmployeeAttendanceData } = useEmployeeStore();
  const { todayRecords } = allEmployeeAttendanceData || {};

  console.log("from today recordd", todayRecords);
  const handleMarkAttendance = (empId, status, user, action) => {
    markAttendance(empId, status, user, action);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredEmployees = (employeeData ?? []).filter((emp) => {
    const searchTerm = filter.toLowerCase().trim();
    return (
      (emp?.firstName || "").toLowerCase().includes(searchTerm) ||
      (emp?.lastName || "").toLowerCase().includes(searchTerm) ||
      (emp?.emp_id || "").toLowerCase().includes(searchTerm) ||
      (emp?.designation || "").toLowerCase().includes(searchTerm) ||
      (emp?.department || "").toLowerCase().includes(searchTerm) ||
      (emp?.workMode || "").toLowerCase().includes(searchTerm) ||
      (emp?.status || "").toLowerCase().includes(searchTerm)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  const employees = currentEmployees;

  const style = {
    badgeBase: {
      padding: "4px 10px",
      borderRadius: "9999px",
      fontSize: "12px",
      fontWeight: "500",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
    },
    badgePresent: { backgroundColor: "#dcfce7", color: "#14532d" },
    badgeAbsent: { backgroundColor: "#fee2e2", color: "#991b1b" },
    baseCard: { height: "auto" },
  };

  const getStatusById = (userId) => {
    const status =
      todayRecords?.status ||
      todayRecords?.find((r) => r.userId === userId)?.status ||
      "N/A";
    return status;
  };

  const getStatusBadge = (status) => {
    let badgeStyle = style.badgeBase;
    let text = status;
    switch (status) {
      case "active":
        badgeStyle = { ...badgeStyle, ...style.badgePresent };
        break;
      case "inactive":
        badgeStyle = { ...badgeStyle, ...style.badgeAbsent };
        break;
      default:
        badgeStyle = {
          ...badgeStyle,
          backgroundColor: "#e5e7eb",
          color: "#4b5563",
        };
    }

    return <div style={badgeStyle}>{text}</div>;
  };

  return (
    <Card style={style.baseCard}>
      <CardHeader
        style={{ ...styles.cardHeader, display: "flex", flexWrap: "wrap" }}
      >
        <div>
          <CardTitle>Mark Employee Attendance</CardTitle>
          <CardDescription>
            Mark Attendance - {new Date().toLocaleDateString()}
          </CardDescription>
        </div>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <Input
            placeholder="Search employees..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {employees?.length > 0 &&
            (user.role === "admin" || user.role === "hr") ? (
              <TableRow>
                <TableHead style={{ width: "200px" }}>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Work Mode</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>On Leave</TableHead>
              </TableRow>
            ) : (
              <TableRow>
                <TableHead style={{ width: "200px" }}>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Work Mode</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>At.Status</TableHead>
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {employees?.length > 0 &&
            (user.role === "admin" || user.role === "hr") ? (
              employees.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div style={styles.employeeName}>
                      {record?.firstName?.toUpperCase()}{" "}
                      {record?.lastName?.toUpperCase()}
                    </div>
                    <div style={styles.subTitle}>{record?.emp_id}</div>
                  </TableCell>
                  <TableCell>{record?.department?.toUpperCase() || 'N/A'}</TableCell>
                  <TableCell>{record?.designation?.toUpperCase() || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(record?.status)}</TableCell>
                  <TableCell>{record?.workMode?.toUpperCase() || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant={
                        getStatusById(record.id) === "present"
                          ? "primary"
                          : "outline"
                      }
                      onClick={() =>
                        handleMarkAttendance(record.id, "present", user)
                      }
                    >
                      Present
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={
                        getStatusById(record.id) === "absent"
                          ? "primary"
                          : "outline"
                      }
                      onClick={() =>
                        handleMarkAttendance(record.id, "absent", user)
                      }
                    >
                      Absent
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={
                        getStatusById(record.id) === "on_leave"
                          ? "primary"
                          : "outline"
                      }
                      onClick={() =>
                        handleMarkAttendance(record.id, "on_leave", user)
                      }
                    >
                      On Leave
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getStatusById(record.id) === "present"
                          ? "positive"
                          : getStatusById(record.id) === "absent"
                          ? "destructive"
                          : "warning"
                      }
                    >
                      {getStatusById(record.id)?.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : user.role === "employee" || user.role === "manager" ? (
              employees.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div style={styles.employeeName}>
                      {record?.firstName?.toUpperCase()}{" "}
                      {record?.lastName?.toUpperCase()}
                    </div>
                    <div style={styles.subTitle}>{record?.emp_id}</div>
                  </TableCell>
                  <TableCell>{record?.department?.toUpperCase() || 'N/A'}</TableCell>
                  <TableCell>{record?.designation?.toUpperCase() || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(record?.status)}</TableCell>
                  <TableCell>{record?.workMode?.toUpperCase() || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      variant={
                        getStatusById(record.id) === "absent" ||
                        getStatusById(record.id) === "on_leave" ||
                        getStatusById(record.id) === "present" ||
                        getStatusById(record.id) === "late_arrived"
                          ? "disabled"
                          : "primary"
                      }
                      onClick={() =>
                        handleMarkAttendance(
                          record.id,
                          "present",
                          user
                        )
                      }
                    >
                      Check In
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={
                        getStatusById(record.id) === "present" ||
                        getStatusById(record.id) === "late_arrived" ||
                        getStatusById(record.id) === "half_day"
                          ? "primary"
                          : "disabled"
                      }
                      onClick={() =>
                        handleMarkAttendance(record.id, "absent", user)
                      }
                    >
                      Check Out
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getStatusById(record.id) === "present"
                          ? "positive"
                          : getStatusById(record.id) === "absent"
                          ? "destructive"
                          : getStatusById(record.id) === "half_day"
                          ? "default"
                          : "warning"
                      }
                    >
                      {getStatusById(record.id)?.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>No records for today</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1rem",
            gap: "0.5rem",
          }}
        >
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="primary"
          >
            Previous
          </Button>

          <span style={{ fontSize: "14px" }}>
            Page {currentPage} of {totalPages || 1}
          </span>

          <Button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages === 0 ? 1 : totalPages)
              )
            }
            disabled={currentPage === totalPages || totalPages === 0}
            variant="primary"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminMarksAttendanceList;
