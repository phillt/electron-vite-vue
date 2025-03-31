<!-- PayPeriodBills.vue -->
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
  (e: "togglePaid", billName: string): void;
  (e: "updateAmount", billName: string, amount: number): void;
}>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const calculateDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const isPastDue = (dueDate: string) => {
  return new Date(dueDate) < new Date();
};

const sortedBills = computed(() => {
  return [...props.payPeriod.bills].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
});

const headers = [
  { label: "Name", key: "name", class: "w-2/5 text-left" },
  { label: "Amount", key: "amount", class: "w-1/5 text-center" },
  { label: "Due Date", key: "dueDate", class: "w-1/5 text-center" },
  { label: "Days Until Due", key: "daysUntilDue", class: "w-1/5 text-center" },
  { label: "Paid", key: "paid", class: "w-1/5 text-right" },
];

const handleAmountChange = (billName: string, amount: string) => {
  emit("updateAmount", billName, Number(amount));
};
</script>

<template>
  <div class="p-4">
    <BaseTable :headers="headers" :rows="sortedBills">
      <template #default="{ row: bill, class: rowClass }">
        <tr :class="[rowClass, { 'opacity-50': bill.isPaid }]">
          <td
            class="px-4 py-2 whitespace-nowrap w-2/5"
            :class="{
              'text-red-700 font-bold': !bill.isPaid && isPastDue(bill.dueDate),
            }"
          >
            {{ bill.name }}
          </td>
          <td class="px-4 py-2 whitespace-nowrap w-1/5 text-center">
            <BaseInput
              v-model="bill.amount"
              type="number"
              name="bill-amount"
              prefix="$"
              size="sm"
              class="w-32"
              @blur="handleAmountChange(bill.name, bill.amount.toString())"
            />
          </td>
          <td class="px-4 py-2 whitespace-nowrap w-1/5 text-center">
            {{ formatDate(bill.dueDate) }}
          </td>
          <td
            class="px-4 py-2 whitespace-nowrap w-1/5 text-center"
            :class="{
              'text-red-700 font-bold': !bill.isPaid && isPastDue(bill.dueDate),
            }"
          >
            {{ calculateDaysUntilDue(bill.dueDate) }}
          </td>
          <td class="px-4 py-2 whitespace-nowrap w-1/5 text-right">
            <BaseButton
              :variant="bill.isPaid ? 'primary' : 'outline'"
              size="sm"
              @click="emit('togglePaid', bill.name)"
            >
              {{ bill.isPaid ? "Paid" : "Unpaid" }}
            </BaseButton>
          </td>
        </tr>
      </template>
    </BaseTable>
  </div>
</template>
