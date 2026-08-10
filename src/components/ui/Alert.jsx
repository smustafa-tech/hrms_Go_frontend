import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./Alert.module.css";

// ---------- Alert ----------
const Alert = forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(styles.alert, styles[variant], className)}
    {...props}
  />
));
Alert.displayName = "Alert";

// ---------- Alert Title ----------
const AlertTitle = forwardRef(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn(styles.title, className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

// ---------- Alert Description ----------
const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(styles.description, className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
