<!-- PayPeriodCard.vue -->
<script setup lang="ts">
import { computed } from "vue";
import type { PayPeriod } from "../../services/budgetService";
import BaseButton from "../atoms/BaseButton.vue";
import BaseSection from "../atoms/BaseSection.vue";
import BaseTable from "../atoms/BaseTable.vue";
import BaseInput from "../atoms/BaseInput.vue";
import PayPeriodHeader from "./PayPeriodHeader.vue";
import PayPeriodSummary from "./PayPeriodSummary.vue";
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
      class: "bg-brand-success/10 border-brand-success/20",
      badge: "bg-brand-success/20 text-brand-success",
    };
  } else if (props.isPastPeriod) {
    return {
      label: "Past Period",
      class: "bg-brand-surface border-brand-surface/20",
      badge: "bg-brand-surface/20 text-brand-muted",
    };
  } else {
    return {
      label: "Future Period",
      class: "bg-brand-primary/10 border-brand-primary/20",
      badge: "bg-brand-primary/20 text-brand-primary",
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
