import { create } from "zustand";
import api from "@/Services/api"; // Your Axios instance
import { toast } from "@/hooks/use-Toast";

export const useKraKpiStore = create((set, get) => ({
  KraKpiData: {
    totalKraKpiList: [],
    MyKraKpiList: [],
  },
  loading: false,
  error: null,

  // ✅ Fetch all KRA/KPI from backend
  fetchAllKraKpi: async () => {
    set({ loading: true, error: null });
    try {
      console.log('🔄 Fetching all KRA/KPI data...');
      const response = await api.get("/kraKpi/getAllKraKpi");
      console.log('✅ KRA/KPI API Response:', response.data);
      
      const { allKraKpis } = response.data;
      console.log('📊 All KRA/KPIs:', allKraKpis);

      set({
        KraKpiData: { ...get().KraKpiData, totalKraKpiList: allKraKpis || [] },
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("❌ Failed to fetch KRA/KPI:", error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch KRA/KPI data",
      });
    }
  },

  fetchMyKraKpi: async (month, year) => {
    set({ loading: true, error: null });

    try {
      console.log('🔄 Fetching my KRA/KPI:', { month, year });
      const response = await api.get("/kraKpi/getMykraKpi", {
        params: { month, year },
      });
      console.log('✅ My KRA/KPI response:', response.data);
      
      const { kraKpiList } = response.data;

      set((state) => ({
        KraKpiData: {
          ...state.KraKpiData,
          MyKraKpiList: kraKpiList || [],
        },
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("❌ Failed to fetch My KRA/KPI:", error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch My KRA/KPI data",
      });
    }
  },

  fetchRating: async (kpiId, rating, comments) => {
    set({ loading: true, error: null });

    try {
      const data = { kpiId, rating, comments };
      console.log('🔄 Submitting rating:', data);
      const response = await api.post("/kraKpi/ratekraKpi", data);
      console.log('✅ Rating submitted:', response.data);

      set({ loading: false, error: null });
      
      toast({
        title: "Success",
        description: response.data.message || "Rating Submitted successfully",
        variant: "success",
      });
    } catch (error) {
      console.error('❌ Failed to submit rating:', error);
      
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to submit rating",
      });
      
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to submit rating",
        variant: "destructive",
      });
    }
  },

  // ✅ Optional: clear store
  clearKraKpiData: () =>
    set({
      KraKpiData: { totalKraKpiList: [], MyKraKpiList: [] },
      loading: false,
      error: null,
    }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
