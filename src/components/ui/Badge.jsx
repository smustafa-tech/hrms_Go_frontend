import React from "react";
import styles from "./Badge.module.css";

const Badge = ({ className = "", variant = "default", ...props }) => {
  const variantClass = styles[variant] || "";
  return (
    <div className={`${styles.badge} ${variantClass} ${className}`} {...props} />
  );
};

export {Badge};
