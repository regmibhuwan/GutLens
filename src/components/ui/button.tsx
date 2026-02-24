import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-sage-500 text-white hover:bg-sage-600 shadow-md hover:shadow-lg",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-md",
        outline:
          "border-2 border-sage-200 bg-background hover:bg-sage-50 hover:border-sage-300 dark:border-sage-700 dark:hover:bg-sage-900/30",
        secondary:
          "bg-sage-100 text-sage-800 hover:bg-sage-200 dark:bg-sage-800 dark:text-sage-100 dark:hover:bg-sage-700",
        ghost:
          "hover:bg-sage-100 hover:text-sage-800 dark:hover:bg-sage-800 dark:hover:text-sage-100",
        link: "text-sage-600 underline-offset-4 hover:underline dark:text-sage-400",
        teal: "bg-teal-500 text-white hover:bg-teal-600 shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
