import React, { useState } from "react";
import Styles from "./KraKpi.module.css";

import KraKpiForm from "@/features/Kra-Kpi's/KraKpiForm";
import KraKpiReport from "@/features/Kra-Kpi's/KraReports"; // adjust actual path

const KraKpiDashboard = ({ userRole }) => {
  const [view, setView] = useState("myKraKpi");

  return (
    <div className={Styles["dashboard-container"]}>
      {/* Navigation Buttons */}
      <div className={Styles["dashboard-nav"]}>
        {(userRole === "manager" ||
          userRole === "hr" ||
          userRole === "admin") && (
          <>
            <button
              onClick={() => setView("viewAll")}
              className={Styles["tab-btn"]}
            >
              View All KRA/KPI
            </button>
            <button
              onClick={() => setView("stats")}
              className={Styles["tab-btn"]}
            >
              Statistics
            </button>
          </>
        )}
      </div>
      {/* View Section */}
      {view === "myKraKpi" && <KraKpiForm />}
      {/* {view === "viewAll" && <AllKraKpiTable />} */}
      {/* {view === "stats" && <KraKpiStats />} */}
      {view === "stats" && <KraKpiReport />}
    </div>
  );
};

export default KraKpiDashboard;
