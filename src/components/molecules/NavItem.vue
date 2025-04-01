<!-- NavItem.vue -->
<script setup lang="ts">
defineProps<{
  name: string;
  path: string;
  icon?: string;
  isActive: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button
    @click="$emit('click')"
    :class="[
      isActive
        ? 'bg-black text-white'
        : 'text-brand-muted hover:bg-brand-background hover:text-brand-text',
      'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors mb-2',
    ]"
  >
    <svg
      v-if="icon"
      class="mr-3 h-6 w-6"
      :class="[
        isActive
          ? 'text-white'
          : 'text-brand-muted group-hover:text-brand-text',
      ]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        :d="icon"
      />
    </svg>
    {{ name }}
  </button>
</template>
