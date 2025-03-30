<!-- Budget.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { budgetService } from "../services/budgetService";
import type { PayPeriod, Income } from "../services/budgetService";
import { useRouter } from "vue-router";

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
      class: "bg-green-50 border-green-200",
      badge: "bg-green-100 text-green-800",
    };
  } else if (index < currentPayPeriodIndex.value) {
    return {
      label: "Past Period",
      class: "bg-gray-50 border-gray-200",
      badge: "bg-gray-100 text-gray-600",
    };
  } else {
    return {
      label: "Future Period",
      class: "bg-blue-50 border-blue-200",
      badge: "bg-blue-100 text-blue-800",
    };
  }
};
</script>

<template>
  <div v-if="currentBudget" class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Budget Overview</h1>
      <div class="flex space-x-4">
        <button
          v-if="
            currentBudget.payPeriods.length > 0 &&
            currentPayPeriodIndex !== currentBudget.payPeriods.length - 1
          "
          @click="handleDeleteLastPayPeriod"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Last Period
        </button>
        <button
          @click="handleCreatePayPeriod"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {{ loading ? "Creating..." : "Create Next Pay Period" }}
        </button>
      </div>
    </div>

    <div v-if="error" class="rounded-md bg-red-50 p-4">
      <div class="text-sm text-red-700">{{ error }}</div>
    </div>

    <div v-if="currentBudget.payPeriods.length === 0" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900">No Pay Periods Yet</h3>
      <p class="mt-2 text-sm text-gray-500">
        Click the button above to create your first pay period.
      </p>
    </div>

    <div
      v-else
      v-for="(payPeriod, index) in currentBudget.payPeriods"
      :key="payPeriod.startDate"
      class="overflow-hidden rounded-lg border"
      :class="getPayPeriodStatus(index).class"
    >
      <div class="px-4 py-5 sm:px-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
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
            <div class="text-sm text-gray-500">Progress</div>
            <div class="mt-1 text-lg font-semibold">
              {{ formatCurrency(payPeriod.paidAmount) }} /
              {{ formatCurrency(payPeriod.totalAmount) }}
            </div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div class="col-span-4 bg-blue-50 p-3 rounded-lg">
            <div class="font-medium text-blue-900">Expected Income</div>
            <div class="mt-1 grid grid-cols-3 gap-4">
              <div>
                <span class="text-blue-700">Paycheck:</span>
                <div class="relative inline-block ml-2">
                  <span
                    class="absolute left-2 top-1/2 -translate-y-1/2 text-blue-700"
                    >$</span
                  >
                  <input
                    type="text"
                    :value="formatCurrencyInput(payPeriod.paycheckAmount)"
                    @change="(e) => handlePaycheckAmountChange(index, e)"
                    @focus="handleBillAmountFocus"
                    @blur="handleBillAmountBlur"
                    class="w-32 pl-6 pr-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right bg-blue-50 border-blue-200 font-medium text-blue-900"
                  />
                </div>
              </div>
              <div>
                <span class="text-blue-700">Total Outgoing:</span>
                <span class="ml-2 font-medium text-blue-900">{{
                  formatCurrency(
                    payPeriod.totalAmount + (payPeriod.totalExpenses || 0)
                  )
                }}</span>
              </div>
              <div>
                <span class="text-blue-700">Remaining:</span>
                <span
                  class="ml-2 font-medium"
                  :class="
                    payPeriod.paycheckAmount -
                      (payPeriod.totalAmount +
                        (payPeriod.totalExpenses || 0)) >=
                    0
                      ? 'text-green-600'
                      : 'text-red-600'
                  "
                >
                  {{
                    formatCurrency(
                      payPeriod.paycheckAmount -
                        (payPeriod.totalAmount + (payPeriod.totalExpenses || 0))
                    )
                  }}
                </span>
              </div>
            </div>
          </div>
          <div>
            <span class="text-gray-500">Total Bills:</span>
            <span class="ml-2 font-medium">{{
              formatCurrency(payPeriod.totalAmount)
            }}</span>
          </div>
          <div>
            <span class="text-gray-500">Paid Bills:</span>
            <span class="ml-2 font-medium text-green-600">{{
              formatCurrency(payPeriod.paidAmount)
            }}</span>
          </div>
          <div>
            <span class="text-gray-500">Unpaid Bills:</span>
            <span class="ml-2 font-medium text-red-600">{{
              formatCurrency(payPeriod.unpaidAmount)
            }}</span>
          </div>
          <div>
            <span class="text-gray-500">Total Expenses:</span>
            <span class="ml-2 font-medium text-purple-600">{{
              formatCurrency(payPeriod.totalExpenses || 0)
            }}</span>
          </div>
        </div>
      </div>

      <div class="border-t" :class="getPayPeriodStatus(index).class">
        <div class="px-4 py-3 bg-gray-50 border-b">
          <h4 class="text-lg font-medium text-gray-900">Bills</h4>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-opacity-50" :class="getPayPeriodStatus(index).class">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bill Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Due Date
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Days Until Due
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="bill in payPeriod.bills" :key="bill.name">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ bill.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex items-center space-x-2">
                  <div class="relative">
                    <span
                      class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
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
                      class="w-32 pl-6 pr-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
                    />
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(bill.dueDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ calculateDaysUntilDue(bill.dueDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  @click="handleTogglePaid(index, bill.name)"
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    bill.isPaid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800',
                  ]"
                >
                  {{ bill.isPaid ? "Paid" : "Unpaid" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="border-t" :class="getPayPeriodStatus(index).class">
        <div
          class="px-4 py-3 bg-gray-50 border-b flex justify-between items-center"
        >
          <h4 class="text-lg font-medium text-gray-900">Expenses</h4>
          <button
            @click="handleAddExpense(index)"
            class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Add Expense
          </button>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-if="!payPeriod.expenses || payPeriod.expenses.length === 0"
            class="p-4 text-center text-gray-500"
          >
            No expenses added yet
          </div>
          <div
            v-for="expense in payPeriod.expenses"
            :key="expense.id"
            class="px-4 py-3 flex justify-between items-center"
          >
            <div>
              <div class="font-medium text-gray-900">{{ expense.name }}</div>
              <div class="text-sm text-gray-500">
                Added on {{ formatDate(expense.date) }}
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="relative">
                  <span
                    class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
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
                    class="w-32 pl-6 pr-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 text-right"
                  />
                </div>
              </div>
              <button
                @click="handleToggleExpensePaid(index, expense.id)"
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  expense.isPaid
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800',
                ]"
              >
                {{ expense.isPaid ? "Paid" : "Unpaid" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <h3 class="text-lg font-medium text-gray-900">No Budget Open</h3>
    <p class="mt-2 text-sm text-gray-500">
      Please open or create a budget to get started.
    </p>
  </div>
</template>
