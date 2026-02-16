import { cva, type VariantProps } from "class-variance-authority";

export const toggleButtonVariation = cva(
  "glass inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      active: {
        true: "bg-primary/15 text-primary",
        false: "text-muted-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
export type ToggleButtonVariation = VariantProps<typeof toggleButtonVariation>;

export { default as BaseToggleButton } from "./BaseToggleButton.vue";
