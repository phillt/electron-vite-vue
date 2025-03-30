<!-- Budget.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { budgetService } from "../services/budgetService";

const currentBudget = computed(() => budgetService.getCurrentBudget());
const totalIncome = computed(() => {
  if (!currentBudget.value) return 0;
  return currentBudget.value.incomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );
});

const totalBills = computed(() => {
  if (!currentBudget.value) return 0;
  return currentBudget.value.bills.reduce((sum, bill) => sum + bill.amount, 0);
});

const monthlyBalance = computed(() => totalIncome.value - totalBills.value);
</script>

<template>
  <div class="p-6">
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Budget Overview</h1>
      <p class="mt-2 text-sm text-gray-600">
        View your monthly income, expenses, and balance
      </p>
    </header>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <!-- Monthly Income Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Monthly Income
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ${{ totalIncome.toFixed(2) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Bills Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Monthly Bills
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ${{ totalBills.toFixed(2) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Balance Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-6 w-6"
                :class="monthlyBalance >= 0 ? 'text-green-400' : 'text-red-400'"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Monthly Balance
                </dt>
                <dd class="flex items-baseline">
                  <div
                    class="text-2xl font-semibold"
                    :class="
                      monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    "
                  >
                    ${{ monthlyBalance.toFixed(2) }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
