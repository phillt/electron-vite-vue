<!-- BaseListHeader.vue -->
<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="px-4 py-3 sm:px-6 bg-gray-50 border-b border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {{ title || "Details" }}
        </p>
      </div>
      <div class="ml-4 flex-shrink-0 flex items-center space-x-4">
        <div class="w-24"></div>
        <!-- Space for actions -->
      </div>
    </div>
  </div>
</template>
