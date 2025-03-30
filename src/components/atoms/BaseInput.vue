<!-- BaseInput.vue -->
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`,
  },
  placeholder: {
    type: String,
    default: "",
  },
  helperText: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
  prefix: {
    type: String,
    default: "",
  },
  suffix: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);

const inputRef = computed(() => `input-${props.name}`);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const handleBlur = (event: Event) => {
  emit("blur", event);
};
</script>

<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>

    <div class="relative rounded-2xl shadow-sm">
      <!-- Left Icon/Prefix -->
      <div
        v-if="icon || prefix"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <span v-if="icon" :class="[icon, 'text-gray-400 w-5 h-5']"></span>
        <span v-else-if="prefix" class="text-gray-500">{{ prefix }}</span>
      </div>

      <!-- Input Element -->
      <input
        :id="id"
        :ref="inputRef"
        v-bind="$attrs"
        :value="modelValue"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'block w-full py-3 border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow',
          icon || prefix ? 'pl-10' : 'pl-4',
          suffix ? 'pr-10' : 'pr-4',
          disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white',
          error ? 'border-error focus:ring-error/30' : 'border-gray-200',
        ]"
        @input="handleInput"
        @blur="handleBlur"
      />

      <!-- Right Icon/Suffix -->
      <div
        v-if="suffix"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <span class="text-gray-500">{{ suffix }}</span>
      </div>
    </div>

    <!-- Helper Text -->
    <p
      v-if="helperText || error"
      class="text-sm"
      :class="error ? 'text-error' : 'text-gray-500'"
    >
      {{ error || helperText }}
    </p>
  </div>
</template>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  color: transparent;
  background: none;
  z-index: 1;
}

input[type="date"]::-webkit-calendar-picker-indicator::after {
  content: "";
  display: block;
  background: var(--color-gray-400);
  width: 14px;
  height: 14px;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12H20Zm0-9H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}
</style>
