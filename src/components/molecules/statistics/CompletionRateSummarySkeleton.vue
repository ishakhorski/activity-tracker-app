<template>
  <!-- grid grid-cols-3 divide-x → mirrors CompletionRateSummary exactly             -->
  <!-- col 1: text-xs(16px) + gap-0.5(2px) + text-3xl(36px) = 54px content height   -->
  <!-- col 2/3: text-xs(16px) + gap-0.5(2px) + text-xl(28px) = 46px content height  -->
  <div class="glass rounded-2xl px-4 py-3 grid grid-cols-3">
    <div class="flex flex-col gap-0.5 pr-4 border-r border-border">
      <div class="h-4 w-24 rounded-full bg-foreground/8 animate-pulse" />
      <div class="h-9 w-16 rounded-lg bg-foreground/8 animate-pulse" />
    </div>
    <div class="flex flex-col gap-0.5 px-4">
      <div class="h-4 w-16 rounded-full bg-foreground/8 animate-pulse" />
      <div class="h-7 w-10 rounded-lg bg-foreground/8 animate-pulse" />
    </div>
    <div class="flex flex-col gap-0.5 pl-4">
      <div class="h-4 w-16 rounded-full bg-foreground/8 animate-pulse" />
      <div class="h-7 w-10 rounded-lg bg-foreground/8 animate-pulse" />
    </div>
  </div>
</template>
