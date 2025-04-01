<!-- PayPeriodCard.vue -->
<script setup lang="ts">
import { computed, ref } from "vue";
import type { PayPeriod } from "../../services/budgetService";
import PayPeriodHeader from "./PayPeriodHeader.vue";
import PayPeriodBills from "./PayPeriodBills.vue";
import PayPeriodExpenses from "./PayPeriodExpenses.vue";
import CollapsibleSection from "./CollapsibleSection.vue";
import BaseButton from "../atoms/BaseButton.vue";

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
  (e: "deleteExpense", expenseId: string): void;
}>();

const showBills = ref(props.isCurrentPeriod);
const showExpenses = ref(props.isCurrentPeriod);

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

const billsStats = computed(() => ({
  paid: props.payPeriod.bills.filter((bill) => bill.isPaid).length,
  total: props.payPeriod.bills.length,
  pastDue: props.payPeriod.bills.filter(
    (bill) => !bill.isPaid && new Date(bill.dueDate) < new Date()
  ).length,
}));

const expensesStats = computed(() => ({
  paid: props.payPeriod.expenses.filter((expense) => expense.isPaid).length,
  total: props.payPeriod.expenses.length,
}));
</script>

<template>
  <div class="overflow-hidden rounded-lg border" :class="status.class">
    <PayPeriodHeader
      :pay-period="payPeriod"
      :status="status"
      @update:paycheck-amount="(amount: number) => emit('updatePaycheckAmount', amount)"
    />

    <div class="border-t" :class="status.class">
      <CollapsibleSection
        title="Bills"
        :is-expanded="showBills"
        :stats="billsStats"
        @toggle="showBills = !showBills"
      />
      <div v-show="showBills">
        <PayPeriodBills
          :pay-period="payPeriod"
          :status="status"
          @toggle-paid="(billName: string) => emit('toggleBillPaid', billName)"
          @update-amount="
            (billName: string, amount: number) => emit('updateBillAmount', billName, amount)
          "
        />
        <div class="p-4 pt-0 flex justify-end">
          <BaseButton variant="outline" @click="emit('addBill')"
            >Add Bill</BaseButton
          >
        </div>
      </div>
    </div>

    <div class="border-t" :class="status.class">
      <CollapsibleSection
        title="Expenses"
        :is-expanded="showExpenses"
        :stats="expensesStats"
        @toggle="showExpenses = !showExpenses"
      />
      <div v-show="showExpenses">
        <PayPeriodExpenses
          :pay-period="payPeriod"
          :status="status"
          @toggle-paid="(expenseId: string) => emit('toggleExpensePaid', expenseId)"
          @update-amount="
            (expenseId: string, amount: number) => emit('updateExpenseAmount', expenseId, amount)
          "
          @delete-expense="(expenseId: string) => emit('deleteExpense', expenseId)"
        />
        <div class="p-4 pt-0 flex justify-end">
          <BaseButton variant="outline" @click="emit('addExpense')"
            >Add Expense</BaseButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
