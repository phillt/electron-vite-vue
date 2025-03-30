<!-- Budget.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { budgetService } from "../services/budgetService";
import type { PayPeriod } from "../services/budgetService";

const currentBudget = computed(() => budgetService.getCurrentBudget());
const loading = ref(false);
const error = ref<string | null>(null);

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
</script>

<template>
  <div v-if="currentBudget" class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Budget Overview</h1>
      <button
        @click="handleCreatePayPeriod"
        :disabled="loading"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {{ loading ? "Creating..." : "Create Next Pay Period" }}
      </button>
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
      class="bg-white shadow rounded-lg overflow-hidden"
    >
      <div class="px-4 py-5 sm:px-6 bg-gray-50">
        <h3 class="text-lg font-medium text-gray-900">
          Pay Period: {{ formatDate(payPeriod.startDate) }} -
          {{ formatDate(payPeriod.endDate) }}
        </h3>
        <div class="mt-2 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Total:</span>
            <span class="ml-2 font-medium">{{
              formatCurrency(payPeriod.totalAmount)
            }}</span>
          </div>
          <div>
            <span class="text-gray-500">Paid:</span>
            <span class="ml-2 font-medium text-green-600">{{
              formatCurrency(payPeriod.paidAmount)
            }}</span>
          </div>
          <div>
            <span class="text-gray-500">Remaining:</span>
            <span class="ml-2 font-medium text-red-600">{{
              formatCurrency(payPeriod.unpaidAmount)
            }}</span>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
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
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="bill in payPeriod.bills" :key="bill.name">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ bill.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(bill.amount) }}
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
    </div>
  </div>

  <div v-else class="text-center py-12">
    <h3 class="text-lg font-medium text-gray-900">No Budget Open</h3>
    <p class="mt-2 text-sm text-gray-500">
      Please open or create a budget to get started.
    </p>
  </div>
</template>
