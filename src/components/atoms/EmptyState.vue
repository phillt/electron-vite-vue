<template>
  <BaseCard :padding="8" class="max-w-md mx-auto" dark>
    <div class="text-center">
      <AstreosLogo v-if="showLogo" class="w-16 h-16 mx-auto mb-4" />
      <slot v-else name="icon" />
      <h3 class="text-3xl text-white font-medium text-brand-text mb-10">
        {{ title }}
      </h3>
      <p class="mt-4 text-sm text-gray-300 mb-8">{{ description }}</p>
      <div v-if="$slots.actions" class="flex justify-end">
        <slot name="actions"></slot>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import AstreosLogo from "../../icons/AstreosLogo.vue";
import BaseCard from "./BaseCard.vue";

defineProps<{
  title: string;
  description: string;
  showLogo?: boolean;
}>();
</script>
