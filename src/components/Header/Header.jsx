import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header({ setView }) {
//   const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Payroll</h1>
        <nav className={styles.nav}>
          <button onClick={() => setView('dashboard')} className={styles.btn}>Dashboard</button>
          <button onClick={() => setView('payslips')} className={styles.btn}>Payslips</button>
          <button onClick={() => setView('batches')} className={styles.btn}>Payslip Batches</button>
          <button onClick={() => setView('structures')} className={styles.btn}>Salary Structures</button>
          <button onClick={() => setView('rules')} className={styles.btn}>Salary Rules</button>
          <Link to='/attendance' className={styles.link}>Attendance</Link>
        </nav>
      </div>
    </header>
  );
}
