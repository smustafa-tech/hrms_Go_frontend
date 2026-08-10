import React, { useState, useEffect } from "react";
import {
  Plus,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  Shield,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";

import { useAuth } from "@/components/Context/AuthContext";
// Imported Feature Components
import PayrollList from "@/features/Payroll/PayrollList";
import PayrollGenerationForm from "@/features/Payroll/PayrollGenerationForm";
import PayrollSummary from "@/features/Payroll/PayrollSummary";
import PayrollHistory from "@/features/Payroll/PayrollHistory";

// Updated store import
import { usePayrollStore } from "@/store/PayrollStore.js";

import styles from "./Payroll.module.css";

const OverviewCard = ({ title, value, status, icon: Icon, infoText }) => (
  <Card className={styles.overviewCard}>
    <CardHeader className={styles.cardHeader}>
      <CardTitle className={styles.overviewCardTitle}>
        <Icon size={18} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className={styles.cardContent}>
      <div className={styles.cardInfo}>
        <h3 className={styles.cardValue}>{value}</h3>
        {infoText && <p className={styles.overviewCardInfo}>{infoText}</p>}
      </div>
    </CardContent>
  </Card>
);

const Payroll = () => {
  const [openForm, setOpenForm] = useState(false);
  const [editPayroll, setEditPayroll] = useState(null);
  const [activeTab, setActiveTab] = useState("payrolls");

  const { user } = useAuth();

  // Updated store functions
  const {
    fetchAllPayrolls,
    fetchMyPayrolls,
    fetchPayrollSummary,
    payrollData,
    loading,
  } = usePayrollStore();

  const {
    allPayrolls,
    myPayrolls,
    summary,
  } = payrollData;

  // Auto-fetch data on component mount based on user role
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "hr" || user?.role === "manager") {
      fetchPayrollSummary(user);
      fetchAllPayrolls(user);
      setActiveTab("payrolls");
    } else if (user?.role === "employee") {
      fetchMyPayrolls(user);
      setActiveTab("history");
    }
  }, [user, fetchMyPayrolls, fetchPayrollSummary, fetchAllPayrolls]);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
    
    // Fetch data only when tab is clicked
    if (value === "payrolls" && (user?.role === "admin" || user?.role === "hr" || user?.role === "manager")) {
      fetchAllPayrolls(user);
    } else if (value === "summary" && (user?.role === "admin" || user?.role === "hr" || user?.role === "manager")) {
      fetchPayrollSummary(user);
    } else if (value === "history") {
      if (user?.role === "admin" || user?.role === "hr" || user?.role === "manager") {
        // Admin/HR/Manager can see all payroll history
        fetchAllPayrolls(user);
      } else {
        // Employee sees only their payrolls
        fetchMyPayrolls(user);
      }
    }
  };

  const handleRefresh = () => {
    // Refresh data based on current active tab and user role
    if (activeTab === "payrolls" && (user?.role === "admin" || user?.role === "hr" || user?.role === "manager")) {
      fetchAllPayrolls(user);
    } else if (activeTab === "summary" && (user?.role === "admin" || user?.role === "hr" || user?.role === "manager")) {
      fetchPayrollSummary(user);
    } else if (activeTab === "history") {
      if (user?.role === "admin" || user?.role === "hr" || user?.role === "manager") {
        fetchAllPayrolls(user);
      } else {
        fetchMyPayrolls(user);
      }
    }
    
    // Always refresh summary for overview cards if admin/hr/manager
    if (user?.role === "admin" || user?.role === "hr" || user?.role === "manager") {
      fetchPayrollSummary(user);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  // Helper to show content or loading state
  const renderContent = (content) =>
    loading ? (
      <p className="text-center py-8">Loading payroll data...</p>
    ) : (
      content
    );

  return (
    <div className={styles.payrollContainer}>
      {/* Refresh Button - Sticky */}
      <button 
        onClick={handleRefresh}
        className={styles.refreshButton}
        disabled={loading}
        title="Refresh Payroll Data"
      >
        <RefreshCw size={20} className={loading ? styles.spinning : ''} />
      </button>

      {/* Header */}
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>
          {user?.role === "employee" ? "My Payrolls" : "Payroll Management"}
        </h2>
        {(user?.role === "admin" || user?.role === "hr" || user?.role === "manager") && (
          <Button variant="primary" onClick={() => {
            setEditPayroll(null);
            setOpenForm(true);
          }}>
            <Plus size={16} /> Create Payroll
          </Button>
        )}
      </div>

      {/* Overview Cards (Admin/HR/Manager Focused) */}
      {(user?.role === "admin" || user?.role === "hr" || user?.role === "manager") && summary && (
        <div className={styles.overviewGrid}>
          <OverviewCard
            title="Total Payrolls"
            value={summary.totalPayrolls || 0}
            status="TotalPayrolls"
            icon={FileText}
          />
          <OverviewCard
            title="Total Amount"
            value={formatCurrency(summary.totalAmount)}
            status="TotalAmount"
            icon={DollarSign}
          />
          <OverviewCard
            title="Generated"
            value={summary.statusWise?.generated || 0}
            status="Generated"
            icon={FileText}
            infoText="Awaiting processing"
          />
          <OverviewCard
            title="Processed"
            value={summary.statusWise?.processed || 0}
            status="Processed"
            icon={Clock}
            infoText="Ready for approval"
          />
          <OverviewCard
            title="Approved"
            value={summary.statusWise?.approved || 0}
            status="Approved"
            icon={Shield}
            infoText="Ready for payment"
          />
          <OverviewCard
            title="Paid"
            value={summary.statusWise?.paid || 0}
            status="Paid"
            icon={CheckCircle}
            infoText="Completed payments"
          />
        </div>
      )}

      {/* Tabs Section */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className={styles.tabs}
      >
        <TabsList className={styles.tabList}>
          {(user?.role === "admin" || user?.role === "hr" || user?.role === "manager") && (
            <TabsTrigger
              className={`${styles.tabTrigger} ${
                activeTab === "payrolls" ? styles.tabTriggerActive : ""
              }`}
              value="payrolls"
            >
              Payroll List
            </TabsTrigger>
          )}

          <TabsTrigger
            className={`${styles.tabTrigger} ${
              activeTab === "history" ? styles.tabTriggerActive : ""
            }`}
            value="history"
          >
            {user?.role === "employee" ? "My Payrolls" : "History"}
          </TabsTrigger>
          {(user?.role === "admin" || user?.role === "hr" || user?.role === "manager") && (
            <TabsTrigger
              className={`${styles.tabTrigger} ${
                activeTab === "summary" ? styles.tabTriggerActive : ""
              }`}
              value="summary"
            >
              Summary
            </TabsTrigger>
          )}
        </TabsList>

        {(user?.role === "admin" || user?.role === "hr" || user?.role === "manager") && (
          <TabsContent value="payrolls" className={styles.tabContent}>
            {renderContent(<PayrollList user={user} onEditPayroll={(payroll) => {
              setEditPayroll(payroll);
              setOpenForm(true);
            }} />)}
          </TabsContent>
        )}

        <TabsContent value="history" className={styles.tabContent}>
          {user?.role === "admin" || user?.role === "hr" || user?.role === "manager" ? (
            renderContent(<PayrollHistory user={user} />)
          ) : (
            renderContent(<PayrollHistory user={user} />)
          )}
        </TabsContent>



        {(user?.role === "admin" || user?.role === "hr" || user?.role === "manager") && (
          <TabsContent value="summary" className={styles.tabContent}>
            {renderContent(<PayrollSummary />)}
          </TabsContent>
        )}
      </Tabs>

      {/* Generate Payroll Form Dialog */}
      <PayrollGenerationForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditPayroll(null);
        }}
        user={user}
        editData={editPayroll}
      />
    </div>
  );
};

export default Payroll;