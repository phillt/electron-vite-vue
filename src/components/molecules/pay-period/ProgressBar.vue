<!-- ProgressBar.vue -->
<script setup lang="ts">
const props = defineProps<{
  currentAmount: number;
  totalAmount: number;
}>();

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
</script>

<template>
  <div class="text-right">
    <div class="flex items-center justify-end gap-2">
      <span class="text-sm text-brand-muted">Progress:</span>
      <span class="text-sm font-semibold text-brand-text">
        {{ formatCurrency(currentAmount) }} / {{ formatCurrency(totalAmount) }}
      </span>
    </div>
    <div class="w-48 h-1.5 mt-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        class="h-full bg-brand-success transition-all duration-300 rounded-full"
        :style="{
          width: `${(currentAmount / totalAmount) * 100}%`,
        }"
      ></div>
    </div>
  </div>
</template>
