import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import logo from "/logo.png";
import {
  LayoutDashboard,
  Users,
  Clock,
  DollarSign,
  Calendar,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  UserCheck,
  Briefcase,
  BarChart3,
  Shield,
  Menu,
  FileText,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useNotificationsStore } from "@/store/notificationsStore";
import { useQueryStore } from "@/store/suggestionStore";
import styles from "./Sidebar.module.css";

export default function Sidebar({ className, collapsed, setCollapsed }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [openMenus, setOpenMenus] = useState({});
  const { getUnreadCount } = useNotificationsStore();
  const { getUnreadQueryCount } = useQueryStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadQueryCount, setUnreadQueryCount] = useState(0);

  const navigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "hr", "employee", "manager"],
    },
    {
      title: "Employees",
      href: "/employees",
      icon: Users,
      roles: ["admin", "hr"],
    },
    {
      title: "Attendance",
      href: "/attendance",
      icon: Clock,
      roles: ["admin", "hr", "employee", "manager"],
    },
   {
    title : "Payroll",
    href: "/payroll",
    icon: DollarSign,
    roles: ["admin", "hr", "manager", "employee"],
  },
  
    {
      title: "Leaves",
      href: "/leaves",
      icon: Calendar,
      roles: ["admin", "hr", "employee", "manager"],
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
      badge: "0",
      roles: ["admin", "hr", "employee", "manager"],
    },
    {
      title: "KRA-KPI'S",
      icon: Shield,
      roles: ["admin", "hr", "employee", "manager"],
      children: [
        {
          title: "Kra-Kpi",
          href: "/kraKpi",
          roles: ["admin", "manager", "hr", "employee"],
        },
        {
          title: "Reports",
          href: "/kra-reports",
          roles: ["admin", "manager", "hr"],
        },
      ],
    },
    {
      title: "Documents",
      href: "/documents",
      icon: FileText, 
      roles: ["admin", "hr", "manager", "employee"],
      children: [
        { title: "Submit Documents", href: "/DocumentSubmit" },
        { 
          title: "Employee Documents", 
          href: "/DocumentReports",
          roles: ["admin", "hr", "manager"], // ✅ only for these roles
        },
      ],
    },
    {
      title: user?.role === "employee" ? "Raise a Query" : "Queries",
      href: user?.role === "employee" ? "/queries" : "/admin-queries",
      icon: HelpCircle,
      badge: user?.role !== "employee" ? "query" : null,
      roles: ["admin", "hr", "employee", "manager"],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["admin", "hr", "employee", "manager"],
    },
  ];

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count.data.unreadCount);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };
    
    const fetchUnreadQueryCount = async () => {
      try {
        const count = await getUnreadQueryCount();
        setUnreadQueryCount(count);
      } catch (error) {
        console.error("Error fetching unread query count:", error);
      }
    };
    
    fetchUnreadCount();
    fetchUnreadQueryCount();
  }, [getUnreadCount, getUnreadQueryCount]);

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const filteredNavigation = navigation.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const sidebarClasses = `${styles.sidebar} ${
    collapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
  } ${className || ""}`;

  return (
    <aside className={sidebarClasses}>
      {/* Header */}
      <div className={styles.header}>
        {!collapsed && (
          <Link to="/dashboard" className={styles.logo}>
            <div>
              <img src={logo} className={styles.logoIcon} alt="" />
            </div>
            <span className={styles.logoText}>Lean.HR</span>
          </Link>
        )}
        <button
          className={`${styles.toggleButton} ${
            collapsed
              ? styles.toggleButtonCollapsed
              : styles.toggleButtonExpanded
          }`}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.navList}>
          {filteredNavigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/dashboard" &&
                location.pathname.startsWith(item.href));

            const navItemClasses = `${styles.navItem} ${
              isActive ? styles.navItemActive : styles.navItemInactive
            } ${collapsed ? styles.navItemCollapsed : ""}`;

            if (item.children) {
              const isOpen = openMenus[item.title];
              return (
                <div key={item.title} className={styles.dropdown}>
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`${styles.navItem} ${
                      collapsed ? styles.navItemCollapsed : ""
                    }`}
                  >
                    <item.icon
                      className={`${styles.navIcon} ${
                        !collapsed ? styles.navIconExpanded : ""
                      }`}
                    />
                    {!collapsed && (
                      <>
                        <span className={styles.navText}>{item.title}</span>
                        {isOpen ? (
                          <ChevronDown
                            size={14}
                            className={styles.dropdownIcon}
                          />
                        ) : (
                          <ChevronRight
                            size={14}
                            className={styles.dropdownIcon}
                          />
                        )}
                      </>
                    )}
                  </button>

                  {isOpen && !collapsed && (
                    <div className={styles.subMenu}>
                      {item.children
                        .filter(
                          (child) =>
                            !child.roles ||
                            (user && child.roles.includes(user.role))
                        )
                        .map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`${styles.subNavItem} ${
                              location.pathname === child.href
                                ? styles.subNavActive
                                : styles.subNavInactive
                            }`}
                          >
                            <span className={styles.subNavText}>
                              {child.title}
                            </span>
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.href} to={item.href} className={navItemClasses}>
                <item.icon
                  className={`${styles.navIcon} ${
                    !collapsed ? styles.navIconExpanded : ""
                  }`}
                />
                {!collapsed && (
                  <>
                    <span className={styles.navText}>{item.title}</span>
                    {item.badge === "query" && unreadQueryCount > 0 && (
                      <span className={styles.navBadge}>{unreadQueryCount}</span>
                    )}
                    {item.badge === "0" && unreadCount > 0 && (
                      <span className={styles.navBadge}>{unreadCount}</span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      {!collapsed && user && (
        <div className={styles.userInfo}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              <UserCheck size={16} />
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>
                {user.email} {user.lastName}
              </p>
              <p className={styles.userRole}>{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {collapsed && user && (
        <div className={styles.userInfo}>
          <div className={styles.userProfile}>
            <button onClick={logout} className={styles.userAvatar}>
              <LogOut size={16} className={styles.logoutIcon} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

Sidebar.propTypes = {
  className: PropTypes.string,
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
