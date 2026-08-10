// Dark Theme Implementation for LKQS-HRMS-Frontend
// File: src/features/Settings/SystemSettings.jsx

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import styles from "../../pages/settings/Settings.module.css";

const SystemSettings = () => {
  const [system, setSystem] = useState(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('systemSettings');
    return saved ? JSON.parse(saved) : {
      theme: "light",
      language: "en",
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
      currency: "USD"
    };
  });

  // Apply theme on component mount
  useEffect(() => {
    if (system.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
      
      const darkStyles = `
        .dark, .dark body {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
        }
        .dark * {
          background-color: #2d2d2d !important;
          color: #ffffff !important;
          border-color: #404040 !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }
        .dark input, .dark textarea, .dark select {
          background-color: #404040 !important;
          color: #ffffff !important;
          border: 1px solid #606060 !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }
        /* Keep original button colors and styling */
        .dark button {
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
        }
        .dark button:hover {
          backdrop-filter: blur(15px) !important;
          -webkit-backdrop-filter: blur(15px) !important;
        }
        /* Keep all original colors including icons */
        .dark svg, .dark [class*="icon"] {
          /* Keep original icon colors */
        }
      `;
      
      let styleSheet = document.getElementById('dark-theme-styles');
      if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = 'dark-theme-styles';
        document.head.appendChild(styleSheet);
      }
      styleSheet.textContent = darkStyles;
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      
      const styleSheet = document.getElementById('dark-theme-styles');
      if (styleSheet) {
        styleSheet.remove();
      }
    }
  }, [system.theme]);

  const handleSave = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('systemSettings', JSON.stringify(system));
      
      // Apply theme immediately
      if (system.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#ffffff';
        
        const darkStyles = `
          .dark, .dark body {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
          }
          .dark * {
            background-color: #2d2d2d !important;
            color: #ffffff !important;
            border-color: #404040 !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
          }
          .dark input, .dark textarea, .dark select {
            background-color: #404040 !important;
            color: #ffffff !important;
            border: 1px solid #606060 !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
          }
          /* Keep original button colors and styling */
          .dark button {
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
          }
          .dark button:hover {
            backdrop-filter: blur(15px) !important;
            -webkit-backdrop-filter: blur(15px) !important;
          }
          /* Keep all original colors including icons */
          .dark svg, .dark [class*="icon"] {
            /* Keep original icon colors */
          }
        `;
        
        let styleSheet = document.getElementById('dark-theme-styles');
        if (!styleSheet) {
          styleSheet = document.createElement('style');
          styleSheet.id = 'dark-theme-styles';
          document.head.appendChild(styleSheet);
        }
        styleSheet.textContent = darkStyles;
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
        
        const styleSheet = document.getElementById('dark-theme-styles');
        if (styleSheet) {
          styleSheet.remove();
        }
      }
      
      toast({ title: "System Settings Updated", description: "System preferences saved successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Preferences</CardTitle>
        <CardDescription>Customize your interface</CardDescription>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <div className={styles.grid2}>
          <div className={styles.inputGroup}>
            <Label>Theme</Label>
            <Select value={system.theme} onValueChange={(v) => setSystem({ ...system, theme: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={styles.inputGroup}>
            <Label>Language</Label>
            <Select value={system.language} onValueChange={(v) => setSystem({ ...system, language: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className={styles.inputGroup}>
            <Label>Timezone</Label>
            <Input
              value={system.timezone}
              onChange={(e) => setSystem({ ...system, timezone: e.target.value })}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label>Date Format</Label>
            <Input
              value={system.dateFormat}
              onChange={(e) => setSystem({ ...system, dateFormat: e.target.value })}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label>Currency</Label>
            <Input
              value={system.currency}
              onChange={(e) => setSystem({ ...system, currency: e.target.value })}
            />
          </div>
        </div>
        <div className={styles.buttonRight}>
          <Button onClick={handleSave}><Save /> Save</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;