"use client";

import React from "react";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      offset={16}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-lg group-[.toaster]:border group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          title: "group-[.toast]:font-semibold group-[.toast]:text-base",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:font-medium",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:font-medium",
          success: "group-[.toaster]:border-[#6ba56a]/40 group-[.toaster]:bg-[#6ba56a]/10 group-[.toaster]:shadow-[#6ba56a]/20",
          error: "group-[.toaster]:border-destructive/40 group-[.toaster]:bg-destructive/10 group-[.toaster]:shadow-destructive/20",
        },
        style: {
          borderRadius: "0.5rem",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
