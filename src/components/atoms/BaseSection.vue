<!-- BaseSection.vue -->
<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

defineProps<{
  title: string;
  action?: {
    label: string;
    variant?:
      | "primary"
      | "outline"
      | "popular"
      | "cheapest"
      | "recommended"
      | "icon"
      | "tag"
      | "ghost";
    onClick: () => void;
  };
}>();
</script>

<template>
  <div class="flex justify-between items-center mb-6">
    <h3 class="text-lg font-medium text-brand-text">{{ title }}</h3>
    <slot />
    <BaseButton
      v-if="action"
      :variant="action?.variant || 'primary'"
      @click="action?.onClick"
    >
      {{ action?.label }}
    </BaseButton>
  </div>
</template>
