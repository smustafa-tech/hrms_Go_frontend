import { create } from "zustand";
import api from "@/Services/api"; // Your Axios instance

export const useNotificationsStore = create((set, get) => ({
  notificationsData: [],
  loading: false,
  error: null,
  unreadCount: 0,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/notifications/");
      const data = res.data.notifications || res.data;

      set({ notificationsData: data, loading: false });
    } catch (err) {
      console.error("Error fetching notifications:", err);
      set({ loading: false, error: err.message });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      const count = res.data.unreadCount || res.data.count || 0;
      set({ unreadCount: count });
      return count;
    } catch (err) {
      console.error("Error fetching unread count:", err);
      set({ unreadCount: 0 });
      return 0;
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      get().fetchNotifications();
      get().fetchUnreadCount();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch("/notifications/read-all");
      get().fetchNotifications();
      get().fetchUnreadCount();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  },

  getUnreadCount: async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      const count = res.data.unreadCount || res.data.count || 0;
      return { data: { unreadCount: count } };
    } catch (err) {
      console.error("Error getting unread count:", err);
      return { data: { unreadCount: 0 } };
    }
  },
}));
