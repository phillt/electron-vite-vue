<!-- BaseCard.vue -->
<script setup lang="ts">
defineProps<{
  title?: string;
  elevated?: boolean;
  padding?: number;
  footerBorder?: boolean;
  className?: string;
}>();
</script>

<template>
  <div
    :class="[
      'bg-white rounded-2xl shadow-sm border border-gray-200',
      elevated ? 'shadow-md' : 'shadow-sm',
      className,
    ]"
  >
    <div
      v-if="title || $slots.header"
      class="px-6 py-4 border-b border-gray-200"
    >
      <div class="flex items-center justify-between">
        <h3 v-if="title" class="text-lg font-medium text-gray-900">
          {{ title }}
        </h3>
        <slot name="header" />
      </div>
    </div>

    <div :class="[padding ? `p-${padding}` : 'p-6']">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      :class="[footerBorder && 'border-t border-gray-200', 'px-6 py-4']"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
