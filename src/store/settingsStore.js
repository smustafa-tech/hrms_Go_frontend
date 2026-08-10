import { create } from "zustand";
import api from "@/Services/api";
import { toast } from "@/hooks/use-Toast";

export const useSettingsStore = create((set, get) => ({
  companyData: {},

  profileData: {},

  loadingProfile: false,
  profileError: null,

  notificationSettings: {
    emailNotifications: true,
    pushNotifications: false,
    leaveRequests: true,
    attendanceAlerts: true,
  },
  securitySettings: {
    twoFactorAuth: false,
    sessionTimeout: "60",
  },
  systemSettings: {
    theme: "light",
    language: "en",
  },

  // Fetch profile data
  fetchProfile: async () => {
    set({ loadingProfile: true, profileError: null });

    try {
      console.log('🔄 Fetching profile data...');
      const res = await api.get("/users/me");
      console.log('✅ Profile data fetched:', res.data);
      
      set({
        profileData: res.data.profile || res.data,
        loadingProfile: false,
      });
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      set({
        loadingProfile: false,
        profileError: error.response?.data?.message || error.message || "Failed to load profile",
      });
    }
  },

  uploadProfilePhoto: async (id, file) => {
    try {
      console.log('🔄 Uploading profile photo for ID:', id);
      console.log('📁 File details:', { name: file.name, size: file.size, type: file.type });
      
      const formData = new FormData();
      formData.append("photo", file);
      
      const res = await api.put("/users/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log('✅ Photo upload response:', res.data);
      return { success: true };
    } catch (error) {
      console.error('❌ Error uploading photo:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return { success: false, error };
    }
  },
  // 👉 Update Profile (Save Changes)
  updateProfile: async () => {
    try {
      const profileData = get().profileData;
      console.log('🔄 Updating profile, current data:', profileData);
      
      const roleKey = profileData.Admin ? "Admin" : "Employee";
      console.log('📋 Role key:', roleKey);
      
      const roleData = profileData[roleKey];
      if (!roleData) {
        console.error('❌ No profile data found for role:', roleKey);
        return { success: false, error: 'No profile data found' };
      }

      // Extract only editable fields
      const updatedFields = (({ firstName, middleName, lastName, email, phone, adharCard, designation, bio }) =>
        ({ firstName, middleName, lastName, email, phone, adharCard, designation, bio }))(roleData);
      
      console.log('📝 Fields to update:', updatedFields);

      const response = await api.put("/users/update", updatedFields);
      console.log('✅ Profile update response:', response.data);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      return { success: false };
    }
  },

  // 👉 Update Password
  updatePassword: async (passwordData) => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return { success: false };
    }

    try {
      console.log('🔄 Updating password...');
      const response = await api.put("/users/change-password", passwordData);
      console.log('✅ Password update response:', response.data);
      
      toast({ 
        title: "Success",
        description: "Password updated successfully", 
        variant: "success" 
      });
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating password:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      toast({ 
        title: "Error",
        description: error.response?.data?.message || "Failed to update password", 
        variant: "destructive" 
      });
      return { success: false };
    }
  },

  setProfileField: (field, value) => {
    set((state) => {
      const role = state.profileData.Admin ? "Admin" : "Employee";
      return {
        profileData: {
          ...state.profileData,
          [role]: {
            ...state.profileData[role],
            [field]: value,
          },
        },
      };
    });
  },

  // Notification settings methods
  setNotificationSettings: (settings) => {
    set({ notificationSettings: settings });
  },

  fetchNotificationSettings: async () => {
    try {
      const res = await api.get("/users/notifications");
      set({ notificationSettings: res.data });
      return { success: true };
    } catch (error) {
      console.error('❌ Error fetching notification settings:', error);
      return { success: false, error };
    }
  },

  updateNotificationSettings: async () => {
    try {
      const { notificationSettings } = get();
      await api.put("/users/notifications", notificationSettings);
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating notification settings:', error);
      return { success: false, error };
    }
  },

  // Security settings methods
  setSecuritySettings: (settings) => {
    set({ securitySettings: settings });
  },

  fetchSecuritySettings: async () => {
    try {
      const res = await api.get("/users/security-settings");
      set({ securitySettings: res.data });
      return { success: true };
    } catch (error) {
      console.error('❌ Error fetching security settings:', error);
      return { success: false, error };
    }
  },

  updateSecuritySettings: async () => {
    try {
      const { securitySettings } = get();
      await api.put("/users/security-settings", securitySettings);
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating security settings:', error);
      return { success: false, error };
    }
  },
}));
