<!-- PayPeriodBills.vue -->
<script setup lang="ts">
import type { PayPeriod } from "../../services/budgetService";
import BaseButton from "../atoms/BaseButton.vue";
import BaseSection from "../atoms/BaseSection.vue";
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
  (e: "addBill"): void;
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

const handleBillAmountChange = (billName: string, value: string | number) => {
  const newAmount = parseFloat(value.toString());
  if (!isNaN(newAmount)) {
    emit("updateAmount", billName, newAmount);
  }
};

const tableHeaders = [
  { label: "Bill Name", key: "name" },
  { label: "Amount", key: "amount" },
  { label: "Due Date", key: "dueDate" },
  { label: "Days Until Due", key: "daysUntilDue" },
  { label: "Status", key: "status" },
];
</script>

<template>
  <BaseSection
    title="Bills"
    :action="{
      label: 'Add Bill',
      variant: 'outline',
      onClick: () => emit('addBill'),
    }"
  />
  <BaseTable :headers="tableHeaders" :rows="payPeriod.bills" :status="status">
    <tr v-for="bill in payPeriod.bills" :key="bill.name">
      <td
        class="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text"
      >
        {{ bill.name }}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-brand-muted">
        <div class="flex items-center space-x-2">
          <BaseInput
            v-model="bill.amount"
            :name="`bill-amount-${bill.name}`"
            type="number"
            class="w-32"
            prefix="$"
            @update:modelValue="
              (value) => handleBillAmountChange(bill.name, value)
            "
          />
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-brand-muted">
        {{ formatDate(bill.dueDate) }}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-brand-muted">
        {{ calculateDaysUntilDue(bill.dueDate) }}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-brand-muted">
        <BaseButton
          :variant="bill.isPaid ? 'primary' : 'outline'"
          size="sm"
          @click="emit('togglePaid', bill.name)"
        >
          {{ bill.isPaid ? "Paid" : "Unpaid" }}
        </BaseButton>
      </td>
    </tr>
  </BaseTable>
</template>
