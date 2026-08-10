import React from "react";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import styles from "./EmployeeProfile.module.css";

export default function EmployeeProfile({
  employee,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!employee) return null;

  const statusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "on leave":
        return "secondary";
      case "inactive":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className={styles.profileModalContent}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>Employee Profile</h2>
        <div className={styles.modalActions}>
          <Button variant="primary" onClick={() => onEdit && onEdit(employee)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete && onDelete(employee.emp_id)}
          >
            Delete
          </Button>
          <Button variant="outline" size="icon" onClick={onClose}>
            ×
          </Button>
        </div>
      </div>

      <div className={styles.profileDescription}>
        Detailed information for {employee.firstName} {employee.lastName}.
      </div>

      <div className={styles.profileGrid}>
        {/* Personal Information */}
        <div className={styles.profileSection}>
          <h3 className={styles.profileHeading}>Personal Information</h3>
          <div className={styles.profileItem}>
            <Avatar>
              <AvatarFallback>
                {employee.firstName?.[0].toUpperCase()}
                {employee.lastName?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>
              Full Name: {employee.firstName.toUpperCase()}{" "}
              {employee.middleName.toUpperCase()}{" "}
              {employee.lastName.toUpperCase()}
            </span>
          </div>
          <div className={styles.profileItem}>
            <Mail size={16} className={styles.profileIcon} />
            <span>Email: {employee.email}</span>
          </div>
          <div className={styles.profileItem}>
            <Phone size={16} className={styles.profileIcon} />
            <span>Phone: {employee.phone || "N/A"}</span>
          </div>
          <div className={styles.profileItem}>
            <User size={16} className={styles.profileIcon} />
            <span>Aadhaar Card: {employee.adharCard || "N/A"}</span>
          </div>
        </div>

        {/* Employment Details */}
        <div className={styles.profileSection}>
          <h3 className={styles.profileHeading}>Employment Details</h3>
          <div className={styles.profileItem}>
            <Building size={16} className={styles.profileIcon} />
            <span>
              Department: {employee.department.toUpperCase() || "N/A"}
            </span>
          </div>
          <div className={styles.profileItem}>
            <Briefcase size={16} className={styles.profileIcon} />
            <span>
              Designation: {employee.designation.toUpperCase() || "N/A"}
            </span>
          </div>
          <div className={styles.profileItem}>
            <Briefcase size={16} className={styles.profileIcon} />
            <span>Role: {employee.role.toUpperCase() || "N/A"}</span>
          </div>
          <div className={styles.profileItem}>
            <Calendar size={16} className={styles.profileIcon} />
            <span>Date of Joining: {employee.dateOfJoining || "N/A"}</span>
          </div>
          <div className={styles.profileItem}>
            <IndianRupee size={16} className={styles.profileIcon} />
            <span>
              Salary: &#8377;
              {employee.salary ? `${employee.salary.toLocaleString()}` : "N/A"}
            </span>
          </div>
          <div className={styles.profileItem}>
            <Briefcase size={16} className={styles.profileIcon} />
            <span>Work Mode: {employee.workMode.toUpperCase() || "N/A"}</span>
          </div>
          <div className={styles.profileItem}>
            <User size={16} className={styles.profileIcon} />
            <span>
              Status:{" "}
              <Badge variant={statusVariant(employee.status)}>
                {employee.status.toUpperCase() || "N/A"}
              </Badge>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
