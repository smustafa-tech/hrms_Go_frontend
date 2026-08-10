import React, { forwardRef } from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import "./ScrollArea.module.css";

const ScrollArea = forwardRef(({ className = "", children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={`scroll-area-root ${className}`}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="scroll-area-viewport">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner className="scroll-area-corner" />
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = "ScrollArea";

const ScrollBar = forwardRef(
  ({ className = "", orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={`scroll-bar ${
        orientation === "vertical" ? "vertical" : "horizontal"
      } ${className}`}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="scroll-thumb" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
);

ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
