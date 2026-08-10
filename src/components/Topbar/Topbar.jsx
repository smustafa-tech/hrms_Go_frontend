import { Bell, Search } from "lucide-react";
import PropTypes from "prop-types";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import ProfileShortcut from "../ProfileShortcut/ProfileShortcut";
import { useNotificationsStore } from "@/store/notificationsStore";

import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import styles from "./Topbar.module.css";
import { useAuth } from "../Context/AuthContext";
import { useEffect } from "react";

export default function Topbar({ title, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount, fetchUnreadCount } = useNotificationsStore();

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const handleLogout = async () => {
    try {
      await logout(); // clear token, clear context
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className={styles.topbar}>
      {/* Left: Logo when collapsed */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {collapsed && (
          <Link to="/dashboard" className={styles.logo}>
            <img src={logo} className={styles.logoIcon} alt="logo" />
            <span className={styles.logoText}>Lean.HR</span>
          </Link>
        )}
      </div>

      {/* Page Title */}
      <div className={styles.title}>
        {title && <h1 className={styles.titleText}>{title}</h1>}
      </div>

      {/* Right Actions */}
      <div className={styles.actions}>
        {/* Search */}
        <div className={styles.searchContainer}>
          {/* <Search className={styles.searchIcon} /> */}
          {/* <input placeholder="Search..." className={styles.searchInput} /> */}
        </div>

        {/* Notifications */}
        <button 
          className={styles.notificationButton}
          onClick={() => navigate('/notifications')}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className={styles.notificationBadge}>{unreadCount}</span>
          )}
        </button>

        {/* User Popup */}
        <ProfileShortcut
          user={user} // User data coming from AuthContext
          onLogout={handleLogout}
          // Full logout + redirect logic
        />
      </div>
    </header>
  );
}

Topbar.propTypes = {
  title: PropTypes.string,
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
