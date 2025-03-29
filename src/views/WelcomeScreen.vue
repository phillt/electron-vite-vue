<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Welcome to Budget Manager
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Create a new budget or open an existing one
        </p>
      </div>
      <div class="mt-8 space-y-4">
        <button
          @click="$router.push('/create-budget')"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Budget
        </button>
        <button
          @click="openExistingBudget"
          class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Open Existing Budget
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { budgetService } from "../services/budgetService";

const router = useRouter();

const openExistingBudget = async () => {
  const budget = await budgetService.openBudget();
  if (budget) {
    // TODO: Navigate to budget view
    console.log("Budget loaded:", budget);
  }
};
</script>
