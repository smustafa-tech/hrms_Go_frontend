import React, { createContext, useContext, useId, forwardRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { useForm, Controller, FormProvider as RHFProvider, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils"; // optional utility for merging classes

// ---------- Contexts ----------
const FormFieldContext = createContext({ name: "" });
const FormItemContext = createContext({ id: "" });

// ---------- Form Provider ----------
export const Form = RHFProvider;

// ---------- FormField ----------
export const FormField = ({ name, control, children, ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} control={control} {...props}>
        {children}
      </Controller>
    </FormFieldContext.Provider>
  );
};

// ---------- useFormField Hook ----------
export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// ---------- FormItem ----------
export const FormItem = forwardRef(({ className, children, ...props }, ref) => {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

// ---------- FormLabel ----------
export const FormLabel = forwardRef(({ className, children, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return (
    <LabelPrimitive.Root
      ref={ref}
      htmlFor={formItemId}
      className={cn(error && "text-destructive", className)}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>
  );
});
FormLabel.displayName = "FormLabel";

// ---------- FormControl ----------
export const FormControl = forwardRef(({ children, ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    >
      {children}
    </Slot>
  );
});
FormControl.displayName = "FormControl";

// ---------- FormDescription ----------
export const FormDescription = forwardRef(({ className, children, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return (
    <p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
});
FormDescription.displayName = "FormDescription";

// ---------- FormMessage ----------
export const FormMessage = forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;
  if (!body) return null;

  return (
    <p ref={ref} id={formMessageId} className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";
