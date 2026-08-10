// src/store/attendanceStore.js
import { create } from "zustand";

import api from "@/Services/api"; // import your API instance

const useAttendanceStore = create((set) => ({
  attendanceStatus: {}, // { empId: status }

  // ✅ Action to mark attendance (fetch first, then update)
  markAttendance: async (empId, status, user) => {
    try {
      // const date = new Date().toISOString().split("T")[0];
      const date = new Date();
      const data = { userId: empId, date, status };

      

      // 1️⃣ Send to backend
      if (user.role === "admin" || user.role === "hr") {
        const res = await api.post("/attendance/admin-mark", data);

        if (res?.status === 200 || res?.status === 201) {
          console.log("✅ Attendance marked:", res.data);

          // 2️⃣ Only update Zustand after successful API
          set((state) => ({
            attendanceStatus: {
              ...state.attendanceStatus,
              [empId]: status,
            },
          }));
        } else {
          console.error("❌ Failed to mark attendance:", res?.data?.message);
          alert(res?.data?.message || "Failed to mark attendance");
        }
      } else {
        console.log("i am from else......");
        const res = await api.post("/attendance/mark", data);

        if (res?.status === 200 || res?.status === 201) {
          console.log("✅ Attendance marked:", res.data);

          // 2️⃣ Only update Zustand after successful API
          set((state) => ({
            attendanceStatus: {
              ...state.attendanceStatus,
              [empId]: status,
            },
          }));
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
}));

export default useAttendanceStore;
