import React, { useState, useEffect } from "react";
import {
  Plus,
  CheckCircle,
  CircleX,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { useAuth } from "@/components/Context/AuthContext";
import LeaveRequest from "@/features/Leaves/LeaveRequest";
import LeaveBalance from "@/features/Leaves/LeaveBalance";
import LeaveForm from "@/features/Leaves/LeaveForm";
import LeaveHistory from "@/features/Leaves/LeaveHistory";

import { useLeaveStore } from "@/store/leaveStore";

import styles from "./Leaves.module.css";

const Leaves = () => {
  const [openForm, setOpenForm] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [activeTab, setActiveTab] = useState("requests");

  const { user } = useAuth();

  const {
    fetchAllLeaves,
    leaveData,
    fetchAllLeaveBalance,
    fetchLeavesByEmployee,
    fetchMyLeaveBalance,
  } = useLeaveStore();
  const { totalLeavesData, allLeaveBalances, MyLeaveData, myLeaveBalances } =
    leaveData;

  useEffect(() => {
    if (user) fetchAllLeaves(user);
    if (user) fetchLeavesByEmployee(user);
    if (user) fetchAllLeaveBalance(user);
    if (user?.role === "employee" || user?.role === "manager")
      fetchMyLeaveBalance(user);
  }, [
    fetchAllLeaves,
    fetchAllLeaveBalance,
    fetchLeavesByEmployee,
    fetchMyLeaveBalance,
    user,
  ]);

  // const companyCalendar = [
  //   { date: "2025-10-02", name: "Gandhi Jayanti", type: "Holiday" },
  //   { date: "2025-10-12", name: "Dussehra", type: "Holiday" },
  //   { date: "2025-10-31", name: "Diwali", type: "Holiday" },
  // ];

  // 🎯 Card click logic
  const handleCardClick = (type) => {
    if (type === "Pending") {
      setDialogData({
        title: "Pending Leave Requests",
        data: totalLeavesData.filter((r) => r.status === "PENDING"),
      });
    } else if (type === "Approved") {
      setDialogData({
        title: "Approved Leave Requests",
        data: totalLeavesData.filter((r) => r.status === "APPROVED"),
      });
    } else if (type === "Rejected") {
      setDialogData({
        title: "Rejected Leave Requests",
        data: totalLeavesData.filter((r) => r.status === "REJECTED"),
      });
    } else if (type === "ThisMonth") {
      // 👇 instead of modal, open the Leave Calendar tab
      setActiveTab("calendar");
    }
  };

  return (
    <div className={styles.leavesContainer}>
      {/* Header */}
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>Leave Management</h2>
        <Button variant="primary" onClick={() => setOpenForm(true)}>
          <Plus size={16} /> New Leave
        </Button>
      </div>

      {/* Overview Cards */}
      <div className={styles.overviewGrid}>
        {user.role === "admin" || user.role === "hr" ? (
          <>
            <OverviewCard
              title="Approved"
              value={
                totalLeavesData.filter((r) => r.status === "APPROVED").length
              }
              status="Approved"
              icon={CheckCircle}
              infoText="Approved requests"
              onClick={() => handleCardClick("Approved")}
            />
            <OverviewCard
              title="Pending"
              value={
                totalLeavesData.filter((r) => r.status === "PENDING").length
              }
              status="Pending"
              icon={Clock}
              infoText="Awaiting approval"
              onClick={() => handleCardClick("Pending")}
            />

            <OverviewCard
              title="Rejected"
              value={
                totalLeavesData.filter((r) => r.status === "REJECTED").length
              }
              status="Rejected"
              icon={CircleX}
              infoText="Rejected requests"
              onClick={() => handleCardClick("Rejected")}
            />
            <OverviewCard
              title="This Month"
              value={totalLeavesData.length}
              status="ThisMonth"
              icon={CalendarIcon}
              infoText="Leaves & Holidays"
              onClick={() => handleCardClick("ThisMonth")}
            />
          </>
        ) : (
          <>
            <OverviewCard
              title="Approved"
              value={MyLeaveData.filter((r) => r.status === "APPROVED").length}
              status="Approved"
              icon={CheckCircle}
              infoText="Approved requests"
              onClick={() => handleCardClick("Approved")}
            />
            <OverviewCard
              title="Pending"
              value={MyLeaveData.filter((r) => r.status === "PENDING").length}
              status="Pending"
              icon={Clock}
              infoText="Awaiting approval"
              onClick={() => handleCardClick("Pending")}
            />

            <OverviewCard
              title="Rejected"
              value={MyLeaveData.filter((r) => r.status === "REJECTED").length}
              status="Rejected"
              icon={CircleX}
              infoText="Rejected requests"
              onClick={() => handleCardClick("Rejected")}
            />
            <OverviewCard
              title="This Month"
              value={MyLeaveData.length}
              status="ThisMonth"
              icon={CalendarIcon}
              infoText="Leaves & Holidays"
              onClick={() => handleCardClick("ThisMonth")}
            />
          </>
        )}
      </div>

      {/* Tabs Section */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className={styles.tabs}
      >
        <TabsList className={styles.tabList}>
          <TabsTrigger
            className={`${styles.tabTrigger} ${
              activeTab === "requests" ? styles.tabTriggerActive : ""
            }`}
            value="requests"
          >
            Requests
          </TabsTrigger>
          <TabsTrigger
            className={`${styles.tabTrigger} ${
              activeTab === "balance" ? styles.tabTriggerActive : ""
            }`}
            value="balance"
          >
            Balance
          </TabsTrigger>
          {/* <TabsTrigger
            className={`${styles.tabTrigger} ${
              activeTab === "calendar" ? styles.tabTriggerActive : ""
            }`}
            value="calendar"
          >
            Calendar
          </TabsTrigger> */}
          <TabsTrigger
            className={`${styles.tabTrigger} ${
              activeTab === "history" ? styles.tabTriggerActive : ""
            }`}
            value="history"
          >
            History
          </TabsTrigger>
        </TabsList>

        {user.role === "admin" || user.role === "hr" ? (
          <TabsContent value="requests" className={styles.tabContent}>
            <LeaveRequest requests={totalLeavesData} user={user} />
          </TabsContent>
        ) : (
          <TabsContent value="requests" className={styles.tabContent}>
            <LeaveRequest requests={MyLeaveData} user={user} />
          </TabsContent>
        )}

        {user.role === "admin" || user.role === "hr" ? (
          <TabsContent value="balance" className={styles.tabContent}>
            <LeaveBalance balances={allLeaveBalances} />
          </TabsContent>
        ) : (
          <TabsContent value="balance" className={styles.tabContent}>
            <LeaveBalance balances={myLeaveBalances} />
          </TabsContent>
        )}

        {/* <TabsContent value="calendar">
          <LeaveCalendar calendar={companyCalendar} styles={styles} />
        </TabsContent> */}

        {user.role === "admin" || user.role === "hr" ? (
          <TabsContent value="history">
            <LeaveHistory history={totalLeavesData} />
          </TabsContent>
        ) : (
          <TabsContent value="history">
            <LeaveHistory history={MyLeaveData} />
          </TabsContent>
        )}
      </Tabs>

      {/* Leave Form Dialog */}
      <LeaveForm open={openForm} onClose={() => setOpenForm(false)} />

      {/* Overview Card Modal */}
      {dialogData && (
        <CardDialog
          title={dialogData.title}
          data={dialogData.data}
          onClose={() => setDialogData(null)}
        />
      )}
    </div>
  );
};

/* --------------------------- OverviewCard --------------------------- */

const OverviewCard = ({
  title,
  value,
  status,
  icon: Icon,
  onClick,
  titleClasses = {
    Pending: styles.iconPending,
    Approved: styles.iconApproved,
    Rejected: styles.iconRejected,
    ThisMonth: styles.iconThisMonth,
  },
}) => (
  <Card
    className={styles.overviewCard}
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <CardHeader className={styles.cardHeader}>
      <CardTitle className={styles.overviewCardTitle}>
        <Icon className={`${titleClasses[status] || ""}`} size={18} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className={styles.cardContent}>
      <div className={styles.cardInfo}>
        <div>
          <h3 className={styles.cardValue}>{value}</h3>
        </div>
      </div>
    </CardContent>
  </Card>
);

/* --------------------------- Card Dialog --------------------------- */
const CardDialog = ({ title, data, onClose }) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Days</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {item.applicant.Employee.firstName || "-"}{" "}
                  {item.applicant.Employee.lastName || "-"}
                </TableCell>
                <TableCell>{item.leaveType || "-"}</TableCell>
                <TableCell>{item.startDate || "-"}</TableCell>
                <TableCell>{item.endDate || "-"}</TableCell>
                <TableCell>{item.reason || "-"}</TableCell>
                <TableCell>{item.totalDays || "-"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                style={{ textAlign: "center", padding: "1rem" }}
              >
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DialogContent>
  </Dialog>
);

export default Leaves;
