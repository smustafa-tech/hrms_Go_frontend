import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({ style, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    style={{
      display: "flex",
      justifyContent: "center",
      margin: "0 auto",
      width: "100%",
      ...style,
    }}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef(({ style, ...props }, ref) => (
  <ul
    ref={ref}
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "0.25rem",
      listStyle: "none",
      padding: 0,
      margin: 0,
      ...style,
    }}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef(({ style, ...props }, ref) => (
  <li ref={ref} style={{ ...style }} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ isActive, style, children, ...props }) => (
  <a
    aria-current={isActive ? "page" : undefined}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.5rem 0.75rem",
      borderRadius: "0.375rem",
      border: isActive ? "1px solid #3b82f6" : "1px solid transparent",
      backgroundColor: isActive ? "#fff" : "transparent",
      color: isActive ? "#3b82f6" : "#111827",
      cursor: "pointer",
      textDecoration: "none",
      gap: "0.25rem",
      fontSize: "0.875rem",
      fontWeight: 500,
      ...style,
    }}
    {...props}
  >
    {children}
  </a>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ style, children, ...props }) => (
  <PaginationLink
    aria-label="Go to previous page"
    style={{ paddingLeft: "0.625rem", gap: "0.25rem", ...style }}
    {...props}
  >
    <ChevronLeft style={{ width: "1rem", height: "1rem" }} />
    <span>{children || "Previous"}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ style, children, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    style={{ paddingRight: "0.625rem", gap: "0.25rem", ...style }}
    {...props}
  >
    <span>{children || "Next"}</span>
    <ChevronRight style={{ width: "1rem", height: "1rem" }} />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ style, ...props }) => (
  <span
    aria-hidden
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "2.25rem",
      height: "2.25rem",
      ...style,
    }}
    {...props}
  >
    <MoreHorizontal style={{ width: "1rem", height: "1rem" }} />
    <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
