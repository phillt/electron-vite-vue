<!-- BaseInfoList.vue -->
<script setup lang="ts">
defineProps<{
  items: {
    label: string;
    value: string;
  }[];
}>();
</script>

<template>
  <div class="mt-5 space-y-3">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="flex items-center justify-between text-sm"
    >
      <span class="font-medium text-brand-muted">{{ item.label }}:</span>
      <span class="text-brand-text">{{ item.value }}</span>
    </div>
  </div>
</template>
