import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-Toast";
import styles from "../../pages/Settings/Settings.module.css";
import { useSettingsStore } from "../../store/settingsStore";
import api from "@/Services/api";

const NotificationSettings = () => {
  // Zustand store
  const notificationSettings = useSettingsStore((state) => state.notificationSettings);
  const setNotificationSettings = useSettingsStore((state) => state.setNotificationSettings);

  const [loading, setLoading] = useState(false);

  // Fetch notification settings from backend on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Try to load from localStorage first
        const saved = localStorage.getItem('notificationSettings');
        if (saved) {
          setNotificationSettings(JSON.parse(saved));
        }
        
        // Optionally try API call
        try {
          const res = await api.get("/users/notifications");
          setNotificationSettings(res.data);
          localStorage.setItem('notificationSettings', JSON.stringify(res.data));
        } catch (apiErr) {
          console.log("Notifications API not available, using localStorage");
        }
      } catch (err) {
        console.error("Error loading notification settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [setNotificationSettings]);

  // Handle toggle change
  const handleToggle = (key) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };

  // Save updated settings to backend
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Save to localStorage
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      
      // Try to save to API (optional)
      try {
        await api.put("/users/notifications", notificationSettings);
        toast({
          title: "Settings Saved",
          description: "Notification preferences updated successfully!",
        });
      } catch (apiErr) {
        // API failed, but localStorage worked
        toast({
          title: "Settings Saved Locally",
          description: "Notification preferences saved locally (API not available)",
        });
      }
    } catch (err) {
      toast({
        title: "Save failed",
        description: "Failed to save notification settings",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Control how you get alerts</CardDescription>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        {notificationSettings &&
          Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className={styles.switchRow}>
              <Label>{key.replace(/([A-Z])/g, " $1")}</Label>
              <button
                className={`${styles.toggleButton} ${value ? styles.toggleOn : ""}`}
                onClick={() => handleToggle(key)}
              >
                <span className={styles.toggleCircle}></span>
              </button>
            </div>
          ))}

        <div className={styles.buttonRight}>
          <Button onClick={handleSave} disabled={loading}>
            <Save /> {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
