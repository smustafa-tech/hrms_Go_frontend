import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
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
import { Button } from "@/components/ui/Button";
import { useLeaveStore } from "@/store/leaveStore";
import styles from "./LeaveRequest.module.css";

const LeaveRequest = ({ requests = [], user = [] }) => {
  const { fetchAllLeaves, approveLeave } = useLeaveStore();

  const pendingLists = requests.filter((r) => r.status === "PENDING");

  const handleActionClick = (leaveId, status) => {
    approveLeave(leaveId, status);
    fetchAllLeaves();
  };

  return (
    <Card className={styles.leaveCard}>
      <CardHeader>
        <CardTitle>Leave Requests</CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className={styles.scrollArea}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Total Days</TableHead>
                <TableHead>Status</TableHead>
                {user.role === "admin" || user.role === "hr" ? (
                  <TableHead>Action</TableHead>
                ) : null}
              </TableRow>
            </TableHeader>

            <TableBody>
              {pendingLists.length > 0 ? (
                pendingLists.map((r) => (
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
                    {user.role === "admin" || user.role === "hr" ? (
                      <TableCell>
                        {r.status == "PENDING" ? (
                          <>
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleActionClick(r.id, "APPROVED")
                              }
                            >
                              Approve
                            </Button>{" "}
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleActionClick(r.id, "REJECTED")
                              }
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          "--"
                        )}
                      </TableCell>
                    ) : null}
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
};

export default LeaveRequest;
