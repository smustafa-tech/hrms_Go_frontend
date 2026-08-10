import React, { forwardRef } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./Select.module.css";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;

const SelectTrigger = forwardRef(({ children, ...props }, ref) => (
  <SelectPrimitive.Trigger ref={ref} className={styles.selectTrigger} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className={styles.selectIcon} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

const SelectValue = ({ className, ...props }) => (
  <SelectPrimitive.Value
    className={`${styles.selectValue} ${className || ""}`}
    {...props}
  />
);

const SelectScrollUpButton = forwardRef((props, ref) => (
  <SelectPrimitive.ScrollUpButton ref={ref} className={styles.scrollButton} {...props}>
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));

const SelectScrollDownButton = forwardRef((props, ref) => (
  <SelectPrimitive.ScrollDownButton ref={ref} className={styles.scrollButton} {...props}>
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));

const SelectContent = forwardRef(({ children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content ref={ref} className={styles.selectContent} {...props}>
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport className={styles.selectViewport}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

const SelectItem = forwardRef(({ children, ...props }, ref) => (
  <SelectPrimitive.Item ref={ref} className={styles.selectItem} {...props}>
    <span className={styles.selectItemIndicator}>
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

const SelectLabel = forwardRef((props, ref) => (
  <SelectPrimitive.Label ref={ref} className={styles.selectLabel} {...props} />
));

const SelectSeparator = forwardRef((props, ref) => (
  <SelectPrimitive.Separator ref={ref} className={styles.selectSeparator} {...props} />
));

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
