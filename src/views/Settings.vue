<!-- Settings.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { budgetService } from "../services/budgetService";

const currentBudget = computed(() => budgetService.getCurrentBudget());
</script>

<template>
  <div class="p-6">
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
      <p class="mt-2 text-sm text-gray-600">
        Manage your budget settings and preferences
      </p>
    </header>

    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="space-y-6">
          <!-- Budget Information -->
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Budget Information
            </h3>
            <div class="mt-2 max-w-xl text-sm text-gray-500">
              <p>Current budget details and file location.</p>
            </div>
            <div class="mt-5 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-gray-500">Budget Name:</span>
                <span class="text-gray-900">{{
                  currentBudget?.name || "No budget loaded"
                }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-gray-500">File Location:</span>
                <span class="text-gray-900">{{
                  currentBudget?.filePath || "N/A"
                }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-gray-500">Created:</span>
                <span class="text-gray-900">{{
                  currentBudget?.createdAt
                    ? new Date(currentBudget.createdAt).toLocaleDateString()
                    : "N/A"
                }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium text-gray-500">Last Modified:</span>
                <span class="text-gray-900">{{
                  currentBudget?.updatedAt
                    ? new Date(currentBudget.updatedAt).toLocaleDateString()
                    : "N/A"
                }}</span>
              </div>
            </div>
          </div>

          <div class="pt-6">
            <div class="flex justify-end">
              <button
                type="button"
                class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                @click="budgetService.openBudget()"
              >
                Open Different Budget
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
