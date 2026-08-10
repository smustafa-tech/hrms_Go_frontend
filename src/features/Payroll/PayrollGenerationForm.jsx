import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { usePayrollStore } from "@/store/PayrollStore.js";
import styles from "./PayrollGenerationForm.module.css";

const PayrollGenerationForm = ({ open, onClose, user, editData }) => {
  const [formData, setFormData] = useState({
    userId: "",
    month: "",
    year: "",
    basicSalary: "",
    hra: "",
    bonus: "",
    otherAllowance: "",
    pf: "",
    esic: "",
    professionalTax: "",
    otherDeduction: ""
  });

  const [attendanceData, setAttendanceData] = useState({
    unpaidLeaves: 0,
    halfDays: 0,
    presentDays: 0,
    loading: false
  });

  // Calculate totals with attendance deductions
  const grossTotal = (parseFloat(formData.basicSalary) || 0) + 
                    (parseFloat(formData.hra) || 0) + 
                    (parseFloat(formData.bonus) || 0) +
                    (parseFloat(formData.otherAllowance) || 0);
  
  const dailySalary = grossTotal / 30; // Assuming 30 days per month
  const unpaidLeaveDeduction = attendanceData.unpaidLeaves * dailySalary;
  const halfDayDeduction = (attendanceData.halfDays * dailySalary) / 2;
  
  const totalDeductions = (parseFloat(formData.pf) || 0) + 
                         (parseFloat(formData.esic) || 0) + 
                         (parseFloat(formData.professionalTax) || 0) +
                         (parseFloat(formData.otherDeduction) || 0) +
                         unpaidLeaveDeduction + halfDayDeduction;
  
  const netTotal = grossTotal - totalDeductions;
  
  // Debug calculations
  console.log('💰 Salary Calculations:', {
    grossTotal,
    dailySalary,
    unpaidLeaves: attendanceData.unpaidLeaves,
    halfDays: attendanceData.halfDays,
    unpaidLeaveDeduction,
    halfDayDeduction,
    totalAttendanceDeduction: unpaidLeaveDeduction + halfDayDeduction,
    totalDeductions,
    netTotal
  });

  const { 
    createPayroll,
    updatePayroll, 
    fetchEmployees, 
    payrollData, 
    loading 
  } = usePayrollStore();

  useEffect(() => {
    if (open) {
      fetchEmployees();
      
      // If editing, populate form with existing data
      if (editData) {
        setFormData({
          userId: editData.userId || "",
          month: editData.month || "",
          year: editData.year || "",
          basicSalary: editData.basicSalary || "",
          hra: editData.hra || "",
          bonus: editData.bonus || "",
          otherAllowance: editData.otherAllowance || "",
          pf: editData.pf || "",
          esic: editData.esic || "",
          professionalTax: editData.professionalTax || "",
          otherDeduction: editData.otherDeduction || ""
        });
        
        // Fetch attendance data for edit mode
        if (editData.userId && editData.month && editData.year) {
          fetchAttendanceData(editData.userId, editData.month, editData.year);
        }
      } else {
        // Reset form for create mode
        setFormData({
          userId: "",
          month: "",
          year: "",
          basicSalary: "",
          hra: "",
          bonus: "",
          otherAllowance: "",
          pf: "",
          esic: "",
          professionalTax: "",
          otherDeduction: ""
        });
        setAttendanceData({ unpaidLeaves: 0, halfDays: 0, presentDays: 0, loading: false });
      }
    }
  }, [open, fetchEmployees, editData]);



  const fetchAttendanceData = async (userId, month, year) => {
    if (!userId || !month || !year) return;
    
    console.log('🔍 Fetching attendance for:', { userId, month, year });
    setAttendanceData(prev => ({ ...prev, loading: true }));
    
    try {
      const { default: api } = await import('@/Services/api');
      const response = await api.get(`/attendance/summary/${userId}?month=${month}&year=${year}`);
      
      console.log('📊 Attendance Summary Response:', response.data);
      
      setAttendanceData({
        unpaidLeaves: response.data.unpaidLeaves || 0,
        halfDays: response.data.halfDays || 0,
        presentDays: response.data.presentDays || response.data.totalRecords || 0,
        loading: false
      });
      
      console.log('✅ Attendance data updated:', {
        unpaidLeaves: response.data.unpaidLeaves || 0,
        halfDays: response.data.halfDays || 0,
        presentDays: response.data.presentDays || response.data.totalRecords || 0
      });
      
    } catch (error) {
      console.error('❌ Failed to fetch attendance:', error);
      console.error('Error details:', error.response?.data || error.message);
      setAttendanceData({ unpaidLeaves: 0, halfDays: 0, loading: false });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-fetch attendance when all required fields are filled
    const newData = { ...formData, [field]: value };
    if (field === 'userId' || field === 'month' || field === 'year') {
      if (newData.userId && newData.month && newData.year) {
        fetchAttendanceData(newData.userId, newData.month, newData.year);
      }
    }
  };

  const handleAttendanceChange = (field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.month || !formData.year || !formData.basicSalary) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const payrollData = {
        userId: formData.userId,
        month: parseInt(formData.month, 10),
        year: parseInt(formData.year, 10),
        basicSalary: parseFloat(formData.basicSalary),
        hra: parseFloat(formData.hra) || 0,
        bonus: parseFloat(formData.bonus) || 0,
        otherAllowance: parseFloat(formData.otherAllowance) || 0,
        pf: parseFloat(formData.pf) || 0,
        esic: parseFloat(formData.esic) || 0,
        professionalTax: parseFloat(formData.professionalTax) || 0,
        otherDeduction: parseFloat(formData.otherDeduction) || 0,
        allowances: (parseFloat(formData.bonus) || 0) + (parseFloat(formData.otherAllowance) || 0),
        deductions: (parseFloat(formData.pf) || 0) + (parseFloat(formData.esic) || 0) + (parseFloat(formData.professionalTax) || 0) + (parseFloat(formData.otherDeduction) || 0) + unpaidLeaveDeduction + halfDayDeduction,
        grossSalary: grossTotal,
        netSalary: netTotal
      };

      if (editData) {
        await updatePayroll(editData.id, payrollData);
      } else {
        await createPayroll(payrollData);
      }
      
      // Reset form and close
      setFormData({
        userId: "",
        month: "",
        year: "",
        basicSalary: "",
        hra: "",
        bonus: "",
        otherAllowance: "",
        pf: "",
        esic: "",
        professionalTax: "",
        otherDeduction: ""
      });
      onClose();
    } catch (error) {
      console.error(editData ? "Payroll update failed:" : "Payroll creation failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Payroll' : 'Create New Payroll'}</DialogTitle>
          <DialogDescription>
            {editData ? 'Update the payroll information below.' : 'Fill in the employee details and salary information to create a new payroll record.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className={styles.formContent}>
            {/* Employee Selection - Full Width */}
            <div className={styles.employeeRow}>
              <label className={`${styles.employeeLabel} ${styles.required}`}>Employee</label>
              <select
                value={formData.userId}
                onChange={(e) => handleInputChange('userId', e.target.value)}
                className={styles.employeeSelect}
                required
              >
                <option value="">-- Select Employee --</option>
                {(payrollData.employees || []).map((emp) => (
                  <option key={emp.userId} value={emp.userId}>
                    {emp.Employee?.firstName} {emp.Employee?.lastName} ({emp.Employee?.emp_id})
                  </option>
                ))}
              </select>
            </div>

            {/* Row 1: Month and Year */}
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="month" className={`${styles.fieldLabel} ${styles.required}`}>Month</label>
                <input
                  id="month"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="MM (e.g., 12)"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', e.target.value)}
                  className={styles.fieldInput}
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="year" className={`${styles.fieldLabel} ${styles.required}`}>Year</label>
                <input
                  id="year"
                  type="number"
                  min="2020"
                  max="2030"
                  placeholder="YYYY (e.g., 2025)"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className={styles.fieldInput}
                  required
                />
              </div>
            </div>

            {/* Attendance Info */}
            <h3 className={styles.sectionHeader}>Attendance Summary</h3>
            {(formData.userId && formData.month && formData.year) && (
              <div className={styles.attendanceInfo}>
                <p className={styles.attendanceNote}>
                  {attendanceData.loading ? 
                    '🔄 Fetching attendance data...' : 
                    '✅ Attendance data loaded automatically'
                  }
                </p>
              </div>
            )}
            <div className={styles.threeFieldRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="presentDays" className={styles.fieldLabel}>
                  Present Days {attendanceData.loading && '(Loading...)'}
                </label>
                <input
                  id="presentDays"
                  type="number"
                  min="0"
                  placeholder="Days"
                  value={attendanceData.presentDays}
                  className={styles.fieldInput}
                  disabled
                  style={{backgroundColor: '#f0f9ff', color: '#059669'}}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="unpaidLeaves" className={styles.fieldLabel}>
                  Unpaid Leaves {attendanceData.loading && '(Loading...)'}
                </label>
                <input
                  id="unpaidLeaves"
                  type="number"
                  min="0"
                  placeholder="Days"
                  value={attendanceData.unpaidLeaves}
                  className={styles.fieldInput}
                  disabled
                  style={{backgroundColor: '#f0f9ff', color: '#059669'}}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="halfDays" className={styles.fieldLabel}>
                  Half Days {attendanceData.loading && '(Loading...)'}
                </label>
                <input
                  id="halfDays"
                  type="number"
                  min="0"
                  placeholder="Days"
                  value={attendanceData.halfDays}
                  className={styles.fieldInput}
                  disabled
                  style={{backgroundColor: '#f0f9ff', color: '#059669'}}
                />
              </div>
            </div>

            {/* Allowance Section */}
            <h3 className={styles.sectionHeader}>Allowance</h3>
            <div className={styles.threeFieldRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="basicSalary" className={`${styles.fieldLabel} ${styles.required}`}>Basic Salary</label>
                <input
                  id="basicSalary"
                  type="number"
                  step="0.01"
                  placeholder="Enter basic salary"
                  value={formData.basicSalary}
                  onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                  className={styles.fieldInput}
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="hra" className={styles.fieldLabel}>HRA</label>
                <input
                  id="hra"
                  type="number"
                  step="0.01"
                  placeholder="Enter HRA"
                  value={formData.hra}
                  onChange={(e) => handleInputChange('hra', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="bonus" className={styles.fieldLabel}>Bonus</label>
                <input
                  id="bonus"
                  type="number"
                  step="0.01"
                  placeholder="Enter bonus"
                  value={formData.bonus}
                  onChange={(e) => handleInputChange('bonus', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="otherAllowance" className={styles.fieldLabel}>Other Allowance</label>
                <input
                  id="otherAllowance"
                  type="number"
                  step="0.01"
                  placeholder="Enter other allowance"
                  value={formData.otherAllowance}
                  onChange={(e) => handleInputChange('otherAllowance', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
              <div></div>
            </div>

            {/* Deductions Section */}
            <h3 className={styles.sectionHeader}>Deductions</h3>
            <div className={styles.threeFieldRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="pf" className={styles.fieldLabel}>PF</label>
                <input
                  id="pf"
                  type="number"
                  step="0.01"
                  placeholder="Enter PF"
                  value={formData.pf}
                  onChange={(e) => handleInputChange('pf', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="esic" className={styles.fieldLabel}>ESIC</label>
                <input
                  id="esic"
                  type="number"
                  step="0.01"
                  placeholder="Enter ESIC"
                  value={formData.esic}
                  onChange={(e) => handleInputChange('esic', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="professionalTax" className={styles.fieldLabel}>Professional Tax</label>
                <input
                  id="professionalTax"
                  type="number"
                  step="0.01"
                  placeholder="Enter professional tax"
                  value={formData.professionalTax}
                  onChange={(e) => handleInputChange('professionalTax', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="otherDeduction" className={styles.fieldLabel}>Other Deduction</label>
                <input
                  id="otherDeduction"
                  type="number"
                  step="0.01"
                  placeholder="Enter other deduction"
                  value={formData.otherDeduction}
                  onChange={(e) => handleInputChange('otherDeduction', e.target.value)}
                  className={styles.fieldInput}
                />
              </div>
              <div></div>
            </div>

            {/* Net Calculation Section */}
            <h3 className={styles.sectionHeader}>Salary Calculation</h3>
            <div className={styles.calculationGrid}>
              <div className={styles.calculationField}>
                <label className={styles.calculationLabel}>Gross Total</label>
                <div className={styles.calculationValue}>₹{grossTotal.toLocaleString()}</div>
                <small className={styles.calculationNote}>Basic + HRA + Bonus + Other Allowance</small>
              </div>
              <div className={styles.calculationField}>
                <label className={styles.calculationLabel}>Attendance Deduction</label>
                <div className={styles.deductionValue}>-₹{(unpaidLeaveDeduction + halfDayDeduction).toLocaleString()}</div>
                <small className={styles.calculationNote}>
                  {attendanceData.unpaidLeaves} leaves + {attendanceData.halfDays} half days
                </small>
              </div>
              <div className={styles.calculationField}>
                <label className={styles.calculationLabel}>Other Deductions</label>
                <div className={styles.deductionValue}>-₹{((parseFloat(formData.pf) || 0) + (parseFloat(formData.esic) || 0) + (parseFloat(formData.professionalTax) || 0) + (parseFloat(formData.otherDeduction) || 0)).toLocaleString()}</div>
                <small className={styles.calculationNote}>PF + ESIC + Professional Tax + Other</small>
              </div>
              <div className={styles.calculationField}>
                <label className={styles.calculationLabel}>Net Salary</label>
                <div className={styles.netValue}>₹{netTotal.toLocaleString()}</div>
                <small className={styles.calculationNote}>Final amount after all deductions</small>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (editData ? "Updating..." : "Creating...") : (editData ? "Update Payroll" : "Create Payroll")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayrollGenerationForm;