import React, { useState, useEffect, useCallback } from "react";
import api from "../../Services/api";
import Styles from "./DocumentSubmit.module.css";
import { FaCheckCircle, FaTimesCircle, FaEye, FaTrash, FaUpload } from "react-icons/fa";
import { Button } from "@/components/ui/Button";

const MANDATORY_DOC_TYPES = [
  "Aadhar Card",
  "PAN Card",
  "Last Year Marksheets (Graduation)",
  "12th/Diploma Marksheets",
  "SSC Marksheets",
  "Passport Size Photo",
];
const OPTIONAL_DOC_TYPES = ["Other 1", "Other 2"];
const ALL_DOC_TYPES = [...MANDATORY_DOC_TYPES, ...OPTIONAL_DOC_TYPES];

const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const DocumentUpload = () => {
  const [stagedFiles, setStagedFiles] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({ isOpen: false, type: "", message: "" });
  const [slug, setSlug] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("hrms_auth")) || {};
    setSlug(auth?.tenant || auth?.slug || "default");
    setToken(auth?.token || "");
  }, []);

  const fetchUploadedDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/document/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-slug": slug,
        },
      });
      setUploadedDocuments(res.data.documents || []);
    } catch (err) {
      console.error("❌ Failed to fetch documents:", err);
      setError(err.response?.data?.message || "Could not fetch documents.");
    } finally {
      setIsLoading(false);
    }
  }, [slug, token]);

  useEffect(() => {
    if (slug && token) fetchUploadedDocuments();
  }, [fetchUploadedDocuments, slug, token]);

  // --- Unified file validation handler (used by both input and drop)
  const validateAndSetFile = (file, docType) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setModal({
        isOpen: true,
        type: "error",
        message: "Please upload in PDF format only.",
      });
      return;
    }

    if (file.size > 500 * 1024) {
      setModal({
        isOpen: true,
        type: "error",
        message: "File size must be less than 500 KB.",
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setStagedFiles((prev) => ({ ...prev, [docType]: { file, previewUrl } }));
  };

  const handleFileChange = (e, docType) => {
    validateAndSetFile(e.target.files[0], docType);
  };

  const handleDrop = (e, docType) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file, docType);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveStagedFile = (docType) => {
    if (stagedFiles[docType]) URL.revokeObjectURL(stagedFiles[docType].previewUrl);
    setStagedFiles((prev) => {
      const copy = { ...prev };
      delete copy[docType];
      return copy;
    });
  };

  const handleSubmitAll = async () => {
    for (const type of MANDATORY_DOC_TYPES) {
      if (!stagedFiles[type]) {
        setError(`Mandatory document missing: ${type}`);
        return;
      }
    }

    setError("");
    setIsLoading(true);

    try {
      const uploadPromises = Object.entries(stagedFiles).map(([docType, fileData]) => {
        const formData = new FormData();
        formData.append("file", fileData.file);
        formData.append("documentType", docType);

        return api.post(`/document/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-slug": slug,
            "Content-Type": "multipart/form-data",
          },
        });
      });

      await Promise.all(uploadPromises);

      setModal({
        isOpen: true,
        type: "success",
        message: "All documents uploaded successfully!",
      });
      setStagedFiles({});
      fetchUploadedDocuments();
    } catch (err) {
      console.error("❌ Upload failed:", err);
      let backendMessage = err.response?.data?.message;

      if (backendMessage?.includes("Only PDF files are allowed"))
        backendMessage = "Please upload in PDF format only.";
      else if (backendMessage?.includes("File too large"))
        backendMessage = "File size must be less than 500 KB.";

      setModal({
        isOpen: true,
        type: "error",
        message: backendMessage || "Upload failed.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => setModal({ isOpen: false, type: "", message: "" });

  const isSubmitDisabled =
    MANDATORY_DOC_TYPES.some((type) => !stagedFiles[type]) ||
    isLoading ||
    Object.keys(stagedFiles).length === 0;

  return (
    <div className={Styles.container}>
      <h2 className={Styles.title}>Document Upload</h2>
      <p className={Styles.subtitle}>
        Please upload all mandatory documents. Optional documents can also be added.
      </p>
      {/* <p className={Styles.formatNote}>Please upload in PDF format.</p>
      <p className={Styles.sizeNote}>File must be less than 500 KB.</p> */}

      <div className={Styles.uploadGrid}>
        {ALL_DOC_TYPES.map((type) => {
          const isMandatory = MANDATORY_DOC_TYPES.includes(type);
          const stagedFile = stagedFiles[type];

          return (
            <div
              key={type}
              className={Styles.documentCard}
              onDrop={(e) => handleDrop(e, type)}
              onDragOver={handleDragOver}
            >
              <h4 className={Styles.cardTitle}>
                {type} {isMandatory && <span className={Styles.mandatory}>*</span>}
              </h4>

              {stagedFile ? (
                <div className={Styles.fileInfo}>
                  <p className={Styles.fileName} title={stagedFile.file.name}>
                    {stagedFile.file.name}
                  </p>
                  <p className={Styles.fileSize}>{formatFileSize(stagedFile.file.size)}</p>
                  <div className={Styles.fileActions}>
                    <a
                      href={stagedFile.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${Styles.actionButton} ${Styles.viewButton}`}
                    >
                      <FaEye /> View
                    </a>
                    <button
                      onClick={() => handleRemoveStagedFile(type)}
                      className={`${Styles.actionButton} ${Styles.removeButton}`}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className={Styles.uploadArea}>
                  <label htmlFor={`file-input-${type}`} className={Styles.uploadLabel}>
                    <FaUpload /> Upload File
                  </label>
                  <input
                    id={`file-input-${type}`}
                    type="file"
                    className={Styles.fileInput}
                    onChange={(e) => handleFileChange(e, type)}
                  />
                  <p className={Styles.uploadHint}>Only PDF (Max 500 KB)</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={Styles.submissionSection}>
        {error && <p className={Styles.errorMessage}>{error}</p>}
        <Button onClick={handleSubmitAll} disabled={isSubmitDisabled}>
          {isLoading ? "Submitting..." : "Submit All Documents"}
        </Button>
      </div>

      <div className={Styles.uploadedSection}>
        <h3 className={Styles.title}>Previously Uploaded Documents</h3>
        {uploadedDocuments.length > 0 ? (
          <ul className={Styles.documentList}>
            {uploadedDocuments.map((doc) => (
              <li key={doc.id} className={Styles.documentItem}>
                <span>
                  <strong>{doc.documentType}:</strong> {doc.fileName}
                </span>
                <a
                  href={`${api.defaults.baseURL}/document/download/${doc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={Styles.downloadLink}
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents have been uploaded yet.</p>
        )}
      </div>

      {modal.isOpen && (
        <div className={Styles.modalOverlay}>
          <div
            className={`${Styles.modalContent} ${
              modal.type === "success" ? Styles.successModal : Styles.errorModal
            }`}
          >
            {modal.type === "success" ? (
              <FaCheckCircle className={Styles.modalIcon} />
            ) : (
              <FaTimesCircle className={Styles.modalIcon} />
            )}
            <h3 className={Styles.modalTitle}>
              {modal.type === "success" ? "Success" : "Error"}
            </h3>
            <p>{modal.message}</p>
            <Button onClick={closeModal}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
