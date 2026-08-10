import React from 'react';
import styles from './Structure.module.css';

export default function StructureCard({ name, rules }) {
  return (
    <div className={styles.card}>
      <div className={styles.name}>{name}</div>
      <div className={styles.rules}>{rules} rules</div>
      <div className={styles.actions}><button className={styles.btn}>Open</button></div>
    </div>
  );
}
