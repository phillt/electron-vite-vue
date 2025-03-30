<!-- BaseButton.vue -->
<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?:
    | "primary"
    | "outline"
    | "popular"
    | "cheapest"
    | "recommended"
    | "icon"
    | "tag"
    | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  count?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  type: "button",
  loading: false,
  disabled: false,
  className: "",
});

const sizeClasses = {
  xs: "px-2.5 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const baseClasses = computed(() => [
  "inline-flex items-center justify-center relative transition-all duration-200",
  "focus:outline-none focus:ring-1 focus:ring-offset-0",
  "font-medium rounded-lg",
  props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
  sizeClasses[props.size],
  variantClasses[props.variant],
  props.className,
]);

const variantClasses = {
  primary:
    "bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-900/20 shadow-sm",
  outline:
    "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-200/50",
  popular: "bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-200/50",
  cheapest:
    "bg-orange-50 text-orange-700 hover:bg-orange-100 focus:ring-orange-200/50",
  recommended:
    "bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-200/50",
  icon: "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-200/50 p-2",
  tag: "bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-200/50",
  ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-200/50",
};
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="baseClasses"
    v-bind="$attrs"
  >
    <span
      :class="[{ 'opacity-0': loading }, 'inline-flex items-center gap-1.5']"
    >
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
      <span v-if="count" class="ml-1.5 text-xs font-normal opacity-80">{{
        count
      }}</span>
    </span>
    <span
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <svg
        class="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </span>
  </button>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
