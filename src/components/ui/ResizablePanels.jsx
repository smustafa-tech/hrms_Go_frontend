import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
import styles from "./ResizablePanels.module.css";
import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({ className, ...props }) => (
  <ResizablePrimitive.PanelGroup
    className={cn(styles.panelGroup, className)}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({ withHandle, className, ...props }) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(styles.handle, className)}
    {...props}
  >
    {withHandle && (
      <div className={styles.handleGrip}>
        <GripVertical className={styles.gripIcon} />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
