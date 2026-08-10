import { create } from "zustand";
// import employeeData from "../store/employees_part_1.json";
import api from "../Services/api.js";

export const useEmployeeStore = create((set, get) => ({
  employeesData: {
    totalEmployees: [],
    totalEmployeesCount: 0,
    activeEmployees: [],
    activeEmployeesCount: 0,
    inactiveEmployees: [],
    inactiveEmployeesCount: 0,
    departmentWiseCounts: {},
    departmentCounts: {},
  },
  // In useEmployeeStore.js
  allEmployeeAttendanceData: {
    todayPresentRecords: [],
    todayAbsentRecords: [],
    todayOnLeaveRecords: [],
    todayHalfDayRecords: [],
    lateArrivals: [],
    todayRecords: [],
    attendanceRecords: [],
    employeeMonthlySummary: {},
    employeeData: [],
    totalEmployees: 0,
  },
  loading: false,
  error: null,

  // 🔹 Fetch employees from API
  fetchEmployees: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.get("/employee/employees-data");

      const data = res.data;

      // Optional: compute derived data like active/inactive
      const activeEmployees = data.totalEmployees.filter(
        (emp) => emp.status?.toLowerCase() === "active"
      );
      const inactiveEmployees = data.totalEmployees.filter(
        (emp) => emp.status?.toLowerCase() !== "active"
      );
      const departmentCounts = data.totalEmployees.reduce((acc, emp) => {
        const dept = emp.department || "Unknown";
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});

      set({
        employeesData: {
          ...data,
          activeEmployees,
          activeEmployeesCount: activeEmployees.length,
          inactiveEmployees,
          inactiveEmployeesCount: inactiveEmployees.length,
          departmentWiseCounts: data.departmentWiseCounts,
          departmentCounts: departmentCounts,
        },
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching employees", err);
      set({ loading: false, error: err.message });
    }
  },

  // 🔹 Add a new employee
  addEmployee: (newEmployee) =>
    set((state) => {
      const updatedEmployees = [
        ...state.employeesData.totalEmployees,
        newEmployee,
      ];

      const activeEmployees = updatedEmployees.filter(
        (emp) => emp.status?.toLowerCase() === "active"
      ).length;

      const inactiveEmployees = updatedEmployees.filter(
        (emp) => emp.status?.toLowerCase() !== "active"
      ).length;

      const departmentCounts = updatedEmployees.reduce((acc, emp) => {
        const dept = emp.department || "Unknown";
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});

      return {
        employeesData: {
          ...state.employeesData,
          totalEmployees: updatedEmployees,
          totalEmployeesCount: updatedEmployees.length,
          activeEmployees,
          activeEmployeesCount: activeEmployees,
          inactiveEmployees,
          inactiveEmployeesCount: inactiveEmployees,
          departmentWiseCounts: departmentCounts,
        },
      };
    }),

  updateEmployeeInStore: async (id, updatedData) => {
    const employeesData = get().employeesData;

    const updatedEmployees = employeesData.totalEmployees.map((emp) =>
      emp.emp_id === id ? { ...emp, ...updatedData } : emp
    );

    const activeEmployees = updatedEmployees.filter(
      (emp) => emp.status?.toLowerCase() === "active"
    );
    const inactiveEmployees = updatedEmployees.filter(
      (emp) => emp.status?.toLowerCase() !== "active"
    );
    const departmentCounts = updatedEmployees.reduce((acc, emp) => {
      const dept = emp.department || "Unknown";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    set({
      employeesData: {
        ...employeesData,
        totalEmployees: updatedEmployees,
        activeEmployees,
        activeEmployeesCount: activeEmployees.length,
        inactiveEmployees,
        inactiveEmployeesCount: inactiveEmployees.length,
        departmentWiseCounts: departmentCounts,
      },
    });
  },

  // 🔹 Mock delete employee
  deleteEmployeeById: async (id) => {
    const employeesData = get().employeesData;

    const updatedEmployees = employeesData.totalEmployees.filter(
      (emp) => emp.emp_id !== id
    );

    const activeEmployees = updatedEmployees.filter(
      (emp) => emp.status?.toLowerCase() === "active"
    );
    const inactiveEmployees = updatedEmployees.filter(
      (emp) => emp.status?.toLowerCase() !== "active"
    );
    const departmentCounts = updatedEmployees.reduce((acc, emp) => {
      const dept = emp.department || "Unknown";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    set({
      employeesData: {
        ...employeesData,
        totalEmployees: updatedEmployees,
        totalEmployeesCount: updatedEmployees.length,
        activeEmployees,
        activeEmployeesCount: activeEmployees.length,
        inactiveEmployees,
        inactiveEmployeesCount: inactiveEmployees.length,
        departmentWiseCounts: departmentCounts,
      },
    });

    // ✅ Return something so res is not undefined
    return { message: "Employee deleted successfully" };
  },

  // 🔹 Fetch attendance data from backend
  fetchAttendanceRecords: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.get("/attendance/all-employee-attendance");
      const data = res.data;

      set({
        allEmployeeAttendanceData: data,
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching attendance records:", err);
      set({ loading: false, error: err.message });
    }
  },

  fetchMyAttendanceRecords: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/attendance/own-attendance");
      const data = res.data;

      console.log("Fetched attendance records:", data);
      set({
        allEmployeeAttendanceData: {
          ...get().allEmployeeAttendanceData,
          attendanceRecords: data.attendanceRecords,
          employeeMonthlySummary: data.employeeMonthlySummary,
          todayRecords: data.todayRecord,
        },
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching my attendance records:", err);
      set({ loading: false, error: err.message });
    }
  },

  fetchEmployeeData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/attendance/employee-data");
      const data = res.data;

      console.log("Fetched attendance records:", data);

      set({
        allEmployeeAttendanceData: {
          ...get().allEmployeeAttendanceData,
          employeeData: data,
          totalEmployees: data.length,
        },
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching employee data:", err);
      set({ loading: false, error: err.message });
    }
  },

  // ✅ Action to mark attendance (fetch first, then update)
  // markAttendance: async (empId, status, user) => {
  //   try {
  //     // const date = new Date().toISOString().split("T")[0];
  //     const date = new Date();
  //     const data = { userId: empId, date, status };

  //     // 1️⃣ Send to backend
  //     if (user.role === "admin" || user.role === "hr") {
  //       const res = await api.post("/attendance/admin-mark", data);

  //       if (res?.status === 200 || res?.status === 201) {
  //         console.log("✅ Attendance marked:", res.data);

  //         // ✅ Get current store snapshot
  //         const state = get();

  //         // ✅ Create updated todayRecords array
  //         const updatedTodayRecords =
  //           state.allEmployeeAttendanceData.todayRecords.map((record) =>
  //             record.userId === empId ? { ...record, status } : record
  //           );

  //         // ✅ Update Zustand store immutably
  //         set({
  //           allEmployeeAttendanceData: {
  //             ...state.allEmployeeAttendanceData,
  //             todayRecords: updatedTodayRecords,
  //           },
  //         });

  //         console.log("✅ Zustand updated with new attendance status");
  //       } else {
  //         console.error("❌ Failed to mark attendance:", res?.data?.message);
  //         alert(res?.data?.message || "Failed to mark attendance");
  //       }
  //     } else {
  //       console.log("i am from else......");
  //       const res = await api.post("/attendance/mark", data);

  //       if (res?.status === 200 || res?.status === 201) {
  //         console.log("✅ Attendance marked:", res.data);

  //       } else {
  //         console.error("❌ Failed to mark attendance:", res?.data?.message);
  //         alert(res?.data?.message || "Failed to mark attendance");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("🚨 Error in markAttendance:", error);
  //     alert("Network or server error while marking attendance.");
  //   }
  // },

  markAttendance: async (empId, status, user, action) => {
    try {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60000;
      const date = new Date(now - offsetMs).toISOString().slice(0, -1);

      if (user.role === "admin" || user.role === "hr") {
        const data = { userId: empId, date, status };
        const res = await api.post("/attendance/admin-mark", data);

        if (res?.status === 200 || res?.status === 201) {
          console.log("✅ Attendance marked:", res.data);

          // ✅ Extract clean attendance object
          const newAttendance = res.data?.attendance;
          if (!newAttendance) {
            console.warn("⚠️ No attendance data returned from backend.");
            return;
          }

          // ✅ Get current state
          const state = get();
          const existingRecords =
            state.allEmployeeAttendanceData?.todayRecords || [];

          // ✅ Check if the record already exists
          const recordExists = existingRecords.some(
            (r) => r.userId === newAttendance.userId
          );

          let updatedTodayRecords;

          if (recordExists) {
            // 🟢 Update existing record’s status only
            updatedTodayRecords = existingRecords.map((r) =>
              r.userId === newAttendance.userId
                ? { ...r, status: newAttendance.status }
                : r
            );
          } else {
            // 🟡 Add new record (attendance only)
            const cleanRecord = {
              checkIn: newAttendance.checkIn,
              checkOut: newAttendance.checkOut,
              date: newAttendance.date,
              userId: newAttendance.userId,
              status: newAttendance.status,
              id: newAttendance.id,
              Employee: newAttendance.Employee,
            };

            updatedTodayRecords = [...existingRecords, cleanRecord];
          }

          // ✅ Update Zustand store immutably
          set((state) => ({
            allEmployeeAttendanceData: {
              ...state.allEmployeeAttendanceData,
              todayRecords: updatedTodayRecords,
            },
          }));

          console.log("✅ Zustand updated with new attendance data");
        } else {
          console.error("❌ Failed to mark attendance:", res?.data?.message);
          alert(res?.data?.message || "Failed to mark attendance");
        }
      } else {
        console.log("i am from else......");
        const data = { userId: empId, date, status, action };

        const res = await api.post("/attendance/mark", data);

        if (res?.status === 200 || res?.status === 201) {
          console.log("✅ Attendance marked:", res.data);
        } else {
          console.error("❌ Failed to mark attendance:", res?.data?.message);
          alert(res?.data?.message || "Failed to mark attendance");
        }
      }
    } catch (error) {
      console.error("🚨 Error in markAttendance:", error);
      alert("Network or server error while marking attendance.");
    }
  },

  // 🔹 Mock toggle status
  // toggleStatus: async (id) => {
  //   set({
  //     employees: get().employees.map((emp) =>
  //       emp.id === id ? { ...emp, active: !emp.active } : emp
  //     ),
  //   });
  // },
}));
