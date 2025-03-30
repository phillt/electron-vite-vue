<!-- BaseButton.vue -->
<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}>();

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
const variantClasses = {
  primary:
    "bg-brand-dark text-white hover:bg-brand-dark/90 focus:ring-brand-dark",
  secondary:
    "bg-brand-accent text-white hover:bg-brand-accent/90 focus:ring-brand-accent",
  outline:
    "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark/10 focus:ring-brand-dark",
  ghost: "text-brand-dark hover:bg-brand-dark/10 focus:ring-brand-dark",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};
</script>

<template>
  <button
    :class="[
      baseClasses,
      variantClasses[variant || 'primary'],
      sizeClasses[size || 'md'],
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    :disabled="disabled"
    :type="type || 'button'"
  >
    <slot></slot>
  </button>
</template>
