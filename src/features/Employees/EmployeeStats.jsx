import { Users, UserCheck, Building } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import styles from "./EmployeeStats.module.css";

export default function EmployeeStats({ employeesData }) {
  const totalCount = employeesData?.totalEmployeesCount ?? 0;
  const activeCount = employeesData?.activeEmployeesCount ?? 0;
  const inactiveCount = employeesData?.inactiveEmployeesCount ?? 0;
  const departmentCounts = employeesData?.departmentCounts ?? {};

  return (
    <div className={styles.statsGrid}>
      <Card>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Total Employees</CardTitle>
          <Users className={styles.cardIcon} />
        </CardHeader>
        <CardContent>
          <div className={styles.cardValue}>{totalCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Active</CardTitle>
          <UserCheck className={styles.cardIcon} />
        </CardHeader>
        <CardContent>
          <div className={styles.cardValue}>{activeCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Inactive</CardTitle>
          <UserCheck className={styles.cardIcon} />
        </CardHeader>
        <CardContent>
          <div className={styles.cardValue}>{inactiveCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Departments</CardTitle>
          <Building className={styles.cardIcon} />
        </CardHeader>
        <CardContent>
          <div>
            {Object.entries(departmentCounts).map(([dept, count]) => (
              <div key={dept}>
                <b> "{dept}" :</b> {count} ,
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
