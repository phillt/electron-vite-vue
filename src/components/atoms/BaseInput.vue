<!-- BaseInput.vue -->
<script setup lang="ts">
defineProps<{
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const baseClasses =
  "block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-dark focus:ring-brand-dark sm:text-sm";
const errorClasses =
  "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500";
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-brand-text mb-1">
      {{ label }}
    </label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        baseClasses,
        error ? errorClasses : 'border-gray-300',
        disabled ? 'bg-brand-background cursor-not-allowed' : '',
      ]"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
