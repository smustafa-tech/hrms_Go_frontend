import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Filter, Calendar, Eye } from "lucide-react";
import { usePayrollStore } from "@/store/PayrollStore.js";
import styles from "./PayrollHistory.module.css";

const PayrollHistory = ({ user }) => {
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    status: ""
  });
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    fetchAllPayrolls,
    fetchMyPayrolls,
    generatePayslipPDF,
    payrollData,
    loading
  } = usePayrollStore();

  const handleDownloadPDF = async (payrollId) => {
    try {
      await generatePayslipPDF(payrollId);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    }
  };

  const handleViewPayroll = (payroll) => {
    setSelectedPayroll(payroll);
    setShowModal(true);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    if (user?.role === "admin" || user?.role === "hr" || user?.role === "manager") {
      fetchAllPayrolls(user);
    } else {
      fetchMyPayrolls(user);
    }
  };

  const payrolls =
    user?.role === "admin" || user?.role === "hr" || user?.role === "manager"
      ? payrollData.allPayrolls
      : payrollData.myPayrolls;

  const filteredPayrolls = payrolls.filter(payroll => {
    const monthMatch = !filters.month || payroll.month === parseInt(filters.month);
    const yearMatch = !filters.year || payroll.year === parseInt(filters.year);
    const statusMatch = !filters.status || payroll.status === filters.status;
    return monthMatch && yearMatch && statusMatch;
  });

  return (
    <>
    <div className={styles.dashboardContainer}>
      <Card className={styles.baseCard}>
        <CardHeader className={styles.cardHeader}>
          <div>
            <CardTitle className={styles.mainTitle}>
              {user?.role === "employee" ? "My Payroll History" : "Payroll History"}
            </CardTitle>
            <p className={styles.subTitle}>
              {user?.role === "employee" 
                ? "View your payroll history and download payslips" 
                : "Filter and view historical payroll data"}
            </p>
          </div>
          <Filter className={styles.filterIcon} />
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className={styles.filterContainer}>
            <div className={styles.filterGrid}>
              <div className={styles.filterItem}>
                <Label htmlFor="month" className={styles.filterLabel}>
                  Month
                </Label>
                <Input
                  id="month"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="MM (1-12)"
                  value={filters.month}
                  onChange={(e) => handleFilterChange("month", e.target.value)}
                  className={styles.filterInput}
                />
              </div>

              <div className={styles.filterItem}>
                <Label htmlFor="year" className={styles.filterLabel}>
                  Year
                </Label>
                <Input
                  id="year"
                  type="number"
                  min="2020"
                  max="2030"
                  placeholder="YYYY"
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className={styles.filterInput}
                />
              </div>

              <div className={styles.filterItem}>
                <Label htmlFor="status" className={styles.filterLabel}>
                  Status
                </Label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">All Status</option>
                  <option value="generated">Generated</option>
                  <option value="processed">Processed</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div className={styles.filterItem}>
                <Button
                  onClick={handleApplyFilters}
                  disabled={loading}
                  className={styles.filterButton}
                >
                  {loading ? "Loading..." : "Apply Filters"}
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className={styles.resultsContainer}>
            <div className={styles.resultsHeader}>
              <h3 className={styles.resultsTitle}>
                <Calendar className={styles.resultsIcon} />
                {filteredPayrolls.length} records found
              </h3>
            </div>

            <table className={styles.historyTable}>
              <thead className={styles.historyTableHeader}>
                <tr>
                  {(user?.role === "admin" || user?.role === "hr" || user?.role === "manager") && (
                    <th className={styles.historyTableHeaderCell}>Employee</th>
                  )}
                  <th className={styles.historyTableHeaderCell}>Period</th>
                  <th className={styles.historyTableHeaderCell}>Basic Salary</th>
                  <th className={styles.historyTableHeaderCell}>Net Salary</th>
                  <th className={styles.historyTableHeaderCell}>Status</th>
                  <th className={styles.historyTableHeaderCell}>Actions</th>
                </tr>
              </thead>

              <tbody className={styles.historyTableBody}>
                {loading ? (
                  <tr>
                    <td colSpan="6" className={styles.loadingCell}>
                      Loading payroll history...
                    </td>
                  </tr>
                ) : filteredPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan={user?.role === "admin" || user?.role === "hr" || user?.role === "manager" ? "6" : "5"} className={styles.historyTableEmptyCell}>
                      No payroll records found for selected filters
                    </td>
                  </tr>
                ) : (
                  filteredPayrolls.map((payroll) => (
                    <tr key={payroll.id} className={styles.historyTableRow}>
                      {(user?.role === "admin" || user?.role === "hr" || user?.role === "manager") && (
                        <td className={styles.historyTableCell}>
                          <div className={styles.employeeInfo}>
                            <div className={styles.employeeName}>
                              {payroll.user?.Employee?.firstName} {payroll.user?.Employee?.lastName}
                            </div>
                            <div className={styles.employeeId}>
                              ID: {payroll.user?.Employee?.emp_id}
                            </div>
                          </div>
                        </td>
                      )}

                      <td className={styles.historyTableCell}>
                        <span className={styles.periodValue}>
                          {payroll.month}/{payroll.year}
                        </span>
                      </td>

                      <td className={styles.historyTableCell}>
                        <span className={styles.salaryValue}>
                          ₹{payroll.basicSalary?.toLocaleString()}
                        </span>
                      </td>

                      <td className={styles.historyTableCell}>
                        <span className={styles.netSalaryValue}>
                          ₹{payroll.netSalary?.toLocaleString()}
                        </span>
                      </td>

                      <td className={styles.historyTableCell}>
                        <span className={`${styles.statusBadge} ${styles[payroll.status]}`}>
                          {payroll.status}
                        </span>
                      </td>

                      <td className={styles.historyTableCell}>
                        <div className={styles.actionButtons}>
                          <Button
                            onClick={() => handleViewPayroll(payroll)}
                            className={styles.viewButton}
                            size="sm"
                          >
                            <Eye size={16} />
                            View
                          </Button>
                          <Button
                            onClick={() => handleDownloadPDF(payroll.id)}
                            className={styles.downloadButton}
                          >
                            Download PDF
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className={styles.modalContent}>
        <DialogHeader className={styles.modalHeader}>
          <DialogTitle className={styles.modalTitle}>
            Payroll Details - {selectedPayroll?.user?.Employee?.firstName} {selectedPayroll?.user?.Employee?.lastName}
          </DialogTitle>
          <DialogDescription className={styles.modalDescription}>
            View detailed payroll information.
          </DialogDescription>
        </DialogHeader>
        
        {selectedPayroll && (
          <div className={styles.modalBody}>
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Employee Information</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Employee ID</label>
                  <p className={styles.infoValue}>{selectedPayroll.user?.Employee?.emp_id}</p>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Designation</label>
                  <p className={styles.infoValue}>{selectedPayroll.user?.Employee?.designation}</p>
                </div>
              </div>
            </div>

            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Payroll Details</h3>
              <div className={styles.payrollGrid}>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Month/Year</label>
                  <p className={styles.infoValue}>{selectedPayroll.month}/{selectedPayroll.year}</p>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Basic Salary</label>
                  <p className={styles.salaryValue}>₹{selectedPayroll.basicSalary?.toLocaleString()}</p>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>HRA</label>
                  <p className={styles.salaryValue}>₹{selectedPayroll.hra?.toLocaleString()}</p>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Allowances</label>
                  <p className={styles.salaryValue}>₹{selectedPayroll.allowances?.toLocaleString()}</p>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Deductions</label>
                  <p className={styles.deductionValue}>₹{selectedPayroll.deductions?.toLocaleString()}</p>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Net Salary</label>
                  <p className={styles.netSalaryValue}>₹{selectedPayroll.netSalary?.toLocaleString()}</p>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Leave Days</label>
                  <p className={styles.infoValue}>{selectedPayroll.leaveDays || 0}</p>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Half Days</label>
                  <p className={styles.infoValue}>{selectedPayroll.halfDays || 0}</p>
                </div>
                <div className={styles.infoItem}>
                  <label className={styles.infoLabel}>Status</label>
                  <span className={`${styles.statusBadge} ${styles[selectedPayroll.status]}`}>
                    {selectedPayroll.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};

export default PayrollHistory;
