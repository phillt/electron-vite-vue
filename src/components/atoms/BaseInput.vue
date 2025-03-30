<!-- BaseInput.vue -->
<script setup lang="ts">
defineProps<{
  modelValue: string | number;
  type?: "text" | "number" | "date" | "email" | "password" | "tel";
  label?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  helperText?: string;
  error?: string;
  prefix?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
  (e: "change", event: Event): void;
}>();
</script>

<template>
  <div>
    <label
      v-if="label"
      :for="id || name"
      class="block text-sm font-medium text-brand-text"
    >
      {{ label }}
    </label>
    <div class="mt-1 relative rounded-md shadow-sm">
      <div
        v-if="prefix"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <span class="text-brand-muted sm:text-sm">{{ prefix }}</span>
      </div>
      <input
        :type="type || 'text'"
        :id="id || name"
        :name="name"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @change="$emit('change', $event)"
        :class="[
          prefix ? 'pl-7' : 'pl-3',
          'block w-full rounded-md border-brand-surface shadow-sm focus:border-brand-dark focus:ring-brand-dark sm:text-sm',
          disabled ? 'bg-brand-surface/50 cursor-not-allowed' : 'bg-white',
          error
            ? 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger'
            : '',
        ]"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :min="min"
        :max="max"
        :step="step"
      />
    </div>
    <p v-if="helperText && !error" class="mt-1 text-sm text-brand-muted">
      {{ helperText }}
    </p>
    <p v-if="error" class="mt-1 text-sm text-brand-danger">
      {{ error }}
    </p>
  </div>
</template>
