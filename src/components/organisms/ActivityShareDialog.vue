<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import QRCode from 'qrcode'

import {
  BaseDialog,
  BaseDialogContent,
  BaseDialogHeader,
  BaseDialogTitle,
} from '@/components/atoms/dialog'
import { BaseButton } from '@/components/atoms/button'

const props = defineProps<{
  activityId: string
  activityTitle: string
}>()

const open = defineModel<boolean>('open', { default: false })

const url = computed(() => `${window.location.origin}/join/${props.activityId}`)
const qrDataUrl = ref('')
const copied = ref(false)

watch([open, () => props.activityId], async ([isOpen]) => {
  if (isOpen) {
    qrDataUrl.value = await QRCode.toDataURL(url.value, {
      width: 220,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })
  }
})

const copyLink = async () => {
  await navigator.clipboard.writeText(url.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const canShare = computed(() => typeof navigator.share === 'function')

const shareLink = () => navigator.share({ title: props.activityTitle, url: url.value })
</script>

<template>
  <BaseDialog v-model:open="open">
    <BaseDialogContent>
      <BaseDialogHeader>
        <BaseDialogTitle>Invite Members</BaseDialogTitle>
      </BaseDialogHeader>

      <div class="flex flex-col items-center gap-4">
        <div class="bg-white rounded-2xl p-3">
          <img
            v-if="qrDataUrl"
            :src="qrDataUrl"
            alt="QR code to join activity"
            class="w-44 h-44 block"
          />
          <div v-else class="w-44 h-44 rounded-xl bg-neutral-100 animate-pulse" />
        </div>

        <p
          class="text-[11px] text-muted-foreground font-mono text-center break-all leading-relaxed px-1"
        >
          {{ url }}
        </p>

        <div class="flex gap-2 w-full">
          <BaseButton variant="secondary" class="flex-1 overflow-hidden" @click="copyLink">
            <Transition name="label-swap" mode="out-in">
              <span :key="copied ? 'copied' : 'copy'">{{ copied ? 'Copied!' : 'Copy Link' }}</span>
            </Transition>
          </BaseButton>
          <BaseButton v-if="canShare" variant="secondary" class="flex-1" @click="shareLink">
            Share
          </BaseButton>
        </div>
      </div>
    </BaseDialogContent>
  </BaseDialog>
</template>
