<template>
  <div class="h-40 flex gap-2">
    <div class="w-8 flex flex-col justify-between pt-2 pb-7">
      <div class="h-2.5 w-7 rounded-full bg-foreground/8 animate-pulse" />
      <div class="h-2.5 w-6 rounded-full bg-foreground/8 animate-pulse" />
      <div class="h-2.5 w-5 rounded-full bg-foreground/8 animate-pulse" />
    </div>
    <div class="flex-1 flex flex-col">
      <div class="flex-1 flex flex-col justify-between pt-2">
        <div class="h-px w-full bg-foreground/8 animate-pulse" />
        <div class="h-px w-full bg-foreground/8 animate-pulse" />
        <div class="h-px w-full bg-foreground/8 animate-pulse" />
      </div>
      <div class="h-7 flex items-center justify-between">
        <div v-for="i in 5" :key="i" class="h-2.5 w-8 rounded-full bg-foreground/8 animate-pulse" />
      </div>
    </div>
  </div>
</template>
