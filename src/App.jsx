import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth pages
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";

// Dashboard & core modules
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees"; // ✅ fixed typo

import Attendance from "./pages/Attendance/Attendance";
import KraKpiDashboard from "./pages/KraKpi/KraKpi";
import Profile from "./components/Profile/Profile";
// import KraKpiForm from "./features/Kra-Kpi's/KraKpiForm";
import KraKpiReport from "./features/Kra-Kpi's/KraReports";
import Notifications from "./pages/Notifications/Notifications";
import Settings from "./pages/Settings/Settings";

import DocumentDashboard from "./pages/Documents/documents";
import DocumentSubmit from "../src/features/Documents/DocumentSubmit";
import DocumentReports from "../src/features/Documents/DocumentReports";


import Payroll from "./pages/Payroll/Payroll";
// Contexts

import { AuthProvider } from "./components/Context/AuthContext";
import { ThemeProvider } from "./components/Context/ThemeContext";
import { Toaster } from "./components/ui/Toaster";

// Layouts & routes
import PrivateRoute from "./components/Routes/PrivateRoute";
import PrivateLayout from "./components/Layouts/PrivateLayout";
import PublicLayout from "./components/Layouts/PublicLayout";



// Leave Management (Admin)
import Leaves from "./pages/leaves/Leaves";
import Queries from "./pages/Queries";
import AdminQueries from "./pages/AdminQueries";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Private routes */}
            <Route
              element={
                <PrivateRoute>
                  <PrivateLayout />
                </PrivateRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />

              <Route path="/profile" element={<Profile />} />

              <Route path="/notifications" element={<Notifications />} />
               <Route path="/Payroll" element={<Payroll />} /> 
              <Route path="/kraKpi" element={<KraKpiDashboard />} />
              {/* <Route path="/kraKpiForm" element={<KraKpiForm />} /> */}
              <Route path="/kra-reports" element={<KraKpiReport />} />
              {/* 

              

         {/* Documents  */}
              <Route path="/documents" element={< DocumentDashboard />} />
              <Route path="/DocumentSubmit" element={<DocumentSubmit />}/>
                <Route path="/DocumentReports" element={<DocumentReports />}/>

              {/* Leave Management */}
              <Route path="/leaves" element={<Leaves />} />

              {/* Queries */}
              <Route path="/queries" element={<Queries />} />
              <Route path="/admin-queries" element={<AdminQueries />} />

              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
