<!-- PayPeriodExpenses.vue -->
<script setup lang="ts">
import type { PayPeriod } from "../../services/budgetService";
import BaseButton from "../atoms/BaseButton.vue";
import BaseInput from "../atoms/BaseInput.vue";

const props = defineProps<{
  payPeriod: PayPeriod;
  status: {
    label: string;
    class: string;
    badge: string;
  };
}>();

const emit = defineEmits<{
  (e: "togglePaid", expenseId: string): void;
  (e: "updateAmount", expenseId: string, amount: number): void;
}>();

const handleAmountChange = (expenseId: string, amount: string) => {
  emit("updateAmount", expenseId, Number(amount));
};
</script>

<template>
  <div class="p-4">
    <div
      v-if="payPeriod.expenses.length === 0"
      class="text-center text-brand-muted py-4"
    >
      No expenses added yet
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="expense in payPeriod.expenses"
        :key="expense.id"
        class="flex items-center justify-between p-4 bg-white rounded-lg border"
      >
        <div class="flex-1">
          <h4 class="font-medium text-brand-text">{{ expense.name }}</h4>
          <p class="text-sm text-brand-muted">Added {{ expense.dateAdded }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <BaseInput
            v-model="expense.amount"
            type="number"
            name="expense-amount"
            prefix="$"
            class="w-32"
            @blur="handleAmountChange(expense.id, expense.amount)"
          />
          <BaseButton
            :variant="expense.paid ? 'primary' : 'outline'"
            @click="emit('togglePaid', expense.id)"
          >
            {{ expense.paid ? "Paid" : "Unpaid" }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
