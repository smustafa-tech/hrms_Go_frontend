import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import styles from "./Switch.module.css"; // import CSS module
import { cn } from "@/lib/utils";

const Switch = React.forwardRef(
  ({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(styles.switchRoot, className)}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb className={styles.switchThumb} />
    </SwitchPrimitives.Root>
  )
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
