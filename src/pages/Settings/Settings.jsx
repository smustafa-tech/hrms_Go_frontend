import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Building,
} from "lucide-react";
import styles from "./Settings.module.css";

import ProfileSettings from "../../features/Settings/ProfileSettings.jsx";
import CompanySettings from "../../features/Settings/CompanySettings";
import NotificationSettings from "../../features/Settings/NotificationSettings";
import SecuritySettings from "../../features/Settings/SecuritySettings";
import SystemSettings from "../../features/Settings/SystemSettings";

const Settings = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <SettingsIcon className={styles.icon} />
            Settings
          </h1>
          <p className={styles.subtitle}>
            Manage your account and system preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className={styles.tabs}>
        <TabsList className={styles.tabsList}>
          <TabsTrigger value="profile" className={styles.tabTrigger}>
            <User className={styles.tabIcon} /> Profile
          </TabsTrigger>
          <TabsTrigger value="company" className={styles.tabTrigger}>
            <Building className={styles.tabIcon} /> Company
          </TabsTrigger>
          <TabsTrigger value="notifications" className={styles.tabTrigger}>
            <Bell className={styles.tabIcon} /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className={styles.tabTrigger}>
            <Shield className={styles.tabIcon} /> Security
          </TabsTrigger>
          <TabsTrigger value="system" className={styles.tabTrigger}>
            <Palette className={styles.tabIcon} /> System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className={styles.tabContent}>
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="company" className={styles.tabContent}>
          <CompanySettings />
        </TabsContent>
        <TabsContent value="notifications" className={styles.tabContent}>
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="security" className={styles.tabContent}>
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="system" className={styles.tabContent}>
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
