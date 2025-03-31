<!-- Budget.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { budgetService } from "../services/budgetService";
import type { PayPeriod, Income } from "../services/budgetService";
import { useRouter } from "vue-router";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BaseSection from "../components/atoms/BaseSection.vue";
import BaseTable from "../components/atoms/BaseTable.vue";
import BasePage from "../components/atoms/BasePage.vue";

const currentBudget = computed(() => budgetService.getCurrentBudget());
const loading = ref(false);
const error = ref<string | null>(null);

const currentPayPeriodIndex = computed(() =>
  budgetService.getCurrentPayPeriodIndex()
);

const router = useRouter();

const calculateDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatCurrencyInput = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const parseCurrencyInput = (value: string): number => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(numericValue);
  return isNaN(parsed) ? 0 : parsed;
};

const handleCreatePayPeriod = async () => {
  loading.value = true;
  error.value = null;
  try {
    await budgetService.createPayPeriod();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const handleTogglePaid = async (payPeriodIndex: number, billName: string) => {
  try {
    await budgetService.toggleBillPaid(payPeriodIndex, billName);
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleToggleExpensePaid = async (
  payPeriodIndex: number,
  expenseId: string
) => {
  try {
    await budgetService.toggleExpensePaid(payPeriodIndex, expenseId);
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleUpdateBillAmount = async (
  payPeriodIndex: number,
  billName: string,
  newAmount: number
) => {
  try {
    await budgetService.updatePayPeriodBillAmount(
      payPeriodIndex,
      billName,
      newAmount
    );
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleUpdateExpenseAmount = async (
  payPeriodIndex: number,
  expenseId: string,
  newAmount: number
) => {
  try {
    await budgetService.updatePayPeriodExpenseAmount(
      payPeriodIndex,
      expenseId,
      newAmount
    );
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleBillAmountChange = (
  payPeriodIndex: number,
  billName: string,
  event: Event
) => {
  const input = event.target as HTMLInputElement;
  const newAmount = parseCurrencyInput(input.value);
  if (!isNaN(newAmount)) {
    handleUpdateBillAmount(payPeriodIndex, billName, newAmount);
    // Update the input value with proper formatting
    input.value = formatCurrencyInput(newAmount);
  }
};

const handleExpenseAmountChange = (
  payPeriodIndex: number,
  expenseId: string,
  event: Event
) => {
  const input = event.target as HTMLInputElement;
  const newAmount = parseCurrencyInput(input.value);
  if (!isNaN(newAmount)) {
    handleUpdateExpenseAmount(payPeriodIndex, expenseId, newAmount);
    // Update the input value with proper formatting
    input.value = formatCurrencyInput(newAmount);
  }
};

const handleBillAmountFocus = (event: Event) => {
  const input = event.target as HTMLInputElement;
  // Remove formatting when focused
  input.value = input.value.replace(/[^0-9.]/g, "");
};

const handleBillAmountBlur = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const amount = parseCurrencyInput(input.value);
  // Reapply formatting when blurred
  input.value = formatCurrencyInput(amount);
};

const handleUpdatePaycheckAmount = async (
  payPeriodIndex: number,
  newAmount: number
) => {
  try {
    await budgetService.updatePayPeriodPaycheckAmount(
      payPeriodIndex,
      newAmount
    );
  } catch (e: any) {
    error.value = e.message;
  }
};

const handlePaycheckAmountChange = (payPeriodIndex: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  const newAmount = parseCurrencyInput(input.value);
  if (!isNaN(newAmount)) {
    handleUpdatePaycheckAmount(payPeriodIndex, newAmount);
    // Update the input value with proper formatting
    input.value = formatCurrencyInput(newAmount);
  }
};

const handleAddExpense = (index: number) => {
  router.push(`/add-expense?payPeriodIndex=${index}`);
};

const handleDeleteLastPayPeriod = async () => {
  try {
    await budgetService.deleteLastPayPeriod();
  } catch (e: any) {
    error.value = e.message;
  }
};

const getPayPeriodStatus = (index: number) => {
  if (index === currentPayPeriodIndex.value) {
    return {
      label: "Current Period",
      class: "bg-brand-success/10 border-brand-success/20",
      badge: "bg-brand-success/20 text-brand-success",
    };
  } else if (index < currentPayPeriodIndex.value) {
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
};

const tableHeaders = [
  { label: "Bill Name", key: "name" },
  { label: "Amount", key: "amount" },
  { label: "Due Date", key: "dueDate" },
  { label: "Days Until Due", key: "daysUntilDue" },
  { label: "Status", key: "status" },
];

const handleAddBill = (index: number) => {
  router.push(`/add-bill?payPeriodIndex=${index}`);
};
</script>

<template>
  <BasePage title="Budget Overview">
    <template #actions>
      <BaseButton
        variant="outline"
        v-if="
          currentBudget &&
          currentBudget.payPeriods.length > 0 &&
          currentPayPeriodIndex !== currentBudget.payPeriods.length - 1
        "
        @click="handleDeleteLastPayPeriod"
      >
        Delete Last Period
      </BaseButton>
      <BaseButton
        variant="primary"
        :disabled="loading"
        @click="handleCreatePayPeriod"
      >
        {{ loading ? "Creating..." : "Create Next Pay Period" }}
      </BaseButton>
    </template>

    <div v-if="error" class="rounded-md bg-brand-danger/10 p-4">
      <div class="text-sm text-brand-danger">{{ error }}</div>
    </div>

    <div v-if="!currentBudget" class="text-center py-12">
      <h3 class="text-lg font-medium text-brand-text">No Budget Open</h3>
      <p class="mt-2 text-sm text-brand-muted">
        Please open or create a budget to get started.
      </p>
    </div>

    <div
      v-else-if="currentBudget.payPeriods.length === 0"
      class="text-center py-12"
    >
      <h3 class="text-lg font-medium text-brand-text">No Pay Periods Yet</h3>
      <p class="mt-2 text-sm text-brand-muted">
        Click the button above to create your first pay period.
      </p>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="(payPeriod, index) in currentBudget.payPeriods"
        :key="payPeriod.startDate"
        class="overflow-hidden rounded-lg border"
        :class="getPayPeriodStatus(index).class"
      >
        <div class="px-4 py-5 sm:px-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-brand-text">
                Pay Period: {{ formatDate(payPeriod.startDate) }} -
                {{ formatDate(payPeriod.endDate) }}
              </h3>
              <span
                class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getPayPeriodStatus(index).badge"
              >
                {{ getPayPeriodStatus(index).label }}
              </span>
            </div>
            <div class="text-right">
              <div class="text-sm text-brand-muted">Progress</div>
              <div class="mt-1 text-lg font-semibold text-brand-text">
                {{ formatCurrency(payPeriod.paidAmount) }} /
                {{ formatCurrency(payPeriod.totalAmount) }}
              </div>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-4 gap-4 text-sm">
            <div class="col-span-4 bg-brand-primary/10 p-3 rounded-lg">
              <div class="font-medium text-brand-primary">Expected Income</div>
              <div class="mt-1 grid grid-cols-3 gap-4">
                <div>
                  <span class="text-brand-primary">Paycheck:</span>
                  <div class="relative inline-block ml-2">
                    <span
                      class="absolute left-2 top-1/2 -translate-y-1/2 text-brand-primary"
                      >$</span
                    >
                    <input
                      type="text"
                      :value="formatCurrencyInput(payPeriod.paycheckAmount)"
                      @change="(e) => handlePaycheckAmountChange(index, e)"
                      @focus="handleBillAmountFocus"
                      @blur="handleBillAmountBlur"
                      class="w-32 pl-6 pr-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-brand-primary text-right bg-brand-primary/10 border-brand-primary/20 font-medium text-brand-primary"
                    />
                  </div>
                </div>
                <div>
                  <span class="text-brand-primary">Total Outgoing:</span>
                  <span class="ml-2 font-medium text-brand-primary">{{
                    formatCurrency(
                      payPeriod.totalAmount + (payPeriod.totalExpenses || 0)
                    )
                  }}</span>
                </div>
                <div>
                  <span class="text-brand-primary">Remaining:</span>
                  <span
                    class="ml-2 font-medium"
                    :class="
                      payPeriod.paycheckAmount -
                        (payPeriod.totalAmount +
                          (payPeriod.totalExpenses || 0)) >=
                      0
                        ? 'text-brand-success'
                        : 'text-brand-danger'
                    "
                  >
                    {{
                      formatCurrency(
                        payPeriod.paycheckAmount -
                          (payPeriod.totalAmount +
                            (payPeriod.totalExpenses || 0))
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span class="text-brand-muted">Total Bills:</span>
              <span class="ml-2 font-medium text-brand-text">{{
                formatCurrency(payPeriod.totalAmount)
              }}</span>
            </div>
            <div>
              <span class="text-brand-muted">Paid Bills:</span>
              <span class="ml-2 font-medium text-brand-success">{{
                formatCurrency(payPeriod.paidAmount)
              }}</span>
            </div>
            <div>
              <span class="text-brand-muted">Unpaid Bills:</span>
              <span class="ml-2 font-medium text-brand-danger">{{
                formatCurrency(payPeriod.unpaidAmount)
              }}</span>
            </div>
            <div>
              <span class="text-brand-muted">Total Expenses:</span>
              <span class="ml-2 font-medium text-brand-primary">{{
                formatCurrency(payPeriod.totalExpenses || 0)
              }}</span>
            </div>
          </div>
        </div>

        <div class="border-t" :class="getPayPeriodStatus(index).class">
          <BaseSection
            title="Bills"
            :action="{
              label: 'Add Bill',
              variant: 'secondary',
              onClick: () => handleAddBill(index),
            }"
          />
          <BaseTable
            :headers="tableHeaders"
            :rows="payPeriod.bills"
            :status="getPayPeriodStatus(index)"
          >
            <tr v-for="bill in payPeriod.bills" :key="bill.name">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-text"
              >
                {{ bill.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-brand-muted">
                <div class="flex items-center space-x-2">
                  <div class="relative">
                    <span
                      class="absolute left-2 top-1/2 -translate-y-1/2 text-brand-muted"
                      >$</span
                    >
                    <input
                      type="text"
                      :value="formatCurrencyInput(bill.amount)"
                      @change="
                        (e) => handleBillAmountChange(index, bill.name, e)
                      "
                      @focus="handleBillAmountFocus"
                      @blur="handleBillAmountBlur"
                      class="w-32 pl-6 pr-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-brand-primary text-right"
                    />
                  </div>
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
                  :variant="bill.isPaid ? 'popular' : 'ghost'"
                  size="sm"
                  @click="handleTogglePaid(index, bill.name)"
                >
                  {{ bill.isPaid ? "Paid" : "Unpaid" }}
                </BaseButton>
              </td>
            </tr>
          </BaseTable>
        </div>

        <div class="border-t" :class="getPayPeriodStatus(index).class">
          <div
            class="px-4 py-3 bg-brand-surface border-b flex justify-between items-center"
          >
            <h4 class="text-lg font-medium text-brand-text">Expenses</h4>
            <BaseButton
              variant="ghost"
              size="sm"
              @click="handleAddExpense(index)"
            >
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
                  <div class="relative">
                    <span
                      class="absolute left-2 top-1/2 -translate-y-1/2 text-brand-muted"
                      >$</span
                    >
                    <input
                      type="text"
                      :value="formatCurrencyInput(expense.amount)"
                      @change="
                        (e) => handleExpenseAmountChange(index, expense.id, e)
                      "
                      @focus="handleBillAmountFocus"
                      @blur="handleBillAmountBlur"
                      class="w-32 pl-6 pr-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-brand-primary text-right"
                    />
                  </div>
                </div>
                <BaseButton
                  :variant="expense.isPaid ? 'popular' : 'ghost'"
                  size="sm"
                  @click="handleToggleExpensePaid(index, expense.id)"
                >
                  {{ expense.isPaid ? "Paid" : "Unpaid" }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BasePage>
</template>
