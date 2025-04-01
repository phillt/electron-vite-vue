<!-- FinancialSummary.vue -->
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  paycheckAmount: number;
  totalAmount: number;
  totalExpenses: number;
}>();

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const remainingAmount = computed(() => {
  return (
    props.paycheckAmount - (props.totalAmount + (props.totalExpenses || 0))
  );
});
</script>

<template>
  <div class="text-right space-y-2">
    <div>
      <span class="text-brand-muted">Total Outgoing:</span>
      <span class="ml-2 font-normal text-brand-primary">
        {{ formatCurrency(totalAmount + (totalExpenses || 0)) }}
      </span>
    </div>
    <div class="flex items-center justify-end gap-2">
      <span class="text-brand-muted">Remaining:</span>
      <span
        class="font-semibold"
        :class="
          remainingAmount >= 0 ? 'text-brand-success' : 'text-brand-danger'
        "
      >
        {{ formatCurrency(remainingAmount) }}
      </span>
    </div>
  </div>
</template>
