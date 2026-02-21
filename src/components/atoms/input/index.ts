import { cva, type VariantProps } from 'class-variance-authority'

export const inputVariation = cva(
  'h-10 w-full rounded-lg border border-border bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {},
    defaultVariants: {},
  },
)
export type InputVariation = VariantProps<typeof inputVariation>

export { default as BaseInput } from './BaseInput.vue'
