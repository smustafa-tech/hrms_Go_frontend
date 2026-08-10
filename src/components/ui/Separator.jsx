import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

const Separator = React.forwardRef(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => {
    const inlineStyle = {
      backgroundColor: "var(--color-border)",
      flexShrink: 0,
      height: orientation === "horizontal" ? "1px" : "100%",
      width: orientation === "horizontal" ? "100%" : "1px",
    };

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        style={inlineStyle}
        className={className}
        {...props}
      />
    );
  }
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
