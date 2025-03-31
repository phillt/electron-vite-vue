<!-- PayPeriodBills.vue -->
<script setup lang="ts">
import type { PayPeriod } from "../../services/budgetService";
import BaseTable from "../atoms/BaseTable.vue";
import BaseInput from "../atoms/BaseInput.vue";
import BaseButton from "../atoms/BaseButton.vue";

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

const headers = [
  { label: "Name", key: "name", class: "w-2/5" },
  { label: "Amount", key: "amount", class: "w-1/5 text-right" },
  { label: "Due Date", key: "dueDate", class: "w-1/5 text-right" },
  { label: "Days Until Due", key: "daysUntilDue", class: "w-1/5 text-right" },
  { label: "Paid", key: "paid", class: "w-1/5 text-center" },
];

const handleAmountChange = (billName: string, amount: string) => {
  emit("updateAmount", billName, Number(amount));
};
</script>

<template>
  <div class="p-4">
    <BaseTable :headers="headers" :rows="payPeriod.bills">
      <tr
        v-for="bill in payPeriod.bills"
        :key="bill.name"
        class="divide-x divide-brand-surface"
      >
        <td class="px-6 py-4 whitespace-nowrap w-2/5">{{ bill.name }}</td>
        <td class="px-6 py-4 whitespace-nowrap w-1/5 text-right">
          <BaseInput
            v-model="bill.amount"
            type="number"
            name="bill-amount"
            prefix="$"
            class="w-32"
            @blur="handleAmountChange(bill.name, bill.amount.toString())"
          />
        </td>
        <td class="px-6 py-4 whitespace-nowrap w-1/5 text-right">
          {{ formatDate(bill.dueDate) }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap w-1/5 text-right">
          {{ calculateDaysUntilDue(bill.dueDate) }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap w-1/5 text-center">
          <BaseButton
            :variant="bill.isPaid ? 'primary' : 'outline'"
            @click="emit('togglePaid', bill.name)"
          >
            {{ bill.isPaid ? "Paid" : "Unpaid" }}
          </BaseButton>
        </td>
      </tr>
    </BaseTable>
  </div>
</template>
