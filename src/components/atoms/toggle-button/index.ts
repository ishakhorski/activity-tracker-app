import { type InjectionKey, type Ref } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'

export const toggleButtonVariation = cva(
  'glass inline-flex items-center gap-1 font-medium rounded-full transition-all cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 text-muted-foreground data-[state=on]:bg-primary/15 data-[state=on]:text-primary',
  {
    variants: {
      size: {
        small: "h-8 px-2.5 text-[11px] gap-1 [&_svg:not([class*='size-'])]:size-3",
        medium: "h-10 px-3 text-xs gap-1 [&_svg:not([class*='size-'])]:size-4",
        large: "h-12 px-4 text-sm gap-1.5 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
)
export type ToggleButtonVariation = VariantProps<typeof toggleButtonVariation>

export interface ToggleButtonContext {
  pressed: Ref<boolean>
}

export const TOGGLE_BUTTON_CONTEXT_KEY: InjectionKey<ToggleButtonContext> =
  Symbol('ToggleButtonContext')

export { default as BaseToggleButton } from './BaseToggleButton.vue'
