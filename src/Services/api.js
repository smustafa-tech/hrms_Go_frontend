// // src/services/api.js
// import axios from "axios";

// // Create Axios instance
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add request interceptor for attaching token dynamically
// api.interceptors.request.use(
//   (config) => {
//     const token = JSON.parse(localStorage.getItem("hrms_auth"))?.token;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;

// src/services/api.js
// src/services/api.js
// src/services/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://hrms-backend-production-7036.up.railway.app/api";

console.log(API_BASE_URL);
// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ send/receive cookies (refresh token)
});


// ------------------------------------------------------
// ✅ Response Interceptor - Auto Refresh Expired Token
// ------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired or invalid → refresh it once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Ask backend for new access token using refreshToken cookie
        const refreshRes = await api.post(
          '/refresh',
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data.token;

        if (!newToken) {
          throw new Error("No new token in refresh response");
        }

        // ✅ Save new token in localStorage
        const saved = JSON.parse(localStorage.getItem("hrms_auth"));
        if (saved) {
          saved.token = newToken;
          localStorage.setItem("hrms_auth", JSON.stringify(saved));
        }

        // Update headers globally
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // ✅ Retry the failed request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        // Only logout if refresh token is also invalid
        if (refreshErr.response?.status === 401) {
          localStorage.removeItem("hrms_auth");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// ------------------------------------------------------
// ✅ Request Interceptor - Attach Access Token
// ------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const saved = localStorage.getItem("hrms_auth");
    const authData = saved ? JSON.parse(saved) : null;
    const token = authData?.token;
    const slug = authData?.user?.slug || authData?.slug || authData?.user?.organization?.slug;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (slug) {
      config.headers['x-organization-slug'] = slug;
      config.headers['slug'] = slug;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



export default api;
