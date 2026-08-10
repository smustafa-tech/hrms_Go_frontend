import api from "./api";

const leaveService = {
  getAll: () => api.get("/leaves"),
  getById: (id) => api.get(`/leaves/${id}`),
  getByEmployee: (employeeId) => api.get(`/employees/${employeeId}/leaves`),
  create: (data) => api.post("/leave/apply-leave", data),
  update: (id, data) => api.put(`/leaves/${id}`, data),
  remove: (id) => api.delete(`/leaves/${id}`),

  // NEW: get calendar data (frontend-only demo)
  getCalendarData: async (year = new Date().getFullYear()) => {
    const res = await leaveService.getAll(); // fetch all leaves
    // filter leaves for the year
    return res.data.filter(l => 
      new Date(l.start).getFullYear() === year ||
      new Date(l.end).getFullYear() === year
    );
  }
};

export { leaveService };
