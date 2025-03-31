<!-- PayPeriodBills.vue -->
<script setup lang="ts">
import type { PayPeriod } from "../../services/budgetService";
import BaseTable from "../atoms/BaseTable.vue";
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

const handleAmountChange = (billName: string, amount: string) => {
  emit("updateAmount", billName, Number(amount));
};
</script>

<template>
  <div class="p-4">
    <BaseTable>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-right">Amount</th>
          <th class="text-right">Due Date</th>
          <th class="text-right">Days Until Due</th>
          <th class="text-center">Paid</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="bill in payPeriod.bills" :key="bill.name">
          <td>{{ bill.name }}</td>
          <td class="text-right">
            <BaseInput
              v-model="bill.amount"
              type="number"
              name="bill-amount"
              prefix="$"
              class="w-32"
              @blur="handleAmountChange(bill.name, bill.amount)"
            />
          </td>
          <td class="text-right">{{ bill.dueDate }}</td>
          <td class="text-right">{{ bill.daysUntilDue }}</td>
          <td class="text-center">
            <BaseButton
              :variant="bill.paid ? 'primary' : 'outline'"
              @click="emit('togglePaid', bill.name)"
            >
              {{ bill.paid ? "Paid" : "Unpaid" }}
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </BaseTable>
  </div>
</template>
