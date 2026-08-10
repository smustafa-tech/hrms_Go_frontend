import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-Toast";
import styles from "../../pages/Settings/Settings.module.css";
import {Toggle} from "@/components/ui/Toggle";
import api from "@/Services/api";

const SecuritySettings = () => {
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "60",
    passwordExpiry: "90",
    loginNotifications: true,
  });
  const [loading, setLoading] = useState(false);

  // Fetch current security settings from backend on mount
  useEffect(() => {
    const fetchSecurity = async () => {
      try {
        setLoading(true);
        // Try to load from localStorage first
        const saved = localStorage.getItem('securitySettings');
        if (saved) {
          setSecurity(JSON.parse(saved));
        }
        
        // Optionally try API call (will fail gracefully if endpoint doesn't exist)
        try {
          const res = await api.get("/users/security-settings");
          setSecurity(res.data);
          localStorage.setItem('securitySettings', JSON.stringify(res.data));
        } catch (apiErr) {
          console.log("Security API not available, using localStorage");
        }
      } catch (err) {
        console.error("Error loading security settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSecurity();
  }, []);

  // Toggle boolean fields
  const handleToggle = (key) => {
    setSecurity({ ...security, [key]: !security[key] });
  };

  // Save settings to backend
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Save to localStorage
      localStorage.setItem('securitySettings', JSON.stringify(security));
      
      // Try to save to API (optional)
      try {
        await api.put("/users/security-settings", security);
        toast({
          title: "Settings Saved",
          description: "Security preferences updated successfully!",
        });
      } catch (apiErr) {
        // API failed, but localStorage worked
        toast({
          title: "Settings Saved Locally",
          description: "Security preferences saved locally (API not available)",
        });
      }
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Failed to save security settings",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage login and authentication</CardDescription>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <div className={styles.switchRow}>
          <Label>Two-Factor Authentication</Label>
          <Toggle
            checked={security.twoFactorAuth}
            onChange={() => handleToggle("twoFactorAuth")}
          />
        </div>

        <div className={styles.grid2}>
          <div className={styles.inputGroup}>
            <Label>Session Timeout (mins)</Label>
            <Input
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label>Password Expiry (days)</Label>
            <Input
              value={security.passwordExpiry}
              onChange={(e) => setSecurity({ ...security, passwordExpiry: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.switchRow}>
          <Label>Login Notifications</Label>
          <Toggle
            checked={security.loginNotifications}
            onChange={() => handleToggle("loginNotifications")}
          />
        </div>

        <div className={styles.buttonRight}>
          <Button onClick={handleSave} disabled={loading}>
            <Save /> {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
