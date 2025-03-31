<!-- PayPeriodCard.vue -->
<script setup lang="ts">
import { computed, ref } from "vue";
import type { PayPeriod } from "../../services/budgetService";
import PayPeriodHeader from "./PayPeriodHeader.vue";
import PayPeriodBills from "./PayPeriodBills.vue";
import PayPeriodExpenses from "./PayPeriodExpenses.vue";
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
</script>

<template>
  <div class="overflow-hidden rounded-lg border" :class="status.class">
    <PayPeriodHeader
      :pay-period="payPeriod"
      :status="status"
      @update:paycheck-amount="(amount: number) => emit('updatePaycheckAmount', amount)"
    />

    <div class="border-t" :class="status.class">
      <div class="flex items-center justify-between p-4">
        <div
          class="flex items-center cursor-pointer"
          @click="showBills = !showBills"
        >
          <span class="text-brand-muted mr-2">{{ showBills ? "▼" : "▶" }}</span>
          <h3 class="text-base font-medium text-brand-text">Bills</h3>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-brand-muted">
            {{ payPeriod.bills.filter((bill) => bill.isPaid).length }} paid /
            {{ payPeriod.bills.length }} total
          </span>
          <span
            v-if="
              payPeriod.bills.some(
                (bill) => !bill.isPaid && new Date(bill.dueDate) < new Date()
              )
            "
            class="text-sm text-red-700 font-bold"
          >
            {{
              payPeriod.bills.filter(
                (bill) => !bill.isPaid && new Date(bill.dueDate) < new Date()
              ).length
            }}
            past due
          </span>
        </div>
      </div>
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
      <div class="flex items-center justify-between p-4">
        <div
          class="flex items-center cursor-pointer"
          @click="showExpenses = !showExpenses"
        >
          <span class="text-brand-muted mr-2">{{
            showExpenses ? "▼" : "▶"
          }}</span>
          <h3 class="text-base font-medium text-brand-text">Expenses</h3>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-brand-muted">
            {{ payPeriod.expenses.filter((expense) => expense.isPaid).length }}
            paid / {{ payPeriod.expenses.length }} total
          </span>
          <span
            v-if="
              payPeriod.expenses.some(
                (expense) =>
                  !expense.isPaid && new Date(expense.date) < new Date()
              )
            "
            class="text-sm text-red-700 font-bold"
          >
            {{
              payPeriod.expenses.filter(
                (expense) =>
                  !expense.isPaid && new Date(expense.date) < new Date()
              ).length
            }}
            past due
          </span>
        </div>
      </div>
      <div v-show="showExpenses">
        <PayPeriodExpenses
          :pay-period="payPeriod"
          :status="status"
          @toggle-paid="(expenseId: string) => emit('toggleExpensePaid', expenseId)"
          @update-amount="
            (expenseId: string, amount: number) => emit('updateExpenseAmount', expenseId, amount)
          "
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
