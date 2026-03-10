"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Apple-inspired button system — monochrome, glass-surfaced.
 * No bright colors; all tones derived from CSS variables.
 */
const buttonVariants = cva(
  // Base
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border font-semibold whitespace-nowrap select-none cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Solid — primary brand navy/blue
        default:
          "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent shadow-sm " +
          "hover:brightness-110 hover:-translate-y-px active:brightness-95 active:translate-y-0",

        // Glass — frosted surface, adapts light/dark
        outline:
          "bg-white/65 dark:bg-white/07 text-foreground border-[var(--border)] " +
          "backdrop-blur-lg " +
          "hover:bg-white/85 dark:hover:bg-white/12 hover:-translate-y-px " +
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.09)]",

        // Subtle tinted secondary
        secondary:
          "bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)] " +
          "hover:bg-[var(--muted)] hover:-translate-y-px",

        // Ghost — invisible until hover
        ghost:
          "bg-transparent border-transparent text-foreground " +
          "hover:bg-[var(--muted)] hover:border-[var(--border)]",

        // Destructive — soft red tint
        destructive:
          "bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 border-red-400/20 " +
          "hover:bg-red-500/18 hover:border-red-400/35",

        // Link
        link: "bg-transparent border-transparent text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3.5 text-sm",
        xs: "h-6 px-2 text-xs rounded-lg",
        sm: "h-7 px-3 text-xs rounded-lg",
        lg: "h-10 px-5 text-sm",
        xl: "h-11 px-7 text-base",
        icon: "size-8",
        "icon-xs": "size-6 rounded-lg",
        "icon-sm": "size-7 rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
