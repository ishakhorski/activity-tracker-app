<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute } from 'vue-router'

import { ACTIVITY_TYPE, type ActivityType } from '@/types/activityType'

import PersonalActivityDetailsView from './PersonalActivityDetailsView.vue'
import GroupActivityDetailsView from './GroupActivityDetailsView.vue'

const DETAIL_VIEWS: Record<ActivityType, Component> = {
  [ACTIVITY_TYPE.PERSONAL]: PersonalActivityDetailsView,
  [ACTIVITY_TYPE.GROUP]: GroupActivityDetailsView,
}

const route = useRoute()
const type = computed(() => route.params.type as ActivityType)

const detailComponent = computed(() => DETAIL_VIEWS[type.value] ?? PersonalActivityDetailsView)
</script>

<template>
  <component :is="detailComponent" />
</template>
