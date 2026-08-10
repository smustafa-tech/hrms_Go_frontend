import React from "react";
import styles from "./Textarea.module.css";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`${styles.textarea} ${className || ""}`}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
