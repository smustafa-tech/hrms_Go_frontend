import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Eye, Download, Edit } from "lucide-react";
import styles from "./GeneratedPayrollList.module.css";

const GeneratedPayrollList = ({ payrolls, user }) => {
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  const handleView = (payroll) => {
    setSelectedPayroll(payroll);
    setViewDialog(true);
  };

  const handleEdit = (payroll) => {
    setSelectedPayroll(payroll);
    setEditDialog(true);
  };

  const handleDownload = (payroll) => {
    console.log("Downloading payslip for:", payroll);
    alert(`Downloading payslip for ${payroll.Employee?.firstName} ${payroll.Employee?.lastName} - ${payroll.month}/${payroll.year}`);
  };

  if (!payrolls || payrolls.length === 0) {
    return (
      <Card>
        <CardContent className={styles.emptyState}>
          No generated payrolls found. Generate payroll first.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generated Payrolls</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.map((payroll) => (
                <TableRow key={payroll.id}>
                  <TableCell>
                    {payroll.Employee?.firstName || "-"} {payroll.Employee?.lastName || ""}
                  </TableCell>
                  <TableCell>
                    {payroll.month}/{payroll.year}
                  </TableCell>
                  <TableCell>{formatCurrency(payroll.basicSalary)}</TableCell>
                  <TableCell>{formatCurrency(payroll.allowances)}</TableCell>
                  <TableCell>{formatCurrency(payroll.deductions)}</TableCell>
                  <TableCell>{formatCurrency(payroll.netSalary)}</TableCell>
                  <TableCell>
                    <span
                      className={`${styles.badge} ${
                        payroll.status === "generated"
                          ? styles.badgeGenerated
                          : payroll.status === "approved"
                          ? styles.badgeApproved
                          : payroll.status === "processed"
                          ? styles.badgeProcessed
                          : payroll.status === "paid"
                          ? styles.badgePaid
                          : styles.badgeReversed
                      }`}
                    >
                      {payroll.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className={styles.actionButtons}>
                      <Button size="sm" variant="ghost" onClick={() => handleView(payroll)}>
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(payroll)}>
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDownload(payroll)}>
                        <Download size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className={styles.viewDialog}>
          <DialogHeader>
            <DialogTitle>
              Payslip Details - {selectedPayroll?.Employee?.firstName} {selectedPayroll?.Employee?.lastName}
            </DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <div>
              <div className={styles.dialogGrid}>
                <div>
                  <label className={styles.dialogLabel}>Employee:</label>
                  <p className={styles.dialogValue}>{selectedPayroll.Employee?.firstName} {selectedPayroll.Employee?.lastName}</p>
                </div>
                <div>
                  <label className={styles.dialogLabel}>Period:</label>
                  <p className={styles.dialogValue}>{selectedPayroll.month}/{selectedPayroll.year}</p>
                </div>
                <div>
                  <label className={styles.dialogLabel}>Basic Salary:</label>
                  <p className={styles.dialogValue}>{formatCurrency(selectedPayroll.basicSalary)}</p>
                </div>
                <div>
                  <label className={styles.dialogLabel}>Allowances:</label>
                  <p className={styles.dialogValue}>{formatCurrency(selectedPayroll.allowances)}</p>
                </div>
                <div>
                  <label className={styles.dialogLabel}>Deductions:</label>
                  <p className={styles.dialogValue}>{formatCurrency(selectedPayroll.deductions)}</p>
                </div>
                <div>
                  <label className={styles.dialogLabel}>Net Salary:</label>
                  <p className={styles.netSalaryValue}>{formatCurrency(selectedPayroll.netSalary)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className={styles.viewDialog}>
          <DialogHeader>
            <DialogTitle>
              Edit Payroll - {selectedPayroll?.Employee?.firstName} {selectedPayroll?.Employee?.lastName}
            </DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <div>
              <p className={styles.dialogNote}>Edit payroll functionality will be implemented here.</p>
              <div className={styles.dialogActions}>
                <Button variant="outline" onClick={() => setEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setEditDialog(false)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GeneratedPayrollList;