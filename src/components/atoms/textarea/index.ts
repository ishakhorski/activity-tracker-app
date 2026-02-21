import { cva, type VariantProps } from 'class-variance-authority'

export const textareaVariation = cva(
  'w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {},
    defaultVariants: {},
  },
)
export type TextareaVariation = VariantProps<typeof textareaVariation>

export { default as BaseTextarea } from './BaseTextarea.vue'
