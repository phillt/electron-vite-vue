<!-- BaseListHeader.vue -->
<script setup lang="ts">
import BaseButton from "./BaseButton.vue";

defineProps<{
  title?: string;
  subtitle?: string;
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
  <div class="px-4 py-3 sm:px-6 bg-gray-50 border-b border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {{ title || "Details" }}
        </p>
        <p v-if="subtitle" class="text-xs text-gray-400 mt-1">
          {{ subtitle }}
        </p>
      </div>
      <div v-if="action" class="ml-4">
        <BaseButton
          :variant="action.variant || 'primary'"
          size="sm"
          @click="action.onClick"
        >
          {{ action.label }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
