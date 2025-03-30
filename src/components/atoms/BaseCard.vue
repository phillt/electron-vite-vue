<!-- BaseCard.vue -->
<script setup lang="ts">
defineProps<{
  title?: string;
  padding?: "none" | "sm" | "md" | "lg";
  theme?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}>();

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const themeClasses = {
  default: {
    background: "bg-brand-surface",
    border: "border-gray-200",
  },
  primary: {
    background: "bg-brand-dark/10",
    border: "border-brand-dark/30",
  },
  secondary: {
    background: "bg-brand-accent/10",
    border: "border-brand-accent/30",
  },
  success: {
    background: "bg-brand-success/10",
    border: "border-brand-success/30",
  },
  warning: {
    background: "bg-brand-warning/10",
    border: "border-brand-warning/30",
  },
  danger: {
    background: "bg-red-50",
    border: "border-red-200",
  },
};
</script>

<template>
  <div
    :class="[
      themeClasses[theme || 'default'].background,
      'rounded-lg shadow-sm',
    ]"
  >
    <div
      v-if="title"
      :class="['px-6 py-4 border-b', themeClasses[theme || 'default'].border]"
    >
      <h3 class="text-lg font-medium text-brand-text">{{ title }}</h3>
    </div>
    <div :class="paddingClasses[padding || 'md']">
      <slot></slot>
    </div>
  </div>
</template>
