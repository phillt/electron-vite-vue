<!-- Welcome.vue -->
<script setup lang="ts">
import { useRouter } from "vue-router";
import { budgetService } from "../services/budgetService";

const router = useRouter();

const handleOpenBudget = async () => {
  const budget = await budgetService.openBudget();
  if (budget) {
    router.push("/budget");
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Budget Manager</h1>
        <p class="text-gray-600">
          Welcome! Get started by creating a new budget or opening an existing
          one.
        </p>
      </div>

      <div class="space-y-4">
        <button
          @click="router.push('/create-budget')"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Budget
        </button>

        <button
          @click="handleOpenBudget"
          class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Open Existing Budget
        </button>
      </div>
    </div>
  </div>
</template>
