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
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            <div class="bg-green-50 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                      <dt class="text-sm font-medium text-green-500 truncate">
                        Total Income
                      </dt>
                      <dd class="text-lg font-semibold text-green-900">
                        ${{ totalIncome.toFixed(2) }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-red-50 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                      <dt class="text-sm font-medium text-red-500 truncate">
                        Total Expenses
                      </dt>
                      <dd class="text-lg font-semibold text-red-900">
                        ${{ totalExpenses.toFixed(2) }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-blue-500 truncate">
                        Balance
                      </dt>
                      <dd class="text-lg font-semibold text-blue-900">
                        ${{ balance.toFixed(2) }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

          <!-- Add New Item Form -->
          <div class="mb-8">
            <div class="flex justify-end">
              <button
                v-if="activeTab === 'income'"
                @click="$router.push('/add-income')"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add New Income
              </button>
            </div>
          </div>

          <!-- List of Items -->
          <div class="mt-8">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ activeTab === "income" ? "Income" : "Expenses" }} List
            </h3>
            <div class="bg-white shadow overflow-hidden sm:rounded-md">
              <ul class="divide-y divide-gray-200">
                <li
                  v-for="item in items"
                  :key="item.id"
                  class="px-4 py-4 sm:px-6"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-indigo-600 truncate">
                        {{ item.description }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ new Date(item.date).toLocaleDateString() }}
                      </p>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <span
                        :class="[
                          activeTab === 'income'
                            ? 'text-green-600'
                            : 'text-red-600',
                          'text-sm font-medium',
                        ]"
                      >
                        {{ activeTab === "income" ? "+" : "-" }}${{
                          item.amount.toFixed(2)
                        }}
                      </span>
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
import { ref, computed } from "vue";
import { budgetService, type Item } from "../services/budgetService";

const tabs = [
  { name: "income", label: "Income" },
  { name: "expense", label: "Expenses" },
];

const activeTab = ref("income");
const isSubmitting = ref(false);

const newItem = ref({
  description: "",
  amount: 0,
});

const currentBudget = computed(() => budgetService.getCurrentBudget());

const items = computed(() => {
  const budget = currentBudget.value;
  if (!budget || !budget.items) return [];
  return budgetService.getItems(activeTab.value as "income" | "expense");
});

const totalIncome = computed(() => {
  const budget = currentBudget.value;
  if (!budget || !budget.items) return 0;
  return budgetService.getTotalIncome();
});

const totalExpenses = computed(() => {
  const budget = currentBudget.value;
  if (!budget || !budget.items) return 0;
  return budgetService.getTotalExpenses();
});

const balance = computed(() => {
  const budget = currentBudget.value;
  if (!budget || !budget.items) return 0;
  return budgetService.getBalance();
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await budgetService.addItem({
      description: newItem.value.description,
      amount: Number(newItem.value.amount),
      type: activeTab.value as "income" | "expense",
    });

    // Reset form
    newItem.value.description = "";
    newItem.value.amount = 0;
  } catch (error) {
    console.error("Error adding item:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
