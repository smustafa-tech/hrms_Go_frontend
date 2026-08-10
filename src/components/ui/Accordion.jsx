import React, { forwardRef } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import styles from "./Accordion.module.css";

// Root
const Accordion = AccordionPrimitive.Root;

// Item
const AccordionItem = forwardRef(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={`${styles.accordionItem} ${className || ""}`}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

// Trigger
const AccordionTrigger = forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className={styles.accordionHeader}>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={`${styles.accordionTrigger} ${className || ""}`}
      {...props}
    >
      {children}
      <ChevronDown
        className={`${props["data-state"] === "open" ? styles.accordionTriggerOpen : ""}`}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

// Content
const AccordionContent = forwardRef(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={`${styles.accordionContent} ${className || ""}`}
    {...props}
  >
    <div className={styles.accordionContentInner}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
