<!-- BaseCard.vue -->
<script setup lang="ts">
defineProps<{
  title?: string;
  padding?: "none" | "sm" | "md" | "lg";
}>();

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};
</script>

<template>
  <div class="bg-brand-surface rounded-lg shadow-sm">
    <div v-if="title" class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-brand-text">{{ title }}</h3>
    </div>
    <div :class="paddingClasses[padding || 'md']">
      <slot></slot>
    </div>
  </div>
</template>
