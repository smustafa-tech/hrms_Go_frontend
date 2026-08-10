import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Badge } from "@/components/ui/Badge";

import styles from "./LeaveHistory.module.css";

export default function LeaveHistory({ history = [] }) {
  const [filter, setFilter] = useState("");

  const leaveHistory = history.filter(
    (r) => r.status === "APPROVED" || r.status === "REJECTED"
  );

  const filteredLeaves = (leaveHistory || []).filter((emp) => {
    const searchTerm = filter.toLowerCase().trim();
    return (
      (emp.applicant.Employee.firstName || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (emp.applicant.Employee.lastName || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (emp.applicant.Employee.email || "").toLowerCase().includes(searchTerm) ||
      (emp.leaveType || "").toLowerCase().includes(searchTerm) ||
      (emp.status || "").toLowerCase().includes(searchTerm)
    );
  });

  return (
    <Card className={styles.leaveCard}>
      <CardHeader>
        <CardTitle> Leave History</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Search */}
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <Input
            placeholder="Search employees..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <ScrollArea className={styles.scrollArea}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Total Days</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      {r.applicant?.Employee?.firstName.toUpperCase() || "-"}{" "}
                      {r.applicant?.Employee?.lastName.toUpperCase() || "-"}
                      <p>{r.applicant?.Employee?.email || "-"}</p>
                    </TableCell>
                    <TableCell>{r.leaveType.toUpperCase() || "-"}</TableCell>
                    <TableCell>
                      {r.startDate || "-"} → {r.endDate || "-"}
                    </TableCell>
                    <TableCell>{r.totalDays || "-"}</TableCell>
                    <TableCell>
                      {r.status == "APPROVED" ? (
                        <Badge variant="positive">
                          {r.status.toUpperCase()}
                        </Badge>
                      ) : r.status == "REJECTED" ? (
                        <Badge variant="destructive">
                          {r.status.toUpperCase()}
                        </Badge>
                      ) : (
                        <Badge variant="warning">{r.status}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key="no-data">
                  <TableCell colSpan="4" className={styles.noData}>
                    No leave requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
