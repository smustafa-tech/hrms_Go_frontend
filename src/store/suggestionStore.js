import { create } from "zustand";
import api from "@/Services/api";
import { toast } from "@/hooks/use-Toast";

export const useQueryStore = create((set, get) => ({
  queries: [],
  allQueries: [],
  unreadQueryCount: 0,
  loading: false,
  error: null,

  // Get unread query count
  getUnreadQueryCount: async () => {
    try {
      const res = await api.get("/queries/unread-count");
      set({ unreadQueryCount: res.data.count || 0 });
      return res.data.count || 0;
    } catch (error) {
      console.error("Error fetching unread query count:", error);
      return 0;
    }
  },

  // Fetch user's queries (for employees)
  fetchMyQueries: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/queries/my");
      set({ queries: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching queries:", error);
      set({ 
        error: error.response?.data?.message || "Failed to fetch queries", 
        loading: false 
      });
    }
  },

  // Fetch all queries (for HR/Admin/Manager)
  fetchAllQueries: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/queries/all");
      set({ allQueries: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching all queries:", error);
      set({ 
        error: error.response?.data?.message || "Failed to fetch queries", 
        loading: false 
      });
    }
  },

  // Submit new query
  submitQuery: async (queryData) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("subject", queryData.subject);
      formData.append("message", queryData.message);
      formData.append("priority", queryData.priority);
      
      if (queryData.attachment) {
        formData.append("attachment", queryData.attachment);
      }

      const res = await api.post("/queries", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      set(state => ({
        queries: [res.data, ...state.queries],
        loading: false
      }));

      toast({
        title: "Success",
        description: "Query submitted successfully!",
        variant: "success"
      });

      return { success: true };
    } catch (error) {
      console.error("Error submitting query:", error);
      const errorMsg = error.response?.data?.message || "Failed to submit query";
      
      set({ error: errorMsg, loading: false });
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive"
      });

      return { success: false, error: errorMsg };
    }
  },

  // Reply to query (for HR/Admin/Manager)
  replyToQuery: async (queryId, replyMessage) => {
    try {
      const res = await api.post(`/queries/${queryId}/reply`, {
        message: replyMessage
      });

      set(state => ({
        allQueries: state.allQueries.map(q => 
          q.id === queryId ? { ...q, replies: [...(q.replies || []), res.data] } : q
        )
      }));

      toast({
        title: "Success",
        description: "Reply sent successfully!",
        variant: "success"
      });

      return { success: true };
    } catch (error) {
      console.error("Error replying to query:", error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive"
      });
      return { success: false };
    }
  },

  // Close query (for HR/Admin/Manager)
  closeQuery: async (queryId) => {
    try {
      await api.patch(`/queries/${queryId}/close`);
      
      set(state => ({
        allQueries: state.allQueries.map(q => 
          q.id === queryId ? { ...q, status: 'closed' } : q
        )
      }));

      toast({
        title: "Success",
        description: "Query closed successfully!",
        variant: "success"
      });
    } catch (error) {
      console.error("Error closing query:", error);
      toast({
        title: "Error",
        description: "Failed to close query",
        variant: "destructive"
      });
    }
  },

  // Delete query
  deleteQuery: async (queryId) => {
    try {
      await api.delete(`/queries/${queryId}`);
      
      set(state => ({
        queries: state.queries.filter(q => q.id !== queryId)
      }));

      toast({
        title: "Success",
        description: "Query deleted successfully!",
        variant: "success"
      });
    } catch (error) {
      console.error("Error deleting query:", error);
      toast({
        title: "Error",
        description: "Failed to delete query",
        variant: "destructive"
      });
    }
  }
}));