import { useEffect } from "react";

import { Loader2, BellRing } from "lucide-react";
import styles from "./Notifications.module.css";

import { useNotificationsStore } from "@/store/notificationsStore";

export default function Notifications() {
  const {
    fetchNotifications,
    notificationsData,
    markAsRead,
    loading,
    // fetchUnreadCount,
    // markAsRead,
    // markAllAsRead,
  } = useNotificationsStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  if (loading)
    return (
      <div className={styles.loaderContainer}>
        <Loader2 className={styles.loaderIcon} size={40} />
      </div>
    );

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          <BellRing className={styles.icon} /> Notifications
        </h2>
      </div>

      {/* Notification List */}
      {notificationsData.length === 0 ? (
        <div className={styles.emptyState}>No notifications yet 🎉</div>
      ) : (
        <div className={styles.list}>
          {notificationsData.map((n) => (
            <div
              key={n.id}
              className={`${styles.card} ${
                n.isRead ? styles.readCard : styles.unreadCard
              }`}
              onClick={() => !n.isRead && handleMarkRead(n.id)}
            >
              <h4 className={styles.cardTitle}>{n.title || "Notification"}</h4>
              <p className={styles.cardMessage}>{n.message}</p>
              <p className={styles.cardDate}>
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
