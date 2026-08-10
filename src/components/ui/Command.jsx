import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Search } from "lucide-react";
import styles from "./Command.module.css";

// Main Command wrapper
const Command = React.forwardRef((props, ref) => (
  <CommandPrimitive.Root ref={ref} className={styles.commandRoot} {...props} />
));
Command.displayName = "Command";

// Dialog wrapper
const CommandDialog = ({ children, ...props }) => (
  <Dialog {...props}>
    <DialogContent className={styles.dialogContent}>
      <Command>{children}</Command>
    </DialogContent>
  </Dialog>
);

// Input field with icon
const CommandInput = React.forwardRef(({ ...props }, ref) => (
  <div className={styles.commandInputWrapper}>
    <Search className={styles.commandIcon} />
    <CommandPrimitive.Input ref={ref} className={styles.commandInput} {...props} />
  </div>
));
CommandInput.displayName = "CommandInput";

// List of items
const CommandList = React.forwardRef((props, ref) => (
  <CommandPrimitive.List ref={ref} className={styles.commandList} {...props} />
));
CommandList.displayName = "CommandList";

// Empty state
const CommandEmpty = React.forwardRef((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className={styles.commandEmpty} {...props} />
));
CommandEmpty.displayName = "CommandEmpty";

// Group with heading
const CommandGroup = React.forwardRef(({ heading, ...props }, ref) => (
  <CommandPrimitive.Group ref={ref} className={styles.commandGroup} {...props}>
    {heading && <div className={styles.commandGroupHeading}>{heading}</div>}
    {props.children}
  </CommandPrimitive.Group>
));
CommandGroup.displayName = "CommandGroup";

// Separator
const CommandSeparator = React.forwardRef((props, ref) => (
  <CommandPrimitive.Separator ref={ref} className={styles.commandSeparator} {...props} />
));
CommandSeparator.displayName = "CommandSeparator";

// Individual item
const CommandItem = React.forwardRef((props, ref) => (
  <CommandPrimitive.Item ref={ref} className={styles.commandItem} {...props} />
));
CommandItem.displayName = "CommandItem";

// Shortcut label
const CommandShortcut = ({ ...props }) => (
  <span className={styles.commandShortcut} {...props} />
);
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
