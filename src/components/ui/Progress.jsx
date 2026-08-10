import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = React.forwardRef(({ value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    style={{
      position: "relative",
      width: "100%",
      height: "1rem",            // h-4
      borderRadius: "0.5rem",    // rounded-full
      overflow: "hidden",
      backgroundColor: "#e5e7eb", // bg-secondary
    }}
    {...props}
  >
    <ProgressPrimitive.Indicator
      style={{
        height: "100%",
        backgroundColor: "#3b82f6", // bg-primary
        transition: "transform 0.3s ease",
        transform: `translateX(-${100 - (value || 0)}%)`,
        flex: 1,
      }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
