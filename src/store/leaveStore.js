import { create } from "zustand";
import api from "@/Services/api"; // Your Axios instance
import { toast } from "@/hooks/use-Toast";

export const useLeaveStore = create((set) => ({
  leaveData: {
    totalLeavesData: [],
    MyLeaveData: [],
    allLeaveBalances: [],
    myLeaveBalances: [],
  },
  loading: false,
  error: null,

  // 🔹 Fetch all leaves
  fetchAllLeaves: async (user) => {
    set({ loading: true, error: null });

    try {
      if (user.role === "employee" || user.role === "manager") {
        return; // Employees fetch their leaves via fetchLeavesByEmployee
      } else {
        const response = await api.get("/leave/all-leaves");

        set((state) => ({
          leaveData: {
            ...state.leaveData,
            totalLeavesData: response.data.allLeaves,
          },
          loading: false,
          error: null,
        }));
      }
    } catch (error) {
      console.error("❌ Failed to fetch all leaves:", error);
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch all leaves",
      });
    }
  },

  // 🔹 Fetch leaves for a specific employee
  fetchLeavesByEmployee: async (user) => {
    set({ loading: true, error: null });

    try {
      if (user.role == !"employee" || user.role == !"manager") {
        return; // Employees fetch their leaves via fetchLeavesByEmployee
      } else {
        const response = await api.get("/leave/my-leaves");

        set((state) => ({
          leaveData: {
            ...state.leaveData,
            MyLeaveData: response.data.leaves,
          },
          loading: false,
          error: null,
        }));
      }
    } catch (error) {
      console.error("❌ Failed to fetch leaves for employee:", error);
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch employee leaves",
      });
    }
  },

  // 🔹 Create a new leave application
  createLeave: async (data) => {
    set({ loading: true, error: null });

    try {
      await api.post("/leave/apply-leave", data);

      set(() => ({
        // leaveData: {
        //   ...state.leaveData,
        //   totalLeavesData: [newLeave, ...state.leaveData.totalLeavesData],
        //   MyLeaveData: [newLeave, ...state.leaveData.MyLeaveData],
        // },
        loading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Leave application created successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("❌ Failed to create leave application:", error);
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create leave application",
      });

      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to create leave application",
        variant: "destructive",
      });
    }
  },

  approveLeave: async (leaveId, status) => {
    set({ loading: true, error: null });

    try {
      const data = { leaveId, status };
      await api.put("/leave/update-leave", data);

      set(() => ({
        loading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Leave application updated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("❌ Failed to update leave application:", error);
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update leave application",
      });
    }
  },

  fetchAllLeaveBalance: async (user) => {
    set({ loading: true, error: null });

    try {
      if (user.role === "employee" || user.role === "manager") {
        return; // Employees fetch their leaves via fetchLeavesByEmployee
      } else {
        const response = await api.get("/leave/all-leaveBalance");

        set((state) => ({
          leaveData: {
            ...state.leaveData,
            allLeaveBalances: response.data.balances,
          },
          loading: false,
          error: null,
        }));
      }
    } catch (error) {
      console.error("❌ Failed to fetch all leave balances:", error);
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch all leave balances",
      });
    }
  },

  fetchMyLeaveBalance: async (user) => {
    set({ loading: true, error: null });

    try {
      if (user.role == !"employee" || user.role == !"manager") {
        return;
      } else {
        const response = await api.get("/leave/my-leaveBalance");

        set((state) => ({
          leaveData: {
            ...state.leaveData,
            myLeaveBalances: response.data.balance,
          },
          loading: false,
          error: null,
        }));
      }
    } catch (error) {
      console.error("❌ Failed to fetch my leave balances:", error);
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch my leave balances",
      });
    }
  },

  // ✅ Optional: clear store
  // clearLeavesData: () =>
  //   set({
  //     leaveData: { totalLeavesData: [], MyLeaveData: [] },
  //     loading: false,
  //     error: null,
  //   }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
