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
          <!-- Tabs for Income and Expenses -->
          <div class="border-b border-gray-200 mb-6">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="tab in tabs"
                :key="tab.name"
                @click="activeTab = tab.name"
                :class="[
                  activeTab === tab.name
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                ]"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <!-- Add New Item Button -->
          <div class="mb-8">
            <div class="flex justify-end">
              <button
                v-if="activeTab === 'income'"
                @click="$router.push('/add-income')"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add New Income
              </button>
              <button
                v-else
                @click="$router.push('/add-bill')"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Add New Bill
              </button>
            </div>
          </div>

          <!-- List of Items -->
          <div>
            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <ul class="divide-y divide-gray-200">
                <template v-if="activeTab === 'income'">
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
                      <div
                        class="ml-4 flex-shrink-0 flex items-center space-x-4"
                      >
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
                </template>
                <template v-else>
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
                      <div
                        class="ml-4 flex-shrink-0 flex items-center space-x-4"
                      >
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
                </template>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { budgetService } from "../services/budgetService";
import { useRouter } from "vue-router";
import type { Income, Bill } from "../services/budgetService";

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());
const activeTab = ref("income");

const tabs = [
  { name: "income", label: "Income Sources" },
  { name: "bills", label: "Bills" },
];

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
