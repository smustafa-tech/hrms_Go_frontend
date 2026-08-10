// Payroll calculation utilities - Updated for new backend
import { usePayrollStore } from "@/store/PayrollStore.js";

export const calculateNetSalary = (basicSalary, hra, allowances, deductions, leaveDays = 0, halfDays = 0) => {
  // Calculate deductions for leaves and half days
  const dailySalary = basicSalary / 30;
  const leaveDeduction = leaveDays * dailySalary;
  const halfDayDeduction = halfDays * (dailySalary / 2);
  const totalDeductions = deductions + leaveDeduction + halfDayDeduction;
  
  // Calculate net salary
  const grossSalary = basicSalary + hra + allowances;
  const netSalary = grossSalary - totalDeductions;
  
  return {
    grossSalary,
    totalDeductions,
    netSalary,
    leaveDeduction,
    halfDayDeduction
  };
};

export const generatePayrollForEmployee = async (userId, month, year, salaryData) => {
  const store = usePayrollStore.getState();
  
  const payrollData = {
    userId,
    month,
    year,
    ...salaryData
  };
  
  return await store.createPayroll(payrollData);
};