<!-- BaseCard.vue -->
<script setup lang="ts">
defineProps<{
  title?: string;
  elevated?: boolean;
  padding?: number;
  footerBorder?: boolean;
  className?: string;
  dark?: boolean;
}>();
</script>

<template>
  <div
    :class="[
      dark
        ? 'bg-gray-900 rounded-2xl shadow-sm border border-gray-700 text-white'
        : 'bg-white rounded-2xl shadow-sm border border-gray-200',
      elevated ? 'shadow-md' : 'shadow-sm',
      className,
    ]"
  >
    <div
      v-if="title || $slots.header"
      :class="[
        'px-6 py-4',
        dark ? 'border-b border-gray-700' : 'border-b border-gray-200',
      ]"
    >
      <div class="flex items-center justify-between">
        <h3
          v-if="title"
          :class="[
            'text-lg font-medium',
            dark ? 'text-white' : 'text-gray-900',
          ]"
        >
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
      :class="[
        footerBorder &&
          (dark ? 'border-t border-gray-700' : 'border-t border-gray-200'),
        'px-6 py-4',
      ]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
