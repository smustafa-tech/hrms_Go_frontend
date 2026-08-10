import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { usePayrollStore } from "@/store/PayrollStore.js";
import styles from "./PayrollList.module.css";

const PayrollList = ({ user, onEditPayroll }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const { 
    updatePayrollStatus, 
    generatePayslipPDF,
    payrollData, 
    loading 
  } = usePayrollStore();

  const handleStatusUpdate = async (payrollId, newStatus) => {
    try {
      await updatePayrollStatus(payrollId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

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

  const handleEditPayroll = (payroll) => {
    if (onEditPayroll) {
      onEditPayroll(payroll);
    }
    setShowModal(false);
  };

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const payrolls = user.role === "admin" || user.role === "hr" || user.role === "manager" 
    ? payrollData.allPayrolls 
    : payrollData.myPayrolls;
    
  // Filter for current month only
  const currentMonthPayrolls = payrolls.filter(payroll => 
    payroll.month === currentMonth && payroll.year === currentYear
  );
    
  let filteredPayrolls = currentMonthPayrolls;
  
  // Apply search filter
  if (searchTerm) {
    filteredPayrolls = filteredPayrolls.filter(payroll => {
      const empId = payroll.user?.Employee?.emp_id?.toLowerCase() || '';
      const firstName = payroll.user?.Employee?.firstName?.toLowerCase() || '';
      const lastName = payroll.user?.Employee?.lastName?.toLowerCase() || '';
      const fullName = `${firstName} ${lastName}`.trim();
      const search = searchTerm.toLowerCase();
      
      return empId.includes(search) || firstName.includes(search) || 
             lastName.includes(search) || fullName.includes(search);
    });
  }
  
  // Apply status filter
  if (statusFilter) {
    filteredPayrolls = filteredPayrolls.filter(payroll => payroll.status === statusFilter);
  }

  return (
    <>
      <Card className={styles.baseCard}>
        <CardHeader className={styles.cardHeader}>
          <div>
            <CardTitle>Current Month Payroll ({currentMonth}/{currentYear})</CardTitle>
            <p className={styles.subTitle}>{filteredPayrolls.length} payroll records</p>
          </div>
          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} />
              <Input
                placeholder="Search by name or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.statusFilter}
            >
              <option value="">All Status</option>
              <option value="generated">Generated</option>
              <option value="processed">Processed</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className={styles.allPayrollsTableWrapper}>
            <table className={styles.allPayrollsTable}>
              <thead className={styles.allPayrollsHeader}>
                <tr>
                  <th className={styles.allPayrollsHeaderCell}>
                    Employee ID
                  </th>
                  <th className={styles.allPayrollsHeaderCell}>
                    Employee Name
                  </th>
                  <th className={styles.allPayrollsHeaderCell}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={styles.allPayrollsBody}>
                {loading ? (
                  <tr>
                    <td colSpan="3" className={styles.allPayrollsEmptyCell}>
                      Loading...
                    </td>
                  </tr>
                ) : filteredPayrolls.length === 0 ? (
                  <tr>
                    <td colSpan="3" className={styles.allPayrollsEmptyCell}>
                      No payroll records found
                    </td>
                  </tr>
                ) : (
                  filteredPayrolls.map((payroll) => (
                    <tr key={payroll.id} className={styles.allPayrollsRow}>
                      <td className={styles.allPayrollsCell}>
                        <span className={styles.employeeId}>{payroll.user?.Employee?.emp_id || 'N/A'}</span>
                      </td>
                      <td className={styles.allPayrollsCell}>
                        <div className={styles.employeeName}>
                          {payroll.user?.Employee?.firstName} {payroll.user?.Employee?.lastName}
                        </div>
                      </td>
                      <td className={styles.allPayrollsCell}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPayroll(payroll)}
                          className={styles.viewButton}
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className={styles.modalContent}>
          <DialogHeader className={styles.modalHeader}>
            <DialogTitle className={styles.modalTitle}>
              Payroll Details - {selectedPayroll?.user?.Employee?.firstName} {selectedPayroll?.user?.Employee?.lastName}
            </DialogTitle>
            <DialogDescription className={styles.modalDescription}>
              View detailed payroll information and download payslip.
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

              <div className={styles.actionSection}>
                {(user?.role === "admin" || user?.role === "hr" || user?.role === "manager") && (
                  <Button
                    className={styles.editButton}
                    onClick={() => handleEditPayroll(selectedPayroll)}
                  >
                    Edit
                  </Button>
                )}
                {selectedPayroll.status === 'generated' && (
                  <Button
                    className={styles.actionButton}
                    onClick={() => {
                      handleStatusUpdate(selectedPayroll.id, 'processed');
                      setShowModal(false);
                    }}
                  >
                    Process
                  </Button>
                )}
                {selectedPayroll.status === 'processed' && (
                  <Button
                    className={styles.actionButton}
                    onClick={() => {
                      handleStatusUpdate(selectedPayroll.id, 'approved');
                      setShowModal(false);
                    }}
                  >
                    Approve
                  </Button>
                )}
                {selectedPayroll.status === 'approved' && (
                  <Button
                    className={styles.actionButton}
                    onClick={() => {
                      handleStatusUpdate(selectedPayroll.id, 'paid');
                      setShowModal(false);
                    }}
                  >
                    Mark Paid
                  </Button>
                )}
                <Button
                  className={styles.downloadButton}
                  onClick={() => handleDownloadPDF(selectedPayroll.id)}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayrollList;