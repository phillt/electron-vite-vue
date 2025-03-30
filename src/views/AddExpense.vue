<!-- AddExpense.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { budgetService } from "../services/budgetService";

const router = useRouter();
const route = useRoute();
const payPeriodIndex = parseInt(route.query.payPeriodIndex as string);

const expense = ref({
  name: "",
  amount: 0,
});

const error = ref<string | null>(null);
const isSubmitting = ref(false);

const handleSubmit = async () => {
  error.value = null;
  isSubmitting.value = true;

  try {
    await budgetService.addExpense(payPeriodIndex, expense.value);
    router.back();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="py-6">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">Add Expense</h1>
          <button
            @click="router.back()"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <form
          @submit.prevent="handleSubmit"
          class="space-y-6 bg-white p-6 rounded-lg shadow"
        >
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Expense Name
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="expense.name"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Groceries"
              />
            </div>
          </div>

          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="amount"
                v-model="expense.amount"
                type="number"
                min="0"
                step="0.01"
                required
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>
          </div>

          <div v-if="error" class="text-sm text-red-600">
            {{ error }}
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {{ isSubmitting ? "Adding..." : "Add Expense" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
