import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./EmployeeHeader.module.css";

export default function EmployeeHeader({ onAdd }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.title}>Employee Management</h1>
        <p className={styles.subtitle}>Manage your workforce and employee information</p>
      </div>

      {/* Use variant="primary" and size="lg" to match your Button.module.css */}
      <Button variant="primary" size="lg" onClick={onAdd}>
        <Plus className={styles.icon} /> Add Employee
      </Button>
    </div>
  );
}
