import React, { useState, useEffect } from "react";
import api from "@/Services/api";
import Styles from "./KraKpi.module.css";
import {
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import { useKraKpiStore } from "@/store/kraKpiStore";
import { toast } from "@/hooks/use-Toast";
import { Button } from "@/components/ui/Button";

const KraKpiForm = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const { KraKpiData, fetchMyKraKpi, loading, error, clearError, setError } =
    useKraKpiStore();

  const entries = KraKpiData.MyKraKpiList; // ✅ Zustand data

  console.log(entries);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    kra: "",
    kpi: "",
    target: "",
    achieved: "",
    month: currentMonth,
    year: currentYear,
  });

  const [filter, setFilter] = useState({
    month: currentMonth,
    year: currentYear,
  });

  useEffect(() => {
    fetchMyKraKpi(filter.month, filter.year);
  }, [fetchMyKraKpi, filter.month, filter.year]);

  console.log("from kra form", filter.month);
  console.log("from kra form", filter.year);
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });
  const [expandedMonth, setExpandedMonth] = useState(null);

  // ✅ Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle filter select (for search)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit KRA/KPI
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        target: Number(formData.target),
        achieved: formData.achieved ? Number(formData.achieved) : 0,
      };

      const response = await api.post("/kraKpi/submitkraKpi", payload);

      setFormData({
        title: "",
        description: "",
        kra: "",
        kpi: "",
        target: "",
        achieved: "",
        month: currentMonth,
        year: currentYear,
      });

      toast({
        title: "Success",
        description: response.data.message || "Submitted successfully",
      });

      await fetchMyKraKpi(filter.month, filter.year);
    } catch (err) {
      console.error("[ERROR] EmployeeForm handleSubmit error:", err);
      const backendMessage =
        err.response?.data?.message || err.response?.data?.error;
      setError(backendMessage || "Employee operation failed");
      toast({
        title: "Error",
        description: backendMessage || "Employee operation failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => setPopup({ show: false, type: "", message: "" });

  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(
        () => setPopup({ show: false, type: "", message: "" }),
        4000
      );
      return () => clearTimeout(timer);
    }
  }, [popup.show]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 4000);
      return () => clearTimeout(timer);
    }
  }, [clearError, error]);

  const toggleMonth = (month) =>
    setExpandedMonth(expandedMonth === month ? null : month);

  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - 2 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    name: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  return (
    <div className={Styles["krakpi-form-container"]}>
      <h2 className={Styles["form-title"]}>KRA/KPI Management</h2>

      {loading && (
        <p className={Styles["loading-text"]}>Loading KRA/KPI data...</p>
      )}

      {/* ✅ Popup Modal */}
      {popup.show && (
        <div className={Styles["popup-overlay"]}>
          <div
            className={`${Styles["popup-box"]} ${
              popup.type === "success"
                ? Styles["popup-success"]
                : Styles["popup-error"]
            }`}
          >
            {popup.type === "success" ? (
              <CheckCircle size={50} />
            ) : (
              <XCircle size={50} />
            )}
            <h3>{popup.type === "success" ? "Success" : "Error"}</h3>
            <p>{popup.message}</p>
            <Button onClick={closePopup} className={Styles["continue-btn"]}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ✅ Submit Form */}
      <form onSubmit={handleSubmit} className={Styles["krakpi-form"]}>
        <h3>Submit Monthly KRA/KPI</h3>
        <div className={Styles["form-group"]}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles["form-group"]}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <div className={Styles["form-group"]}>
          <label>KRA</label>
          <input
            type="text"
            name="kra"
            value={formData.kra}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles["form-group"]}>
          <label>KPI</label>
          <input
            type="text"
            name="kpi"
            value={formData.kpi}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles["form-group"]}>
          <label>Target</label>
          <input
            type="number"
            name="target"
            value={formData.target}
            onChange={handleChange}
            required
          />
        </div>

        <div className={Styles["form-group"]}>
          <label>Achieved</label>
          <input
            type="number"
            name="achieved"
            value={formData.achieved}
            onChange={handleChange}
          />
        </div>

        <div className={Styles["form-row"]}>
          <div className={Styles["form-group"]}>
            <label>Month</label>
            <select name="month" value={formData.month} onChange={handleChange}>
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className={Styles["form-group"]}>
            <label>Year</label>
            <select name="year" value={formData.year} onChange={handleChange}>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={Styles["button-container"]}>
          <Button
            type="submit"
            disabled={loading || isLoading}
            className={Styles["submit-btn"]}
          >
            {loading || isLoading ? "Please wait..." : "Submit"}
          </Button>
          {error && (
            <div className={Styles["error-box"]}>
              <XCircle size={16} /> <span>{error}</span>
            </div>
          )}
        </div>
      </form>

      {/* ✅ Search Section */}
      <div className={Styles["search-section"]}>
        <h3>Search KRA/KPI by Month & Year</h3>
        <div className={Styles["search-filters"]}>
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
            onClick={() => fetchMyKraKpi(filter.month, filter.year)}
            className={Styles["continue-btn"]}
          >
            <Search size={16} /> Continue
          </Button>
        </div>
      </div>

      {/* ✅ Result Display */}
      <div className={Styles["previous-data-container"]}>
        <h3>
          Showing Entries for{" "}
          {monthOptions.find((m) => m.value === Number(filter.month))?.name}{" "}
          {filter.year}
        </h3>
        {entries.length === 0 ? (
          <p>No KRA/KPI found for selected period.</p>
        ) : (
          <div className={Styles["month-list"]}>
            {entries.map((entry) => {
              const monthName = new Date(
                entry.year,
                entry.month - 1
              ).toLocaleString("default", {
                month: "long",
              });
              return (
                <div key={entry.id} className={Styles["month-card"]}>
                  <div
                    className={Styles["month-header"]}
                    onClick={() => toggleMonth(entry.month)}
                  >
                    <span>
                      {monthName} - {entry.title}
                    </span>
                    {expandedMonth === entry.month ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>

                  {expandedMonth === entry.month && (
                    <div className={Styles["month-details"]}>
                      <p>
                        <strong>KRA:</strong> {entry.kra}
                      </p>
                      <p>
                        <strong>KPI:</strong> {entry.kpi}
                      </p>
                      <p>
                        <strong>Target:</strong> {entry.target}
                      </p>
                      <p>
                        <strong>Achieved:</strong> {entry.achieved ?? "-"}
                      </p>
                      <p>
                        <strong>Description:</strong> {entry.description ?? "-"}
                      </p>
                      <p className={Styles["submitted-text"]}>
                        Submitted:{" "}
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default KraKpiForm;
