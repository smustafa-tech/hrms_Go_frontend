import { useState } from "react";
import Sidebar from "../Sidebar/Sidebar"; // 👈 your sidebar component
import Topbar from "../Topbar/Topbar";
import { Outlet } from "react-router-dom";

export default function PrivateLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar on the left */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
