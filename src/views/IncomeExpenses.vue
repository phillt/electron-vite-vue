<template>
  <div class="min-h-screen bg-gray-100 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Income & Expenses</h2>
          <button
            @click="$router.push('/')"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Budget
          </button>
        </div>

        <div v-if="!currentBudget" class="text-center py-12">
          <p class="text-gray-500">No budget is currently open.</p>
          <button
            @click="$router.push('/')"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Open or Create Budget
          </button>
        </div>

        <template v-else>
          <!-- Income Sources Section -->
          <div class="mb-12">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium text-gray-900">Income Sources</h3>
              <button
                @click="$router.push('/add-income')"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add New Income
              </button>
            </div>

            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <ul class="divide-y divide-gray-200">
                <li
                  v-for="income in currentBudget?.incomes || []"
                  :key="income.name"
                  class="px-4 py-4 sm:px-6"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-indigo-600 truncate">
                        {{ income.name }}
                      </p>
                      <p class="text-sm text-gray-500">
                        Next payday: {{ formatDate(income.nextPayday) }}
                      </p>
                    </div>
                    <div class="ml-4 flex-shrink-0 flex items-center space-x-4">
                      <span class="text-sm font-medium text-green-600">
                        ${{ income.amount.toFixed(2) }}
                      </span>
                      <div class="flex space-x-2">
                        <button
                          @click="editIncome(income)"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          @click="deleteIncome(income)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Bills Section -->
          <div>
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-medium text-gray-900">Bills</h3>
              <button
                @click="$router.push('/add-bill')"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Add New Bill
              </button>
            </div>

            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <ul class="divide-y divide-gray-200">
                <li
                  v-for="bill in currentBudget?.bills || []"
                  :key="bill.name"
                  class="px-4 py-4 sm:px-6"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-indigo-600 truncate">
                        {{ bill.name }}
                      </p>
                      <p class="text-sm text-gray-500">
                        Due on the {{ bill.dueDay }}th of each month
                      </p>
                    </div>
                    <div class="ml-4 flex-shrink-0 flex items-center space-x-4">
                      <span class="text-sm font-medium text-red-600">
                        ${{ bill.amount.toFixed(2) }}
                      </span>
                      <div class="flex space-x-2">
                        <button
                          @click="editBill(bill)"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          @click="deleteBill(bill)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { budgetService } from "../services/budgetService";
import { useRouter } from "vue-router";
import type { Income, Bill } from "../services/budgetService";

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const editIncome = (income: Income) => {
  router.push(`/add-income?edit=${income.name}`);
};

const deleteIncome = async (income: Income) => {
  if (confirm(`Are you sure you want to delete ${income.name}?`)) {
    try {
      await budgetService.deleteIncome(income.name);
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  }
};

const editBill = (bill: Bill) => {
  router.push(`/add-bill?edit=${bill.name}`);
};

const deleteBill = async (bill: Bill) => {
  if (confirm(`Are you sure you want to delete ${bill.name}?`)) {
    try {
      await budgetService.deleteBill(bill.name);
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  }
};
</script>
