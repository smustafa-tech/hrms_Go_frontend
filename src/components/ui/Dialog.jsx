import React, { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import styles from "./Dialog.module.css"; // your CSS Module

// Root components
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

// Overlay
const DialogOverlay = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={`${styles.overlay} ${className || ""}`}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

// Content
const DialogContent = forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={`${styles.content} ${className || ""}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

// Header
const DialogHeader = ({ className, ...props }) => (
  <div className={`${styles.header} ${className || ""}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

// Footer
const DialogFooter = ({ className, ...props }) => (
  <div className={`${styles.footer} ${className || ""}`} {...props} />
);
DialogFooter.displayName = "DialogFooter";

// Title
const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`${styles.title} ${className || ""}`}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

// Description
const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={`${styles.description} ${className || ""}`}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

// Optional Close Button
const DialogCloseButton = forwardRef(({ className, ...props }, ref) => (
  <DialogClose
    ref={ref}
    className={`${styles.closeButton} ${className || ""}`}
    {...props}
  >
    <X className={styles.closeIcon} />
    <span className="sr-only">Close</span>
  </DialogClose>
));
DialogCloseButton.displayName = "DialogCloseButton";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogCloseButton,
};
