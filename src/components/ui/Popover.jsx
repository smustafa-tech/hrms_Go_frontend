import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef(
  ({ align = "center", sideOffset = 4, style, ...props }, ref) => {
    const baseStyle = {
      zIndex: 50,
      width: "18rem",           // w-72
      borderRadius: "0.375rem", // rounded-md
      border: "1px solid #e5e7eb",
      backgroundColor: "#fff",   // bg-popover
      color: "#111827",          // text-popover-foreground
      padding: "1rem",           // p-4
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      outline: "none",
      animationDuration: "0.2s",
      animationTimingFunction: "ease-out",
      ...style
    };

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          style={baseStyle}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  }
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
