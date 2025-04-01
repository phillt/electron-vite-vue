<!-- NavItem.vue -->
<script setup lang="ts">
import { useFontAwesome } from "../../composables/useFontAwesome";

const { FontAwesomeIcon } = useFontAwesome();

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
    <FontAwesomeIcon
      v-if="icon"
      :icon="icon"
      class="mr-3 h-6 w-6"
      :class="[
        isActive
          ? 'text-white'
          : 'text-brand-muted group-hover:text-brand-text',
      ]"
    />
    {{ name }}
  </button>
</template>
