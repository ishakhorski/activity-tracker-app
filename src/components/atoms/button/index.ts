import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariation = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-sm font-medium rounded-full outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "glass bg-primary/15 text-primary border-primary/20 hover:bg-primary/25 hover:glass-hover active:bg-primary/35",
        secondary:
          "glass text-foreground hover:bg-foreground/5 hover:glass-hover active:bg-foreground/10",
      },
      size: {
        small: "h-8 gap-1.5 px-3 text-xs has-[>svg]:px-2 active:scale-[0.97]",
        medium: "h-10 px-4 has-[>svg]:px-3 active:scale-95",
        large: "h-12 px-6 text-base has-[>svg]:px-4 active:scale-[0.97]",
        icon: "size-10 p-0 active:scale-90",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
    },
  },
);
export type ButtonVariation = VariantProps<typeof buttonVariation>;

export { default as BaseButton } from "./BaseButton.vue";
