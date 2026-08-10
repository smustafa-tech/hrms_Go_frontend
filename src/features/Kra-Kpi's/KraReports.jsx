import React, { useState, useEffect, useMemo } from "react";
// import api from "@/Services/api";
import Styles from "./KraReports.module.css";
import {
  FaUserCheck,
  FaClock,
  FaStar,
  FaChartLine,
  FaSearch,
  FaTimes,
  FaEye,
} from "react-icons/fa";

import { useAuth } from "@/components/Context/AuthContext";
import { useKraKpiStore } from "@/store/kraKpiStore";

import { Button } from "@/components/ui/Button";
import { toast } from "@/hooks/use-Toast";

// --- Main Report Component ---
const KraKpiReport = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const { KraKpiData, fetchAllKraKpi, loading, error, fetchRating } =
    useKraKpiStore();

  useEffect(() => {
    fetchAllKraKpi();
  }, [fetchAllKraKpi]);

  const { user } = useAuth();
  const userRole = user?.role || "";

  console.log("from kra report", KraKpiData);
  // --- State Management ---
  // const [kpiData, setKpiData] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  // const [userRole, setUserRole] = useState("");
  const [filter, setFilter] = useState({
    month: currentMonth,
    year: currentYear,
  });

  // Rating modal
  const [modal, setModal] = useState({ isOpen: false, currentKpi: null });
  const [ratingInput, setRatingInput] = useState({
    kpiId: 0,
    rating: 0,
    comments: "",
  });
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // --- View Modal (New) ---
  const [viewModal, setViewModal] = useState({ isOpen: false, kraData: null });

  // --- Month & Year Options ---
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i);

  // --- Auto Refresh + Role Detection ---
  // useEffect(() => {
  //   const roleFromStorage = user.role;
  //   if (!roleFromStorage) return;

  //   if (["hr", "admin", "manager"].includes(roleFromStorage)) {
  //     const interval = setInterval(
  //       () => fetchAllKraKpi(roleFromStorage),
  //       10000
  //     );
  //     return () => clearInterval(interval);
  //   }
  // }, []);

  // --- Handle Filter Change ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: Number(value) }));
  };

  // const handleFilterSubmit = () => {
  //   fetchAllKraKpi(userRole, filter.month, filter.year);
  // };

  // --- Search Filtering ---
  const filteredKpiData = useMemo(() => {
    if (!KraKpiData?.totalKraKpiList || !Array.isArray(KraKpiData.totalKraKpiList)) {
      return [];
    }
    
    return KraKpiData.totalKraKpiList.filter(
      (item) =>
        item.month === filter.month &&
        item.year === filter.year &&
        ((item.user?.Employee?.firstName || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.user?.Employee?.emp_id || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          !searchTerm)
    );
  }, [KraKpiData?.totalKraKpiList, filter.month, filter.year, searchTerm]);

  // --- Stats ---
  const stats = useMemo(() => {
    if (!KraKpiData?.totalKraKpiList || !Array.isArray(KraKpiData.totalKraKpiList)) {
      return { totalSubmitted: 0, pending: 0, rated: 0, avgRating: "N/A" };
    }
    
    const totalSubmitted = KraKpiData.totalKraKpiList.length;
    const pending = KraKpiData.totalKraKpiList.filter(
      (item) => item.status === "PENDING"
    ).length;
    const rated = totalSubmitted - pending;
    const ratedItems = KraKpiData.totalKraKpiList.filter(
      (item) => item.status === "RATED" && item.rating > 0
    );
    const avgRating =
      ratedItems.length > 0
        ? (
            ratedItems.reduce((acc, item) => acc + item.rating, 0) /
            ratedItems.length
          ).toFixed(1)
        : "N/A";
    return { totalSubmitted, pending, rated, avgRating };
  }, [KraKpiData?.totalKraKpiList]);

  // --- Rating Modal Logic ---
  const openRatingModal = (kpiItem) => {
    setModal({ isOpen: true, currentKpi: kpiItem });

    setRatingInput({
      kpiId: kpiItem.id,
      rating: kpiItem.rating || 0,
      comments: kpiItem.comments || "",
    });
  };

  const closeRatingModal = () => {
    setModal({ isOpen: false, currentKpi: null });
    setRatingInput({ rating: 0, comments: "" });
    setIsSubmittingRating(false);
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();

    const numericRating = Number(ratingInput.rating);

    console.log(numericRating);

    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      toast({
        title: "Invalid Rating",
        description: "Please select a number between 1 and 5",
        variant: "destructive",
      });
      return;
    }

    console.log("employee Id", ratingInput);
    console.log("comments", ratingInput.comments);

    setIsSubmittingRating(true);
    await fetchRating(ratingInput.kpiId, numericRating, ratingInput.comments);

    fetchAllKraKpi();
    setRatingInput({});
    closeRatingModal();
  };

  // --- View KRA Modal Logic (New) ---
  const openViewModal = (kraItem) => {
    setViewModal({ isOpen: true, kraData: kraItem });
  };

  const closeViewModal = () => {
    setViewModal({ isOpen: false, kraData: null });
  };

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (modal.isOpen) closeRatingModal();
        if (viewModal.isOpen) closeViewModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [modal.isOpen, viewModal.isOpen]);

  return (
    <div className={Styles.container}>
      <h2 className={Styles.title}>KRA/KPI Performance Report</h2>
      {loading && (
        <p className={Styles["loading-text"]}>Loading KRA/KPI Reports...</p>
      )}

      {/* --- Stats --- */}
      <div className={Styles.statsGrid}>
        {[
          {
            icon: <FaUserCheck />,
            color: "#0ea5e9",
            label: "Total Submitted",
            value: stats.totalSubmitted,
          },
          {
            icon: <FaClock />,
            color: "#f59e0b",
            label: "Pending Review",
            value: stats.pending,
          },
          {
            icon: <FaStar />,
            color: "#22c55e",
            label: "Rated",
            value: stats.rated,
          },
          {
            icon: <FaChartLine />,
            color: "#ef4444",
            label: "Average Rating",
            value: stats.avgRating,
          },
        ].map((s, i) => (
          <div key={i} className={Styles.statCard}>
            <span className={Styles.statIcon} style={{ color: s.color }}>
              {s.icon}
            </span>
            <div>
              <h4>{s.value}</h4>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- Filters & Search --- */}
      <div className={Styles.controls}>
        <div className={Styles.searchWrapper}>
          <FaSearch className={Styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by employee name..."
            className={Styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={Styles.filterWrapper}>
          <select name="year" value={filter.year} onChange={handleFilterChange}>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            name="month"
            value={filter.month}
            onChange={handleFilterChange}
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
          <Button
            onClick={() => {
              fetchAllKraKpi();
            }}
          >
            Apply Filter
          </Button>
        </div>
      </div>

      {/* --- Table --- */}
      <div className={Styles.tableContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{color: 'red'}}>Error: {error}</p>
        ) : !KraKpiData?.totalKraKpiList ? (
          <p>No data available</p>
        ) : filteredKpiData.length === 0 ? (
          <p>No records found for the selected period</p>
        ) : (
          <table className={Styles.kpiTable}>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Title</th>
                <th>Target</th>
                <th>Achieved</th>
                <th>Status</th>
                <th>Rate</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredKpiData.map((item) => {
                // Debug: Log the item structure
                console.log('KRA Item structure:', item);
                
                // Correct path based on backend: item.user.Employee.firstName
                const employeeName = 
                  item.user?.Employee?.firstName || 
                  'N/A';
                  
                const employeeLastName = 
                  item.user?.Employee?.lastName || 
                  '';
                
                return (
                  <tr key={item.id}>
                    <td>
                      {employeeName} {employeeLastName}
                    </td>
                    <td>{item.title || 'N/A'}</td>
                    <td>{item.target || 'N/A'}</td>
                    <td>{item.achieved || 'N/A'}</td>
                    <td>{item.status || 'PENDING'}</td>
                    <td>
                      {item.status === "PENDING" &&
                        ["hr", "admin", "manager"].includes(userRole) && (
                          <button
                            className={Styles.actionButton}
                            onClick={() => openRatingModal(item)}
                          >
                            Rate
                          </button>
                        )}
                    </td>
                    <td>
                      <button
                        className={Styles.actionButton}
                        onClick={() => openViewModal(item)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* --- View KRA Modal --- */}
      {viewModal.isOpen && (
        <div className={Styles.modalOverlay}>
          <div className={Styles.modalContent}>
            <button className={Styles.modalClose} onClick={closeViewModal}>
              <FaTimes />
            </button>
            <h3>View KRA/KPI Details</h3>
            <div className={Styles.kraDetails}>
              <p>
                <strong>Employee:</strong> {viewModal.kraData?.user?.Employee?.firstName || 'N/A'} {viewModal.kraData?.user?.Employee?.lastName || ''}
              </p>
              <p>
                <strong>Title:</strong> {viewModal.kraData?.title || 'N/A'}
              </p>
              <p>
                <strong>Description:</strong> {viewModal.kraData?.description || 'N/A'}
              </p>
              <p>
                <strong>KRA:</strong> {viewModal.kraData?.kra || 'N/A'}
              </p>
              <p>
                <strong>KPI:</strong> {viewModal.kraData?.kpi || 'N/A'}
              </p>
              <p>
                <strong>Target:</strong> {viewModal.kraData?.target || 'N/A'}
              </p>
              <p>
                <strong>Achieved:</strong> {viewModal.kraData?.achieved || 'N/A'}
              </p>
              <p>
                <strong>Period:</strong>{" "}
                {`${
                  monthOptions.find((m) => m.value === viewModal.kraData?.month)
                    ?.name || 'N/A'
                } ${viewModal.kraData?.year || 'N/A'}`}
              </p>
              <p>
                <strong>Status:</strong> {viewModal.kraData?.status || 'PENDING'}
              </p>
              <p>
                <strong>Rating:</strong> {viewModal.kraData?.rating || "N/A"}
              </p>
              <p>
                <strong>Comments:</strong> {viewModal.kraData?.comments || "-"}
              </p>
            </div>
            <div className={Styles.modalActions}>
              <button
                className={Styles.modalButtonSecondary}
                onClick={closeViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Rating Modal --- */}
      {modal.isOpen && (
        <div className={Styles.modalOverlay}>
          <div className={Styles.modalContent}>
            <button className={Styles.modalClose} onClick={closeRatingModal}>
              <FaTimes />
            </button>
            <h3>
              Rate KRA/KPI for{" "}
              {(modal.currentKpi?.user?.Employee?.firstName || 'N/A')?.toUpperCase()}{" "}
              {(modal.currentKpi?.user?.Employee?.lastName || '')?.toUpperCase()}
            </h3>
            <p>
              <strong>Title:</strong> {modal.currentKpi?.title || 'N/A'}
            </p>
            <form onSubmit={handleRatingSubmit}>
              <div className={Styles.formGroup}>
                <label htmlFor="rating">Rating (1-5)</label>
                <input
                  type="number"
                  id="rating"
                  min="1"
                  max="5"
                  value={Number(ratingInput.rating) || ""} // always a safe value
                  onChange={(e) => {
                    const value = e.target.value;
                    setRatingInput({
                      ...ratingInput,
                      rating: value === "" ? "" : Number(value), // handle empty string safely
                    });
                  }}
                  required
                />
              </div>
              <div className={Styles.formGroup}>
                <label htmlFor="comments">Comments</label>
                <textarea
                  id="comments"
                  rows="4"
                  value={ratingInput.comments}
                  onChange={(e) =>
                    setRatingInput({ ...ratingInput, comments: e.target.value })
                  }
                />
              </div>
              <div className={Styles.modalActions}>
                <button
                  type="button"
                  className={Styles.modalButtonSecondary}
                  onClick={closeRatingModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={Styles.modalButtonPrimary}
                  disabled={isSubmittingRating}
                >
                  {isSubmittingRating ? "Submitting..." : "Submit Rating"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KraKpiReport;
