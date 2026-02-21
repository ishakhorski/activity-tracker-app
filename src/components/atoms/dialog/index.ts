import { cva, type VariantProps } from 'class-variance-authority'

export const baseDialogOverlayVariation = cva(
  'fixed inset-0 z-50 bg-foreground/8 dark:bg-foreground/18 backdrop-blur-xs data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out',
)

export const baseDialogContentVariation = cva(
  'fixed z-50 grid gap-4 glass rounded-t-2xl p-6 shadow-lg inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto data-[state=open]:animate-content-in data-[state=closed]:animate-content-out',
  {
    variants: {
      variant: {
        default: 'max-w-full sm:max-w-lg sm:mx-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
export type BaseDialogContentVariation = VariantProps<typeof baseDialogContentVariation>

export const baseDialogScrollOverlayVariation = cva(
  'fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 backdrop-blur-xs data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out',
)

export const baseDialogScrollContentVariation = cva(
  'relative z-50 my-4 grid w-full gap-4 glass rounded-2xl p-6 shadow-lg sm:my-8 data-[state=open]:animate-content-in data-[state=closed]:animate-content-out',
  {
    variants: {
      variant: {
        default: 'max-w-280',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const baseDialogHeaderVariation = cva('flex flex-col gap-1.5 text-center sm:text-left')

export const baseDialogFooterVariation = cva(
  'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
)

export const baseDialogTitleVariation = cva('text-lg font-semibold leading-none tracking-tight')

export const baseDialogDescriptionVariation = cva('text-sm text-muted-foreground')

export const baseDialogCloseButtonVariation = cva(
  'absolute top-4 right-4 rounded-md p-1 opacity-70 outline-none transition-opacity cursor-pointer hover:opacity-100 active:scale-90 active:opacity-50 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
)

export { default as BaseDialog } from './BaseDialog.vue'
export { default as BaseDialogClose } from './BaseDialogClose.vue'
export { default as BaseDialogContent } from './BaseDialogContent.vue'
export { default as BaseDialogDescription } from './BaseDialogDescription.vue'
export { default as BaseDialogFooter } from './BaseDialogFooter.vue'
export { default as BaseDialogHeader } from './BaseDialogHeader.vue'
export { default as BaseDialogOverlay } from './BaseDialogOverlay.vue'
export { default as BaseDialogScrollContent } from './BaseDialogScrollContent.vue'
export { default as BaseDialogTitle } from './BaseDialogTitle.vue'
export { default as BaseDialogTrigger } from './BaseDialogTrigger.vue'
