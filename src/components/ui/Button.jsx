import { forwardRef } from "react";
import styles from "./Button.module.css";

const Button = forwardRef(
  ({ children, variant = "default", size = "default", className = "", ...props }, ref) => {
    const classes = [
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      className
    ].filter(Boolean).join(" ");

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
