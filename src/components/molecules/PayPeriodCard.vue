<!-- PayPeriodCard.vue -->
<script setup lang="ts">
import { computed } from "vue";
import type { PayPeriod } from "../../services/budgetService";
import PayPeriodHeader from "./PayPeriodHeader.vue";
import PayPeriodBills from "./PayPeriodBills.vue";
import PayPeriodExpenses from "./PayPeriodExpenses.vue";

const props = defineProps<{
  payPeriod: PayPeriod;
  index: number;
  isCurrentPeriod: boolean;
  isPastPeriod: boolean;
}>();

const emit = defineEmits<{
  (e: "createPayPeriod"): void;
  (e: "deleteLastPayPeriod"): void;
  (e: "toggleBillPaid", billName: string): void;
  (e: "toggleExpensePaid", expenseId: string): void;
  (e: "updateBillAmount", billName: string, amount: number): void;
  (e: "updateExpenseAmount", expenseId: string, amount: number): void;
  (e: "updatePaycheckAmount", amount: number): void;
  (e: "addBill"): void;
  (e: "addExpense"): void;
}>();

const status = computed(() => {
  if (props.isCurrentPeriod) {
    return {
      label: "Current Period",
      class: "bg-white border-brand-success30",
      badge: "bg-brand-success30 text-brand-success",
    };
  } else if (props.isPastPeriod) {
    return {
      label: "Past Period",
      class: "bg-white border-brand-muted40",
      badge: "bg-brand-muted40 text-brand-muted",
    };
  } else {
    return {
      label: "Future Period",
      class: "bg-white border-brand-accent20",
      badge: "bg-brand-accent20 text-brand-accent",
    };
  }
});
</script>

<template>
  <div class="overflow-hidden rounded-lg border" :class="status.class">
    <PayPeriodHeader
      :pay-period="payPeriod"
      :status="status"
      @update:paycheck-amount="(amount) => emit('updatePaycheckAmount', amount)"
    />

    <div class="border-t" :class="status.class">
      <PayPeriodBills
        :pay-period="payPeriod"
        :status="status"
        @toggle-paid="(billName) => emit('toggleBillPaid', billName)"
        @update-amount="
          (billName, amount) => emit('updateBillAmount', billName, amount)
        "
        @add-bill="emit('addBill')"
      />
    </div>

    <div class="border-t" :class="status.class">
      <PayPeriodExpenses
        :pay-period="payPeriod"
        :status="status"
        @toggle-paid="(expenseId) => emit('toggleExpensePaid', expenseId)"
        @update-amount="
          (expenseId, amount) => emit('updateExpenseAmount', expenseId, amount)
        "
        @add-expense="emit('addExpense')"
      />
    </div>
  </div>
</template>
