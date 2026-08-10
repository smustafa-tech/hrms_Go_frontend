import React, { useEffect, useState } from "react";
import { MessageSquare, Clock, User, AlertCircle, CheckCircle, X, Send, Search } from "lucide-react";
import { useQueryStore } from "@/store/suggestionStore";
import styles from "./AdminQueries.module.css";

export default function AdminQueries() {
  const { allQueries, loading, fetchAllQueries, replyToQuery, closeQuery } = useQueryStore();
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filter, setFilter] = useState("open");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllQueries();
  }, [fetchAllQueries]);

  const handleReply = async (queryId) => {
    if (!replyMessage.trim()) return;
    
    const result = await replyToQuery(queryId, replyMessage);
    if (result.success) {
      setReplyMessage("");
      fetchAllQueries();
    }
  };

  const handleClose = async (queryId) => {
    await closeQuery(queryId);
    setSelectedQuery(null);
  };

  const filteredQueries = allQueries.filter(query => {
    // Filter by status
    const statusMatch = filter === "all" || query.status === filter;
    
    // Filter by search term (employee name)
    const searchMatch = !searchTerm || 
      (query.employee?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       query.employee?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "#3b82f6";
      case "in_progress": return "#f59e0b";
      case "closed": return "#10b981";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading queries...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Employee Queries</h1>
        <div className={styles.headerActions}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filters}>
            <button 
              className={`${styles.btn} ${styles.ghost} ${filter === "open" ? styles.active : ""}`}
              onClick={() => setFilter("open")}
            >
              Open
            </button>
            <button 
              className={`${styles.btn} ${styles.ghost} ${filter === "in_progress" ? styles.active : ""}`}
              onClick={() => setFilter("in_progress")}
            >
              In Progress
            </button>
            <button 
              className={`${styles.btn} ${styles.ghost} ${filter === "closed" ? styles.active : ""}`}
              onClick={() => setFilter("closed")}
            >
              Closed
            </button>
            <button 
              className={`${styles.btn} ${styles.ghost} ${filter === "all" ? styles.active : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.queryList}>
          {filteredQueries.length === 0 ? (
            <div className={styles.empty}>
              <MessageSquare className={styles.emptyIcon} />
              <p>No queries found</p>
            </div>
          ) : (
            filteredQueries.map((query) => (
              <div 
                key={query.id} 
                className={`${styles.queryCard} ${selectedQuery?.id === query.id ? styles.selected : ""}`}
                onClick={() => setSelectedQuery(query)}
              >
                <div className={styles.queryHeader}>
                  <div className={styles.queryInfo}>
                    <h3 className={styles.querySubject}>{query.subject}</h3>
                    <div className={styles.queryMeta}>
                      <span className={styles.employee}>
                        <User size={14} />
                        {query.employee?.firstName} {query.employee?.lastName}
                      </span>
                      <span className={styles.date}>
                        <Clock size={14} />
                        {new Date(query.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className={styles.badges}>
                    <span 
                      className={styles.priority}
                      style={{ backgroundColor: getPriorityColor(query.priority) }}
                    >
                      {query.priority}
                    </span>
                    <span 
                      className={styles.status}
                      style={{ backgroundColor: getStatusColor(query.status) }}
                    >
                      {query.status}
                    </span>
                  </div>
                </div>
                <p className={styles.queryPreview}>{query.message.substring(0, 100)}...</p>
              </div>
            ))
          )}
        </div>

        {selectedQuery && (
          <div className={styles.queryDetail}>
            <div className={styles.detailHeader}>
              <div>
                <h2 className={styles.detailTitle}>{selectedQuery.subject}</h2>
                <div className={styles.detailMeta}>
                  <span>From: {selectedQuery.employee?.firstName} {selectedQuery.employee?.lastName}</span>
                  <span>Date: {new Date(selectedQuery.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <button 
                className={styles.closeBtn}
                onClick={() => setSelectedQuery(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.detailContent}>
              <div className={styles.message}>
                <h4>Message:</h4>
                <p>{selectedQuery.message}</p>
              </div>

              {selectedQuery.attachment && (
                <div className={styles.attachment}>
                  <h4>Attachment:</h4>
                  <a href={selectedQuery.attachment} target="_blank" rel="noopener noreferrer">
                    View Attachment
                  </a>
                </div>
              )}

              {selectedQuery.replies && selectedQuery.replies.length > 0 && (
                <div className={styles.replies}>
                  <h4>Replies:</h4>
                  {selectedQuery.replies.map((reply, index) => (
                    <div key={index} className={styles.reply}>
                      <div className={styles.replyHeader}>
                        <span>{reply.repliedBy?.firstName} {reply.repliedBy?.lastName}</span>
                        <span>{new Date(reply.createdAt).toLocaleString()}</span>
                      </div>
                      <p>{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedQuery.status !== "closed" && (
                <div className={styles.actions}>
                  <div className={styles.replySection}>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className={styles.replyInput}
                    />
                    <button 
                      onClick={() => handleReply(selectedQuery.id)}
                      className={`${styles.btn} ${styles.primary}`}
                      disabled={!replyMessage.trim()}
                    >
                      <Send size={16} />
                      Send Reply
                    </button>
                  </div>
                  <button 
                    onClick={() => handleClose(selectedQuery.id)}
                    className={`${styles.btn} ${styles.success}`}
                  >
                    <CheckCircle size={16} />
                    Close Query
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}