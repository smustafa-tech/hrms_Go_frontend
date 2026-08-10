import React, { useState } from "react";
import DocumentUpload from "../../features/Documents/DocumentSubmit.jsx";
import DocumentReports from "../../features/Documents/DocumentReports.jsx";

import Styles from "./documents.module.css";

const DocumentDashboard = ({ userRole }) => {
  const [view, setView] = useState("upload"); // "upload" or "reports"

  return (
    <div className={Styles["dashboard-container"]}>
      <h1 className={Styles["dashboard-title"]}>Document Management</h1>

      {/* Navigation Buttons */}
      <div className={Styles["dashboard-nav"]}>
        <button
          onClick={() => setView("upload")}
          className={`${Styles["tab-btn"]} ${view === "upload" ? Styles.active : ""}`}
        >
          Submit Documents
        </button>

        {/* Role-based access to reports */}
        {(userRole === "manager" || userRole === "hr" || userRole === "admin") && (
          <button
            onClick={() => setView("reports")}
            className={`${Styles["tab-btn"]} ${view === "reports" ? Styles.active : ""}`}
          >
            Document Reports
          </button>
        )}
      </div>

      {/* View Section */}
      <div className={Styles["dashboard-view"]}>
        {view === "upload" && <DocumentUpload />}
        {view === "reports" && <DocumentReports />}
      </div>
    </div>
  );
};

export default DocumentDashboard;
