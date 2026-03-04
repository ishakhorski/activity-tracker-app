<template>
  <div class="glass rounded-2xl px-3 py-4 flex items-center gap-3">
    <div class="flex-1 min-w-0">
      <div class="bg-foreground/8 animate-pulse h-5 w-28 rounded-md" />
      <div class="flex items-end gap-1 mt-3">
        <div v-for="i in 7" :key="i" class="flex flex-col items-center gap-1">
          <div class="bg-foreground/8 animate-pulse h-2.5 w-5 rounded" />
          <div class="bg-foreground/8 animate-pulse w-7 h-7 rounded-md" />
          <div class="bg-foreground/8 animate-pulse h-2.5 w-4 rounded" />
        </div>
      </div>
    </div>
    <div class="bg-foreground/8 animate-pulse h-12 w-13.5 rounded-full" />
  </div>
</template>
