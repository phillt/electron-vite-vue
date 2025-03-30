<!-- BaseButton.vue -->
<script setup lang="ts">
defineProps<{
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "warning";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}>();

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = {
  primary:
    "bg-brand-dark text-white hover:bg-brand-dark50 focus:ring-brand-dark50 shadow-sm",
  secondary:
    "bg-brand-accent text-white hover:bg-brand-accent/90 focus:ring-brand-accent20 shadow-sm",
  outline:
    "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark50/10 focus:ring-brand-dark50",
  ghost: "text-brand-muted hover:text-brand-text focus:ring-brand-dark50",
  danger:
    "border-2 border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-500/20",
  success:
    "bg-brand-success text-white hover:bg-brand-success/90 focus:ring-brand-success30 shadow-sm",
  warning:
    "bg-brand-warning text-white hover:bg-brand-warning/90 focus:ring-brand-warning20 shadow-sm",
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
    ]"
    :disabled="disabled"
    :type="type || 'button'"
  >
    <slot></slot>
  </button>
</template>
