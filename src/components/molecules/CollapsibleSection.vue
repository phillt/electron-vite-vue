<!-- CollapsibleSection.vue -->
<script setup lang="ts">
const props = defineProps<{
  title: string;
  isExpanded: boolean;
  stats?: {
    paid: number;
    total: number;
    pastDue?: number;
  };
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
}>();
</script>

<template>
  <div class="flex items-center justify-between p-4">
    <div class="flex items-center cursor-pointer" @click="emit('toggle')">
      <span class="text-brand-muted mr-2">{{ isExpanded ? "▼" : "▶" }}</span>
      <h3 class="text-base font-medium text-brand-text">{{ title }}</h3>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-brand-muted">
        {{ stats?.paid }} paid / {{ stats?.total }} total
      </span>
      <span v-if="stats?.pastDue" class="text-sm text-red-700 font-bold">
        {{ stats.pastDue }} past due
      </span>
    </div>
  </div>
</template>
