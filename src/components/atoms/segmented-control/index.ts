import { cva, type VariantProps } from "class-variance-authority";

export const segmentedControlVariation = cva("glass inline-flex rounded-full p-0.5");
export type SegmentedControlVariation = VariantProps<typeof segmentedControlVariation>;

export const segmentedControlButtonVariation = cva(
  "inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
export type SegmentedControlButtonVariation = VariantProps<typeof segmentedControlButtonVariation>;

export { default as BaseSegmentedControl } from "./BaseSegmentedControl.vue";
export { default as BaseSegmentedControlButton } from "./BaseSegmentedControlButton.vue";
