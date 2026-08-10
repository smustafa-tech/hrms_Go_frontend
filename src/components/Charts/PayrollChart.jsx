import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./Chart.module.css";

const data = [
  { month: "Jan", payroll: 4000 },
  { month: "Feb", payroll: 3000 },
  { month: "Mar", payroll: 5000 },
  { month: "Apr", payroll: 4500 },
  { month: "May", payroll: 4800 },
];

const PayrollChart = () => {
  return (
    <div className={styles.chartCard}>
      <h3>Monthly Payroll Expenses</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="payroll" fill="#82ca9d" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PayrollChart;
