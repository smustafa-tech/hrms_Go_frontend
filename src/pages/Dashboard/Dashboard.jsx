import React from "react";
import { useAuth } from "../../components/Context/AuthContext";
import AdminDashboard from "../../features/Dashboard/AdminDashboard";
import EmployeeDashboard from "../../features/Dashboard/EmployeeDashboard";
import HRDashboard from "../../features/Dashboard/HRDashboard";

const dashboardMap = {
  admin: AdminDashboard,
  hr: AdminDashboard,
  employee: EmployeeDashboard,
  manager: EmployeeDashboard,
};

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  const RoleDashboard = dashboardMap[user.role] || (() => <p>No dashboard</p>);

  return <RoleDashboard />;
}
