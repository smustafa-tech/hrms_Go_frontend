import React, { forwardRef } from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils"; // optional utility for merging class names
import { buttonVariants } from "@/components/ui/Button"; // your button styles
import styles from "./AlertDialog.module.css";

// ---------- Root ----------
const AlertDialog = AlertDialogPrimitive.Root;

// ---------- Trigger ----------
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

// ---------- Portal ----------
const AlertDialogPortal = AlertDialogPrimitive.Portal;

// ---------- Overlay ----------
const AlertDialogOverlay = forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(styles.overlay, className)}
    {...props}
  />
));
AlertDialogOverlay.displayName = "AlertDialogOverlay";

// ---------- Content ----------
const AlertDialogContent = forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(styles.content, className)}
      {...props}
    />
  </AlertDialogPortal>
));
AlertDialogContent.displayName = "AlertDialogContent";

// ---------- Header ----------
const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn(styles.header, className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

// ---------- Footer ----------
const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn(styles.footer, className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

// ---------- Title ----------
const AlertDialogTitle = forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn(styles.title, className)} {...props} />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

// ---------- Description ----------
const AlertDialogDescription = forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn(styles.description, className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

// ---------- Action ----------
const AlertDialogAction = forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
));
AlertDialogAction.displayName = "AlertDialogAction";

// ---------- Cancel ----------
const AlertDialogCancel = forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props}
  />
));
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
