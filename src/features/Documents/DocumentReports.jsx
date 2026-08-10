import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../Services/api";
import { FaTrash, FaDownload, FaSearch, FaTimes, FaEye } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import Styles from "./DocumentReports.module.css";
import { useAuth } from "@/components/Context/AuthContext";

const DocumentReports = () => {
  const { user, slug } = useAuth(); // include tenant slug
  const [documents, setDocuments] = useState([]);
  const [groupedDocs, setGroupedDocs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState("");

  const [viewModal, setViewModal] = useState({
    isOpen: false,
    userId: null,
    docs: [],
  });

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setUserRole(user.role);

      const url =
        user.role === "hr" || user.role === "admin"
          ? `/document/employee/all`
          : `/document/me`;

      const response = await api.get(url, {
        headers: { "x-tenant-slug": slug }, // send tenant slug
      });

      console.log(response.data);
      const data = response.data?.documents || [];
      setDocuments(data);

      // ✅ Group documents by empId
      const grouped = data.reduce((acc, doc) => {
        const key = doc.empId || doc.userId || "Unknown"; // use empId as key
        if (!acc[key]) acc[key] = [];
        acc[key].push(doc);
        return acc;
      }, {});
      setGroupedDocs(grouped);
    } catch (err) {
      console.error("❌ Failed to fetch documents:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch documents"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user, slug]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredGrouped = useMemo(() => {
    if (!searchTerm) return groupedDocs;
    const lower = searchTerm.toLowerCase();
    return Object.fromEntries(
      Object.entries(groupedDocs).filter(([key, docs]) => {
        const name = docs[0]?.employeeName?.toLowerCase() || "";
        return key.toLowerCase().includes(lower) || name.includes(lower);
      })
    );
  }, [groupedDocs, searchTerm]);

  const openViewModal = (empId, docs) =>
    setViewModal({ isOpen: true, userId: empId, docs });
  const closeViewModal = () =>
    setViewModal({ isOpen: false, userId: null, docs: [] });

  const handleDownload = async (docId, fileName) => {
    try {
      const res = await api.get(`/document/download/${docId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Failed to download:", err);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;
    try {
      await api.delete(`/document/${docId}`, {
        headers: { "x-tenant-slug": slug },
      });
      fetchDocuments();
    } catch (err) {
      console.error("❌ Failed to delete document:", err);
      alert(err.response?.data?.message || "Failed to delete document");
    }
  };

  return (
    <div className={Styles.container}>
      <h2>Employee Documents</h2>

      <div className={Styles.searchContainer}>
        <FaSearch className={Styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by employee name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={Styles.searchInput}
        />
      </div>

      {isLoading ? (
        <p>Loading documents...</p>
      ) : error ? (
        <p className={Styles.errorText}>{error}</p>
      ) : Object.keys(filteredGrouped).length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table className={Styles.documentTable}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Total Documents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(filteredGrouped).map(([empId, docs]) => {
              const firstDoc = docs[0];
              const employeeName =
                firstDoc?.employeeName ||
                `${firstDoc?.auth?.firstName || ""} ${
                  firstDoc?.auth?.lastName || ""
                }`.trim() ||
                "N/A";

              return (
                <tr key={empId}>
                  <td>{empId}</td>
                  <td>{employeeName}</td> {/* ✅ fixed employee name display */}
                  <td>{docs.length}</td>
                  <td>
                    <Button onClick={() => openViewModal(empId, docs)}>
                      <FaEye /> View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {viewModal.isOpen && (
        <div className={Styles.modalOverlay}>
          <div className={Styles.modalContentLarge}>
            <button className={Styles.modalClose} onClick={closeViewModal}>
              <FaTimes />
            </button>
            <h3>
              Documents for {viewModal.docs[0]?.employeeName || "Employee"} (
              {viewModal.userId})
            </h3>

            <table className={Styles.innerTable}>
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>File Name</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {viewModal.docs.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.documentType}</td>
                    <td>{doc.fileName}</td>
                    <td>{(doc.size / 1024).toFixed(2)} KB</td>
                    <td className={Styles.actionButtons}>
                      <Button
                        onClick={() =>
                          window.open(
                            doc.fileUrl || `/uploads/${doc.fileName}`,
                            "_blank"
                          )
                        }
                      >
                        <FaEye /> View
                      </Button>
                      <Button
                        onClick={() => handleDownload(doc.id, doc.fileName)}
                      >
                        <FaDownload /> Download
                      </Button>
                      {["hr", "admin"].includes(userRole) && (
                        <Button
                          onClick={() => handleDelete(doc.id)}
                          className={Styles.deleteButton}
                        >
                          <FaTrash /> Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "1rem" }}>
              <Button onClick={closeViewModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentReports;
