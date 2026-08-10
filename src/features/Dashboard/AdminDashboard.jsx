import { useEffect } from "react";
import { Link } from "react-router-dom";
import AttendanceChart from "../../components/Charts/AttendanceChart";
import PayrollChart from "../../components/Charts/PayrollChart";
import DepartmentChart from "../../components/Charts/DepartmentChart";
import {
  Users,
  Building2,
  TrendingUp,
  Clock,
  DollarSign,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEmployeeStore } from "../../store/employeeStore";
import styles from "./Dashboard.module.css";

export default function AdminDashboard() {
  const {
    employeesData,
    fetchEmployees,
    allEmployeeAttendanceData,
    fetchAttendanceRecords,
  } = useEmployeeStore();

  const { totalEmployeesCount, activeEmployeesCount, departmentWiseCounts } =
    employeesData;

  const { todayPresentRecords, employeeMonthlySummary } =
    allEmployeeAttendanceData;

  useEffect(() => {
    fetchEmployees();
    fetchAttendanceRecords();
  }, [fetchEmployees, fetchAttendanceRecords]);

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployeesCount,
      // change: "+12%",
      // changeType: "positive",
      icon: Users,
    },
    {
      title: "Active Employees",
      value: activeEmployeesCount,
      // change: "+2",
      // changeType: "positive",
      icon: Building2,
    },
    {
      title: "Monthly Revenue",
      value: "--",
      change: "--",
      changeType: "--",
      icon: DollarSign,
    },
    {
      title: "Today's Present employees",
      value: todayPresentRecords.length,
      // change: "Stable",
      // changeType: "neutral",
      icon: Activity,
    },
  ];

  // const organizations = [
  //   { name: "TechCorp Inc.", employees: 45, status: "active", industry: "IT" },
  //   {
  //     name: "HealthPlus Medical",
  //     employees: 32,
  //     status: "active",
  //     industry: "Healthcare",
  //   },
  //   {
  //     name: "EduLearn Academy",
  //     employees: 28,
  //     status: "active",
  //     industry: "Education",
  //   },
  //   {
  //     name: "RetailMax Store",
  //     employees: 67,
  //     status: "trial",
  //     industry: "Retail",
  //   },
  //   { name: "InnovateLabs", employees: 23, status: "active", industry: "IT" },
  // ];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>
            Monitor and manage your Leann.HR platform
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statTitle}>{stat.title}</div>
              <stat.icon className={styles.statIcon} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stat.value}</div>
              <p className={styles.statChange}>
                <span
                  className={
                    stat.changeType === "positive"
                      ? styles.statChangePositive
                      : stat.changeType === "negative"
                      ? styles.statChangeNegative
                      : styles.statChangeWarning
                  }
                >
                  {stat.change}
                </span>
                {/* {stat.changeType !== "neutral" && " from last month"} */}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartBox}>
          <AttendanceChart attendanceData={employeeMonthlySummary} />
        </div>

        <div className={styles.chartBox}>
          <DepartmentChart Data={departmentWiseCounts} />
        </div>

        {/* <div className={styles.chartBox}>
          <PayrollChart />
        </div> */}
      </div>

      <div className={styles.contentGrid}>
        {/* Organizations Overview */}
        {/* <div className={`${styles.card} ${styles.contentGridCol4}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Organizations</div>
            <div className={styles.cardDescription}>
              Manage client organizations and their subscriptions
            </div>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardList}>
              {organizations.map((org) => (
                <div key={org.name} className={styles.listItem}>
                  <div className={styles.listItemContent}>
                    <Building2 className={styles.listItemIcon} />
                    <div className={styles.listItemDetails}>
                      <p className={styles.listItemTitle}>{org.name}</p>
                      <p className={styles.listItemSubtitle}>
                        {org.employees} employees • {org.industry}
                      </p>
                    </div>
                  </div>
                  <div className={styles.listItemActions}>
                    <span
                      className={`${styles.badge} ${
                        org.status === "active" ? "" : styles.badgeSecondary
                      }`}
                    >
                      {org.status}
                    </span>
                    <Link
                      to={`/organization/${org.name}`}
                      className="btn btnSecondary btnSm"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* Recent Activity */}
        {/* <div className={`${styles.card} ${styles.contentGridCol3}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Recent Activity</div>
            <div className={styles.cardDescription}>
              Latest system events and changes
            </div>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <CheckCircle
                  className={`${styles.activityIcon} ${styles.activityIconSuccess}`}
                />
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>
                    New organization registered
                  </p>
                  <p className={styles.activityDescription}>
                    TechStart Solutions
                  </p>
                  <p className={styles.activityTime}>2 hours ago</p>
                </div>
              </div>
              <div className={styles.activityItem}>
                <Activity
                  className={`${styles.activityIcon} ${styles.activityIconInfo}`}
                />
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>
                    System maintenance completed
                  </p>
                  <p className={styles.activityDescription}>Core Services</p>
                  <p className={styles.activityTime}>4 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
