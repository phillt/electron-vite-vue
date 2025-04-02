<!-- BasePage.vue -->
<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <header class="mb-8 border-b border-gray-300 pb-4">
      <div class="flex justify-between items-center">
        <div class="text-left">
          <h1 class="text-2xl font-bold text-brand-text">{{ title }}</h1>
          <p v-if="description" class="mt-2 text-sm text-brand-muted">
            {{ description }}
          </p>
        </div>
        <div class="flex space-x-4">
          <slot name="actions" />
        </div>
      </div>
    </header>

    <slot />
  </div>
</template>
