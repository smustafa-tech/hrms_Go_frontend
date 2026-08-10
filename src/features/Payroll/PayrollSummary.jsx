import React, { useState } from "react";
import styles from "./PayrollSummary.module.css";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { usePayrollStore } from "@/store/PayrollStore.js";
import { useAuth } from "@/components/Context/AuthContext";

const PayrollSummary = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    month: "",
    year: new Date().getFullYear().toString(),
  });

  const { fetchPayrollSummary, payrollData, loading } = usePayrollStore();
  const summary = payrollData.summary;

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Pass filters to fetch summary for specific month/year
    fetchPayrollSummary(user, filters);
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Payroll Summary</h1>

      {/* Filters */}
      <div className={styles.card}>
        <div className={styles.filterGrid}>
          <div>
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="number"
              min="1"
              max="12"
              placeholder="MM (optional)"
              value={filters.month}
              onChange={(e) =>
                handleFilterChange("month", e.target.value)
              }
            />
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              min="2020"
              max="2030"
              placeholder="YYYY"
              value={filters.year}
              onChange={(e) =>
                handleFilterChange("year", e.target.value)
              }
            />
          </div>

          <div className={styles.submitButtonContainer}>
            <Button onClick={handleSubmit} disabled={loading} className={styles.submitButton}>
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total Payrolls</div>
            <div className={`${styles.summaryValue} ${styles.primary}`}>
              {summary.totalPayrolls}
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total Amount</div>
            <div className={`${styles.summaryValue} ${styles.success}`}>
              ₹{summary.totalAmount?.toLocaleString()}
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total Basic Salary</div>
            <div className={`${styles.summaryValue} ${styles.warning}`}>
              ₹{summary.totalBasicSalary?.toLocaleString()}
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Total Deductions</div>
            <div className={`${styles.summaryValue} ${styles.error}`}>
              ₹{summary.totalDeductions?.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Status Breakdown */}
      {summary?.statusWise && (
        <div className={styles.card}>
          <h2 className={styles.statusTitle}>Status Wise Breakdown</h2>

          <div className={styles.statusGrid}>
            {Object.entries(summary.statusWise).map(([key, value]) => (
              <div key={key} className={styles.statusCard}>
                <div className={styles.statusLabel}>
                  {key.toUpperCase()}
                </div>
                <div className={styles.statusValue}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!summary && !loading && (
        <div className={styles.card}>
          <p className={styles.emptyState}>
            No summary data available. Apply filters to view summary.
          </p>
        </div>
      )}
    </div>
  );
};

export default PayrollSummary;
