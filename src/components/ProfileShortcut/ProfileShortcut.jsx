import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, Moon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/Context/AuthContext";
import { useSettingsStore } from "@/store/settingsStore";
import styles from "./ProfileShortcut.module.css";

export default function ProfileShortcut({ onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // ------------------------------------------
  // 🔥 FETCH PROFILE (same as Profile.jsx)
  // ------------------------------------------
  const { profileData, fetchProfile } = useSettingsStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const emp = profileData?.Admin || profileData?.Employee || {};

  // ------------------------------------------
  // 🔥 NAME + ROLE (use AuthContext for role)
  // ------------------------------------------
  const fullName = `${emp?.firstName || ""} ${
    emp?.middleName || ""
  } ${emp?.lastName || ""}`.trim();

  // Use role from AuthContext, fallback to profile data
  const userRole = user?.role || emp?.designation || emp?.role || "Employee";

  // ------------------------------------------
  // 🔥 BUFFER → BASE64 IMAGE (same as Profile.jsx)
  // ------------------------------------------
  let profilePhoto = null;

  if (emp?.photo?.data) {
    try {
      const base64String = btoa(
        emp.photo.data.reduce(
          (acc, byte) => acc + String.fromCharCode(byte),
          ""
        )
      );
      profilePhoto = `data:image/jpeg;base64,${base64String}`;
    } catch (err) {
      console.error("ProfileShortcut image conversion error:", err);
    }
  }

  // ------------------------------------------
  //   CLOSE ON OUTSIDE CLICK
  // ------------------------------------------
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ------------------------------------------
  //   ROUTES
  // ------------------------------------------
  const goToProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const goToSettings = () => {
    setOpen(false);
    navigate("/settings");
  };

  const handleLogoutClick = async () => {
    setOpen(false);
    if (typeof onLogout === "function") await onLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.wrapper} ref={menuRef}>
      {/* OPEN BUTTON */}
      <button className={styles.userButton} onClick={() => setOpen(!open)}>
        {profilePhoto ? (
          <img src={profilePhoto} className={styles.avatarSmall} alt="profile" />
        ) : (
          <User size={20} className={styles.userIcon} />
        )}
      </button>

      {/* POPUP MENU */}
      {open && (
        <div className={styles.menu}>
          {/* HEADER */}
          <div className={styles.header}>
            {profilePhoto ? (
              <img src={profilePhoto} className={styles.avatarLarge} alt="profile" />
            ) : (
              <div className={styles.avatarFallback}>
                {fullName ? fullName.charAt(0) : "U"}
              </div>
            )}

            <div>
              <h4 className={styles.name}>{fullName || user?.email || "User"}</h4>
              <p className={styles.role}>{userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || "Employee"}</p>
            </div>
          </div>

          {/* MENU */}
          <div className={styles.section}>
            <button className={styles.menuItem} onClick={goToProfile}>
              <User size={18} />
              <span>Profile</span>
            </button>

            <button className={styles.menuItem}>
              <Moon size={18} className={styles.darkIcon} />
              <span>Theme</span>
            </button>

            <button className={styles.menuItem} onClick={goToSettings}>
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>

          {/* LOGOUT */}
          <div className={styles.section}>
            <button
              className={`${styles.menuItem} ${styles.logout}`}
              onClick={handleLogoutClick}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
