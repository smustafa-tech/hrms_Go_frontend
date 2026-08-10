import React from 'react';
import styles from './Card.module.css';

export default function Card({ title, value }) {
  return (
    <div className={styles.card}>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}</div>
      </div>
      <div className={styles.icon}>📄</div>
    </div>
  );
}
