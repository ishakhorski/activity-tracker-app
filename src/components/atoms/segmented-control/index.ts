import { type InjectionKey, type Ref } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'

export const segmentedControlVariation = cva('glass inline-flex rounded-full', {
  variants: {
    size: {
      small: 'p-0.5',
      medium: 'p-0.5',
      large: 'p-1',
    },
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    size: 'medium',
    variant: 'default',
  },
})
export type SegmentedControlVariation = VariantProps<typeof segmentedControlVariation>

export const segmentedControlButtonVariation = cva(
  'inline-flex items-center justify-center font-medium rounded-full transition-all cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 text-muted-foreground data-[state=active]:bg-primary/15 data-[state=active]:text-primary',
  {
    variants: {
      size: {
        small: "h-7 px-2.5 gap-1 text-[11px] [&_svg:not([class*='size-'])]:size-3",
        medium: "h-9 px-3 gap-1 text-xs [&_svg:not([class*='size-'])]:size-4",
        large: "h-10 px-4 gap-1.5 text-sm [&_svg:not([class*='size-'])]:size-4",
      },
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      size: 'medium',
      variant: 'default',
    },
  },
)
export type SegmentedControlButtonVariation = VariantProps<typeof segmentedControlButtonVariation>

export interface SegmentedControlContext {
  modelValue: Ref<string>
  size: SegmentedControlVariation['size']
  values: Ref<string[]>
  register: (value: string) => void
  unregister: (value: string) => void
  select: (value: string) => void
}

export const SEGMENTED_CONTROL_CONTEXT_KEY: InjectionKey<SegmentedControlContext> =
  Symbol('SegmentedControlContext')

export { default as BaseSegmentedControl } from './BaseSegmentedControl.vue'
export { default as BaseSegmentedControlButton } from './BaseSegmentedControlButton.vue'
