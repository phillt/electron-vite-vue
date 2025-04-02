<!-- DateRangeBadge.vue -->
<script setup lang="ts">
const props = defineProps<{
  startDate: string;
  endDate: string;
  status: {
    label: string;
    badge: string;
  };
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};
</script>

<template>
  <div class="flex items-center gap-2">
    <h3 class="text-lg font-medium text-brand-text">
      {{ formatDate(startDate) }} - {{ formatDate(endDate) }}
    </h3>
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      :class="status.badge"
    >
      {{ status.label }}
    </span>
  </div>
</template>
