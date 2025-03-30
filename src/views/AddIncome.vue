<template>
  <div class="min-h-screen bg-gray-100 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditing ? "Edit Income" : "Add Income" }}
          </h2>
          <button
            @click="$router.push('/income-expenses')"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Income & Expenses
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
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div v-if="error" class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error</h3>
                  <div class="mt-2 text-sm text-red-700">
                    {{ error }}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Income Name
              </label>
              <input
                type="text"
                id="name"
                v-model="income.name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                placeholder="e.g., Main Job, Side Gig, etc."
                :disabled="isEditing"
              />
              <p class="mt-1 text-sm text-gray-500">
                Give this income source a unique name to help you identify it.
              </p>
            </div>

            <div>
              <label
                for="amount"
                class="block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  v-model="income.amount"
                  class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label
                for="frequency"
                class="block text-sm font-medium text-gray-700"
              >
                Pay Frequency
              </label>
              <select
                id="frequency"
                v-model="income.frequency"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="bi-weekly">Bi-weekly</option>
              </select>
              <p class="mt-1 text-sm text-gray-500">
                Select how often you receive this income.
              </p>
            </div>

            <div>
              <label
                for="lastPayday"
                class="block text-sm font-medium text-gray-700"
              >
                Last Payday
              </label>
              <input
                type="date"
                id="lastPayday"
                v-model="income.lastPayday"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                :min="lastWeekDate"
              />
              <p class="mt-1 text-sm text-gray-500">
                Select the date of your most recent payday for this income
                source.
              </p>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="$router.push('/income-expenses')"
                class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {{
                  isSubmitting
                    ? "Saving..."
                    : isEditing
                    ? "Save Changes"
                    : "Add Income"
                }}
              </button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { budgetService, type Income } from "../services/budgetService";

const router = useRouter();
const route = useRoute();
const currentBudget = computed(() => budgetService.getCurrentBudget());
const isSubmitting = ref(false);
const error = ref<string | null>(null);

// Get today's date in YYYY-MM-DD format for the date input min attribute
const today = new Date().toISOString().split("T")[0];
const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);
const lastWeekDate = lastWeek.toISOString().split("T")[0];

const isEditing = computed(() => {
  return !!route.query.edit;
});

const income = ref<Partial<Income>>({
  name: "",
  amount: 0,
  frequency: "bi-weekly" as const,
  lastPayday: today,
  payPeriods: [],
});

onMounted(() => {
  if (isEditing.value) {
    const incomeName = route.query.edit as string;
    const existingIncome = currentBudget.value?.incomes.find(
      (inc) => inc.name === incomeName
    );

    if (existingIncome) {
      income.value = { ...existingIncome };
    } else {
      error.value = "Income not found";
    }
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  error.value = null;

  try {
    // Check if name already exists (only for new incomes)
    if (!isEditing.value) {
      const existingIncomes = currentBudget.value?.incomes || [];
      if (
        existingIncomes.some((inc: Income) => inc.name === income.value.name)
      ) {
        error.value = "An income source with this name already exists.";
        return;
      }
    }

    // Generate pay periods
    const payPeriods = generatePayPeriods(income.value.lastPayday!, 5);

    if (isEditing.value) {
      // Update existing income
      await budgetService.updateIncome(
        route.query.edit as string,
        {
          ...income.value,
          payPeriods,
          frequency: "bi-weekly" as const,
        } as Income
      );
    } else {
      // Add new income
      await budgetService.addIncome({
        ...income.value,
        payPeriods,
        frequency: "bi-weekly" as const,
      } as Income);
    }

    // Reset form
    income.value.name = "";
    income.value.amount = 0;
    income.value.frequency = "bi-weekly" as const;
    income.value.lastPayday = today;
    income.value.payPeriods = [];

    // Navigate back to income-expenses
    router.push("/income-expenses");
  } catch (err) {
    console.error("Error saving income:", err);
    error.value = "Failed to save income. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

// Helper function to generate pay periods
function generatePayPeriods(lastPayday: string, count: number) {
  const periods = [];
  let currentDate = new Date(lastPayday);
  currentDate.setDate(currentDate.getDate() + 1); // Start one day after the payday

  for (let i = 0; i < count; i++) {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    end.setDate(end.getDate() + 14); // Set to the next payday

    periods.push({
      start: start.toISOString(),
      end: end.toISOString(),
    });

    // Move to next payday
    currentDate.setDate(currentDate.getDate() + 14);
  }

  return periods;
}
</script>
