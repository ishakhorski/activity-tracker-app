import { type InjectionKey, type Ref } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'

export const numberStepperVariation = cva('inline-flex items-stretch glass rounded-full', {
  variants: {
    size: {
      small: 'h-8',
      medium: 'h-10',
      large: 'h-12',
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
export type NumberStepperVariation = VariantProps<typeof numberStepperVariation>

export const numberStepperButtonVariation = cva(
  'flex items-center justify-center shrink-0 cursor-pointer transition-colors hover:bg-foreground/5 active:bg-foreground/10 disabled:opacity-40 disabled:pointer-events-none rounded-l-full [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      size: {
        small: "w-8 [&_svg:not([class*='size-'])]:size-2",
        medium: "w-10 [&_svg:not([class*='size-'])]:size-3",
        large: "w-12 [&_svg:not([class*='size-'])]:size-4",
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
export type NumberStepperButtonVariation = VariantProps<typeof numberStepperButtonVariation>

export const numberStepperInputVariation = cva(
  'bg-transparent text-center font-semibold tabular-nums outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]',
  {
    variants: {
      size: {
        small: 'w-8 text-xs',
        medium: 'w-10 text-sm',
        large: 'w-12 text-base',
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
export type NumberStepperInputVariation = VariantProps<typeof numberStepperInputVariation>

export interface NumberStepperContext {
  modelValue: Ref<number>
  min: number
  max: number | undefined
  size: NumberStepperVariation['size']
  canDecrement: Ref<boolean>
  canIncrement: Ref<boolean>
  decrement: () => void
  increment: () => void
  updateValue: (value: number) => void
}

export const NUMBER_STEPPER_CONTEXT_KEY: InjectionKey<NumberStepperContext> =
  Symbol('NumberStepperContext')

export { default as BaseNumberStepper } from './BaseNumberStepper.vue'
export { default as BaseNumberStepperDecreaseButton } from './BaseNumberStepperDecreaseButton.vue'
export { default as BaseNumberStepperIncreaseButton } from './BaseNumberStepperIncreaseButton.vue'
export { default as BaseNumberStepperInput } from './BaseNumberStepperInput.vue'
