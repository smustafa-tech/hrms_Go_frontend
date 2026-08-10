import { useState } from "react";
import { nanoid } from "nanoid";

const toastListeners = new Set();

export function useToast() {
  const [toasts, setToasts] = useState([]);

  // Subscribe
  toastListeners.add(setToasts);

  const addToast = ({ title, description, variant = "default", action }) => {
    const id = nanoid();
    const toastObj = { id, title, description, variant, action };

    toastListeners.forEach((setter) => setter((prev) => [...prev, toastObj]));

    // Auto-remove after 3s
    setTimeout(() => {
      toastListeners.forEach((setter) =>
        setter((prev) => prev.filter((t) => t.id !== id))
      );
    }, 3000);

    return id;
  };

  return { toasts, addToast };
}

// Optional global helper
export const toast = ({ title, description, variant, action }) => {
  toastListeners.forEach((setter) =>
    setter((prev) => [...prev, { id: nanoid(), title, description, variant, action }])
  );
};
