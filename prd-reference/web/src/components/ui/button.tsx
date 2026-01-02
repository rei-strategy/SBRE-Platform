"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_10px_40px_rgba(67,97,238,0.35)] hover:opacity-90",
        secondary:
          "bg-secondary text-secondary-foreground border border-border/70 hover:border-primary/70 hover:text-foreground",
        ghost:
          "border border-white/20 bg-transparent text-foreground hover:border-primary/50 hover:text-primary",
        outline:
          "border border-border bg-background text-foreground hover:border-primary/80 hover:text-primary",
        link: "text-primary underline-offset-4 hover:text-primary/80 hover:underline",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-14 rounded-full px-9 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
