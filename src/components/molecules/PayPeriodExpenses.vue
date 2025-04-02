<!-- PayPeriodExpenses.vue -->
<script setup lang="ts">
import type { PayPeriod } from "../../services/budgetService";
import BaseTable from "../atoms/BaseTable.vue";
import BaseInput from "../atoms/BaseInput.vue";
import BaseButton from "../atoms/BaseButton.vue";
import { computed } from "vue";

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
  (e: "deleteExpense", expenseId: string): void;
}>();

const sortedExpenses = computed(() => {
  return [...props.payPeriod.expenses].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
});

const headers = [
  { label: "Name", key: "name", class: "w-1/2 text-left" },
  { label: "Amount", key: "amount", class: "w-1/4 text-center" },
  { label: "Actions", key: "actions", class: "w-1/4 text-right" },
];

const handleAmountChange = (expenseId: string, amount: string) => {
  emit("updateAmount", expenseId, Number(amount));
};
</script>

<template>
  <div class="p-4">
    <BaseTable :headers="headers" :rows="sortedExpenses">
      <template #default="{ row: expense, class: rowClass }">
        <tr :class="[rowClass, { 'opacity-50': expense.isPaid }]">
          <td class="px-4 py-2 whitespace-nowrap w-1/2">
            {{ expense.name }}
          </td>
          <td class="px-4 py-2 whitespace-nowrap w-1/4 text-center">
            <BaseInput
              v-model="expense.amount"
              type="number"
              name="expense-amount"
              prefix="$"
              size="sm"
              class="w-32"
              @blur="handleAmountChange(expense.id, expense.amount.toString())"
            />
          </td>
          <td class="px-4 py-2 whitespace-nowrap w-1/4 text-right">
            <div class="flex items-center justify-end gap-2">
              <BaseButton
                variant="ghost"
                size="sm"
                class="text-red-700 hover:bg-red-50"
                @click="emit('deleteExpense', expense.id)"
              >
                Delete
              </BaseButton>
              <BaseButton
                :variant="expense.isPaid ? 'primary' : 'outline'"
                size="sm"
                @click="emit('togglePaid', expense.id)"
              >
                {{ expense.isPaid ? "Paid" : "Unpaid" }}
              </BaseButton>
            </div>
          </td>
        </tr>
      </template>
    </BaseTable>
  </div>
</template>
