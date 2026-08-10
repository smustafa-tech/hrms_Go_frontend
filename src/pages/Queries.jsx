import React, { useEffect, useState } from "react";
import { 
  HelpCircle, 
  Send, 
  FileText, 
  Trash2, 
  Calendar,
  AlertCircle,
  Paperclip,
  Clock
} from "lucide-react";
import { useQueryStore } from "@/store/suggestionStore";
import { useAuth } from "@/components/Context/AuthContext";
import styles from "./Queries.module.css";

export default function Queries() {
  const { user } = useAuth();
  const { 
    queries, 
    loading, 
    error, 
    fetchMyQueries, 
    submitQuery, 
    deleteQuery 
  } = useQueryStore();

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "medium",
    attachment: null
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMyQueries();
  }, [fetchMyQueries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    const result = await submitQuery(formData);
    
    if (result.success) {
      setFormData({
        subject: "",
        message: "",
        priority: "medium",
        attachment: null
      });
      setShowForm(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];
      
      if (allowedTypes.includes(file.type)) {
        setFormData(prev => ({ ...prev, attachment: file }));
      } else {
        alert("Please select a valid file (PDF, Word, or Image)");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "#10b981",
      medium: "#f59e0b", 
      high: "#ef4444",
      urgent: "#dc2626"
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      in_progress: "#3b82f6",
      resolved: "#10b981",
      closed: "#6b7280"
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <HelpCircle className={styles.titleIcon} />
            Raise a Query
          </h1>
          <p className={styles.subtitle}>
            Get help and support by raising your queries
          </p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`${styles.btn} ${styles.primary}`}
        >
          <Send size={16} />
          New Query
        </button>
      </div>

      {/* New Query Form */}
      {showForm && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Submit New Query</div>
            <div className={styles.cardDescription}>
              Describe your issue or question and we'll help you resolve it
            </div>
          </div>
          <div className={styles.cardContent}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Subject *</label>
                  <input
                    className={styles.input}
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief subject for your query"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Priority</label>
                  <select 
                    className={styles.select}
                    value={formData.priority} 
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Message *</label>
                <textarea
                  className={styles.textarea}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe your query in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Attachment (Optional)</label>
                <div className={styles.fileInput}>
                  <input
                    className={styles.input}
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <p className={styles.fileHint}>
                    <Paperclip size={14} />
                    Supported: PDF, Word documents, Images (JPG, PNG)
                  </p>
                </div>
              </div>

              <div className={styles.actions}>
                <button 
                  type="button" 
                  className={`${styles.btn} ${styles.ghost}`}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`${styles.btn} ${styles.primary}`}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Query"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* My Queries */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>My Queries</div>
          <div className={styles.cardDescription}>
            View and track your submitted queries
          </div>
        </div>
        <div className={styles.cardContent}>
          {loading && queries.length === 0 ? (
            <div className={styles.loading}>Loading queries...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : queries.length === 0 ? (
            <div className={styles.empty}>
              <HelpCircle size={48} className={styles.emptyIcon} />
              <h3>No queries yet</h3>
              <p>Click "New Query" to raise your first query!</p>
            </div>
          ) : (
            <div className={styles.queriesList}>
              {queries.map((query) => (
                <div key={query.id} className={styles.queryCard}>
                  <div className={styles.queryHeader}>
                    <div className={styles.queryMeta}>
                      <h3 className={styles.querySubject}>{query.subject}</h3>
                      <div className={styles.queryInfo}>
                        <span 
                          className={styles.priorityBadge}
                          style={{ backgroundColor: getPriorityColor(query.priority) }}
                        >
                          <AlertCircle size={12} />
                          {query.priority}
                        </span>
                        <span className={styles.dateInfo}>
                          <Calendar size={12} />
                          {formatDate(query.createdAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteQuery(query.id)}
                      className={`${styles.btn} ${styles.ghost}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className={styles.queryContent}>
                    <p className={styles.queryMessage}>
                      {query.message}
                    </p>
                    
                    {query.attachment && (
                      <div className={styles.attachment}>
                        <FileText size={16} />
                        <span>Attachment: {query.attachment}</span>
                      </div>
                    )}

                    {/* Replies Section */}
                    {query.replies && query.replies.length > 0 && (
                      <div className={styles.replies}>
                        <h4 className={styles.repliesTitle}>Replies:</h4>
                        {query.replies.map((reply, index) => (
                          <div key={index} className={styles.reply}>
                            <div className={styles.replyHeader}>
                              <span className={styles.replyAuthor}>
                                {reply.repliedBy?.firstName} {reply.repliedBy?.lastName} ({reply.repliedBy?.role})
                              </span>
                              <span className={styles.replyDate}>
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                            <p className={styles.replyMessage}>{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className={styles.queryFooter}>
                      {query.status && (
                        <span 
                          className={styles.statusBadge}
                          style={{ backgroundColor: getStatusColor(query.status) }}
                        >
                          <Clock size={12} />
                          {query.status.replace('_', ' ').charAt(0).toUpperCase() + query.status.replace('_', ' ').slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}