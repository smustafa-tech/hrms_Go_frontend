import { Link } from 'react-router-dom';
import AttendanceChart from '../../components/Charts/AttendanceChart';
import PayrollChart from '../../components/Charts/PayrollChart';
import DepartmentChart from '../../components/Charts/DepartmentChart';
import { 
  Users, 
  Clock, 
  Calendar, 
  TrendingUp, 
  UserPlus,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import styles from './Dashboard.module.css';

export default function HRDashboard() {
  const stats = [
    {
      title: 'Total Employees',
      value: '156',
      change: '+8',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Present Today',
      value: '142',
      change: '91%',
      changeType: 'positive',
      icon: UserCheck,
    },
    {
      title: 'Pending Leaves',
      value: '7',
      change: '2 urgent',
      changeType: 'warning',
      icon: Calendar,
    },
    {
      title: 'Open Positions',
      value: '12',
      change: '+3',
      changeType: 'neutral',
      icon: UserPlus,
    },
  ];

  const pendingApprovals = [
    { 
      employee: 'Sarah Johnson', 
      type: 'Leave Request', 
      details: 'Medical Leave - 3 days',
      date: 'Mar 15-17',
      priority: 'high'
    },
    { 
      employee: 'Mike Chen', 
      type: 'Leave Request', 
      details: 'Vacation - 5 days',
      date: 'Mar 20-24',
      priority: 'medium'
    },
    { 
      employee: 'Emma Davis', 
      type: 'Overtime Request', 
      details: 'Weekend work - 8 hours',
      date: 'Mar 12',
      priority: 'low'
    },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>HR Dashboard</h1>
          <p className={styles.subtitle}>
            Manage employees, attendance, and organizational operations
          </p>
        </div>
        <div className={styles.actions}>
          <Link to="/employees/add" className="btn btnOutline">Add Employee</Link>
          <Link to="/reports" className="btn btnPrimary">View Reports</Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statTitle}>
                {stat.title}
              </div>
              <stat.icon className={styles.statIcon} />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stat.value}</div>
              <p className={styles.statChange}>
                <span className={
                  stat.changeType === 'positive' ? styles.statChangePositive :
                  stat.changeType === 'warning' ? styles.statChangeWarning :
                  stat.changeType === 'negative' ? styles.statChangeNegative :
                  styles.statChange
                }>
                  {stat.change}
                </span>
                {stat.changeType === 'positive' && ' this month'}
                {stat.changeType === 'warning' && ' needs attention'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartBox}>
          <AttendanceChart />
        </div>

        <div className={styles.chartBox}>
          <DepartmentChart />
        </div>

        <div className={styles.chartBox}>
          <PayrollChart />
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Pending Approvals */}
        <div className={`${styles.card} ${styles.contentGridCol4}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Pending Approvals</div>
            <div className={styles.cardDescription}>
              Items requiring your immediate attention
            </div>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardList}>
              {pendingApprovals.map((item, index) => (
                <div key={index} className={styles.listItem}>
                  <div className={styles.listItemContent}>
                    <div className={styles.listItemIcon}>
                      {item.priority === 'high' && <AlertCircle className={styles.activityIconError} />}
                      {item.priority === 'medium' && <Clock className={styles.activityIconWarning} />}
                      {item.priority === 'low' && <CheckCircle2 className={styles.activityIconSuccess} />}
                    </div>
                    <div className={styles.listItemDetails}>
                      <p className={styles.listItemTitle}>{item.employee}</p>
                      <p className={styles.listItemSubtitle}>{item.details}</p>
                      <p className={styles.activityTime}>{item.date}</p>
                    </div>
                  </div>
                  <div className={styles.listItemActions}>
                    <span className={`${styles.badge} ${
                      item.priority === 'high' ? styles.badgeDestructive :
                      item.priority === 'medium' ? '' : styles.badgeSecondary
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt4">
              <Link to="/approvals" className="btn btnOutline w100">
                View All Approvals
              </Link>
            </div>
          </div>
        </div>

        {/* Department Stats */}
        <div className={`${styles.card} ${styles.contentGridCol3}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Department Overview</div>
            <div className={styles.cardDescription}>
              Today's attendance by department
            </div>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <UserCheck className={`${styles.activityIcon} ${styles.activityIconSuccess}`} />
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>IT Department</p>
                  <p className={styles.activityDescription}>42/45 present (93%)</p>
                </div>
              </div>
              <div className={styles.activityItem}>
                <UserCheck className={`${styles.activityIcon} ${styles.activityIconSuccess}`} />
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>Sales Department</p>
                  <p className={styles.activityDescription}>30/32 present (94%)</p>
                </div>
              </div>
              <div className={styles.activityItem}>
                <UserCheck className={`${styles.activityIcon} ${styles.activityIconWarning}`} />
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>Marketing</p>
                  <p className={styles.activityDescription}>25/28 present (89%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
