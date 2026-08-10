// src/store/PayrollStore.js
import { create } from "zustand";
import api from "@/Services/api";
import { toast } from "@/hooks/use-Toast";

export const usePayrollStore = create((set, get) => ({
  payrollData: {
    allPayrolls: [],
    myPayrolls: [],
    employees: [],
    summary: null,
  },
  loading: false,
  error: null,

  // Fetch all payrolls (admin/hr/manager)
  fetchAllPayrolls: async (user) => {
    set({ loading: true, error: null });
    try {
      if (user.role === "employee") {
        return;
      }
      
      const response = await api.get("/payroll/list");
      set((state) => ({
        payrollData: {
          ...state.payrollData,
          allPayrolls: response.data.payrolls || [],
          totalAmount: response.data.totalAmount || 0,
        },
        loading: false,
      }));
    } catch (error) {
      console.error("❌ Failed to fetch all payrolls:", error);
      set({
        loading: false,
        error: error.response?.data?.message || error.message || "Failed to fetch payrolls",
      });
    }
  },

  // Fetch employee's own payrolls
  fetchMyPayrolls: async (user) => {
    set({ loading: true, error: null });
    try {
      if (user.role !== "employee") {
        return;
      }
      
      const response = await api.get("/payroll/my-payrolls");
      set((state) => ({
        payrollData: {
          ...state.payrollData,
          myPayrolls: response.data.payrolls || [],
        },
        loading: false,
      }));
    } catch (error) {
      console.error("❌ Failed to fetch my payrolls:", error);
      set({
        loading: false,
        error: error.response?.data?.message || error.message || "Failed to fetch my payrolls",
      });
    }
  },

  // Fetch employees for payroll creation
  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/payroll/employees");
      set((state) => ({
        payrollData: {
          ...state.payrollData,
          employees: response.data.employees || [],
        },
        loading: false,
      }));
    } catch (error) {
      console.error("❌ Failed to fetch employees:", error);
      set({
        loading: false,
        error: error.response?.data?.message || error.message || "Failed to fetch employees",
      });
    }
  },

  // Create new payroll
  createPayroll: async (payrollData) => {
    set({ loading: true, error: null });
    try {
      await api.post("/payroll/create", payrollData);
      set({ loading: false });
      
      toast({
        title: "Success",
        description: "Payroll created successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("❌ Failed to create payroll:", error);
      set({
        loading: false,
        error: error.response?.data?.message || error.message || "Failed to create payroll",
      });
      
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create payroll",
        variant: "destructive",
      });
    }
  },

  // Update payroll
  updatePayroll: async (payrollId, payrollData) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/payroll/update/${payrollId}`, payrollData);
      
      set({ loading: false });
      toast({
        title: "Success",
        description: "Payroll updated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("❌ Failed to update payroll:", error);
      set({
        loading: false,
        error: error.response?.data?.message || error.message || "Failed to update payroll",
      });
      
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to update payroll",
        variant: "destructive",
      });
    }
  },

  // Update payroll status
  updatePayrollStatus: async (payrollId, status) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/payroll/status/${payrollId}`, { status });
      
      set({ loading: false });
      toast({
        title: "Success",
        description: "Payroll status updated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("❌ Failed to update payroll status:", error);
      set({
        loading: false,
        error: error.response?.data?.message || error.message || "Failed to update payroll status",
      });
    }
  },

  // Generate payslip PDF
  generatePayslipPDF: async (payrollId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/payroll/payslip/${payrollId}/pdf`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslip-${payrollId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      set({ loading: false });
      toast({
        title: "Success",
        description: "Payslip downloaded successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("❌ Failed to generate payslip:", error);
      
      // Try to extract error message from blob response
      let errorMessage = "Failed to generate payslip";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If can't parse, use default message
        }
      } else {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      }
      
      set({
        loading: false,
        error: errorMessage,
      });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  // Fetch payroll summary
  fetchPayrollSummary: async (user, filters = {}) => {
    set({ loading: true, error: null });
    try {
      if (user.role === "employee") {
        return;
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);
      
      const queryString = params.toString();
      const url = queryString ? `/payroll/summary?${queryString}` : '/payroll/summary';
      
      const response = await api.get(url);
      set((state) => ({
        payrollData: {
          ...state.payrollData,
          summary: response.data.summary || response.data,
        },
        loading: false,
      }));
    } catch (error) {
      console.error("❌ Failed to fetch payroll summary:", error);
      set({
        loading: false,
        error: error.response?.data?.message || error.message || "Failed to fetch summary",
      });
    }
  },

  // Helper functions
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));