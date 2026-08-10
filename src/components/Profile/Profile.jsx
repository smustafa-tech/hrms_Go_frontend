import { useSettingsStore } from "@/store/settingsStore";
import styles from "./Profile.module.css";
import { useEffect } from "react";

export default function EmployeeProfileSelf() {
  const { profileData, fetchProfile } = useSettingsStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  console.log("Profile Data in Profile.jsx:", profileData);

  // ✅ FIX: Use API profile data instead of Auth user
  const emp = profileData?.Admin || profileData?.Employee || {};

  const fullName = `${emp?.firstName || ""} ${emp?.middleName || ""} ${
    emp?.lastName || ""
  }`.trim();

  // =============================
  // 🟢 Convert Buffer → Base64 URL
  // =============================
  let profilePhoto = null;

  if (emp?.photo?.data) {
    try {
      const base64String = btoa(
        emp.photo.data.reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      profilePhoto = `data:image/jpeg;base64,${base64String}`;
    } catch (err) {
      console.error("Image conversion error:", err);
    }
  }

  return (
    <div className={styles.container}>
      {/* TOP PROFILE HEADER */}
      <div className={styles.profileCard}>
        <div className={styles.avatarWrapper}>
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>{fullName.charAt(0)}</div>
          )}
        </div>

        <div className={styles.profileDetails}>
          <h2 className={styles.name}>{fullName}</h2>

          <span
            className={`${styles.status} ${
              emp?.status === "active"
                ? styles.active
                : emp?.status === "inactive"
                ? styles.inactive
                : styles.terminated
            }`}
          >
            {emp?.status || "—"}
          </span>
        </div>
      </div>

      {/* INFORMATION SECTIONS */}
      <div className={styles.infoGrid}>
        {/* PERSONAL INFO */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Personal Information</h3>

          <div className={styles.infoRow}>
            <span>Full Name</span>
            <p>{fullName}</p>
          </div>

          <div className={styles.infoRow}>
            <span>Aadhar Number</span>
            <p>{emp?.adharCard || "—"}</p>
          </div>

          <div className={styles.infoRow}>
            <span>Date of Joining</span>
            <p>{emp?.dateOfJoining || "—"}</p>
          </div>
        </div>

        {/* CONTACT INFORMATION */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Contact Information</h3>

          <div className={styles.infoRow}>
            <span>Email</span>
            <p>{emp?.email || "—"}</p>
          </div>

          <div className={styles.infoRow}>
            <span>Phone</span>
            <p>{emp?.phone || "—"}</p>
          </div>
        </div>

        {/* COMPANY INFO */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Company Information</h3>

          <div className={styles.infoRow}>
            <span>Employee ID</span>
            <p>{emp?.emp_id || "—"}</p>
          </div>

          <div className={styles.infoRow}>
            <span>Designation</span>
            <p>{emp?.designation || "—"}</p>
          </div>

          <div className={styles.infoRow}>
            <span>Department</span>
            <p>{emp?.department || "—"}</p>
          </div>

          <div className={styles.infoRow}>
            <span>Role</span>
            <p>{emp?.role || "—"}</p>
          </div>
        </div>

        {/* REPORTING */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Reporting</h3>

          <div className={styles.infoRow}>
            <span>Manager ID</span>
            <p>{emp?.mgrId || "—"}</p>
          </div>

          <div className={styles.infoRow}>
            <span>HR ID</span>
            <p>{emp?.hrId || "—"}</p>
          </div>
        </div>

        {/* WORK DETAILS */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Employment Details</h3>

          <div className={styles.infoRow}>
            <span>Work Mode</span>
            <p>{emp?.workMode || "—"}</p>
          </div>

          <div className={styles.infoRow}>
            <span>Status</span>
            <p>{emp?.status || "—"}</p>
          </div>
        </div>

        {/* SALARY */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Salary Information</h3>

          <div className={styles.infoRow}>
            <span>Salary</span>
            <p>{emp?.salary ? `₹ ${emp.salary}` : "Not Assigned"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
