import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import { cn } from "@/lib/utils";
import styles from "./Toggle.module.css";

const Toggle = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <TogglePrimitive.Root
        ref={ref}
        className={cn(
          styles.toggle,
          styles[variant],
          styles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
