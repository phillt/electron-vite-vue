<!-- FormGroup.vue -->
<script setup lang="ts">
import BaseInput from "../atoms/BaseInput.vue";

defineProps<{
  modelValue: string | number;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helper?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <div class="space-y-1">
    <BaseInput
      v-bind="$props"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
    <p v-if="helper && !error" class="text-sm text-brand-muted">{{ helper }}</p>
  </div>
</template>
