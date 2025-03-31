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
  (e: "addExpense"): void;
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const handleExpenseAmountChange = (
  expenseId: string,
  value: string | number
) => {
  const newAmount = parseFloat(value.toString());
  if (!isNaN(newAmount)) {
    emit("updateAmount", expenseId, newAmount);
  }
};
</script>

<template>
  <div
    class="px-4 py-3 bg-brand-surface border-b flex justify-between items-center"
  >
    <h4 class="text-lg font-medium text-brand-text">Expenses</h4>
    <BaseButton variant="outline" size="sm" @click="emit('addExpense')">
      Add Expense
    </BaseButton>
  </div>
  <div class="divide-y divide-brand-surface">
    <div
      v-if="!payPeriod.expenses || payPeriod.expenses.length === 0"
      class="p-4 text-center text-brand-muted"
    >
      No expenses added yet
    </div>
    <div
      v-for="expense in payPeriod.expenses"
      :key="expense.id"
      class="px-4 py-3 flex justify-between items-center"
    >
      <div>
        <div class="font-medium text-brand-text">
          {{ expense.name }}
        </div>
        <div class="text-sm text-brand-muted">
          Added on {{ formatDate(expense.date) }}
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <BaseInput
            v-model="expense.amount"
            :name="`expense-amount-${expense.id}`"
            type="number"
            class="w-32"
            prefix="$"
            @update:modelValue="
              (value) => handleExpenseAmountChange(expense.id, value)
            "
          />
        </div>
        <BaseButton
          :variant="expense.isPaid ? 'primary' : 'outline'"
          size="sm"
          @click="emit('togglePaid', expense.id)"
        >
          {{ expense.isPaid ? "Paid" : "Unpaid" }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
