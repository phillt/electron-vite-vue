<template>
  <div class="min-h-screen bg-gray-100 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Add Income</h2>
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
            <div>
              <label
                for="amount"
                class="block text-sm font-medium text-gray-700"
              >
                Amount (After Taxes)
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
              <p class="mt-1 text-sm text-gray-500">
                Enter your take-home pay after taxes. If hourly, use a
                conservative estimate.
              </p>
            </div>

            <div>
              <label
                for="frequency"
                class="block text-sm font-medium text-gray-700"
              >
                Frequency
              </label>
              <select
                id="frequency"
                v-model="income.frequency"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">Select frequency</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
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
                {{ isSubmitting ? "Adding..." : "Add Income" }}
              </button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { budgetService } from "../services/budgetService";

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());
const isSubmitting = ref(false);

const income = ref({
  amount: 0,
  frequency: "",
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    // TODO: Implement income addition logic
    console.log("Income data:", income.value);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
    // Reset form
    income.value.amount = 0;
    income.value.frequency = "";
    // Navigate back to income-expenses
    router.push("/income-expenses");
  } catch (error) {
    console.error("Error adding income:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
