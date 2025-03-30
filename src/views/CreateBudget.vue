<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 text-center">
          Create New Budget
        </h1>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Budget Name
          </label>
          <div class="mt-1">
            <input
              id="name"
              v-model="budget.name"
              type="text"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Personal Budget 2024"
            />
          </div>
        </div>

        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <div class="mt-1">
            <textarea
              id="description"
              v-model="budget.description"
              rows="3"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="A brief description of your budget"
            ></textarea>
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

        <div class="flex items-center justify-between">
          <button
            type="button"
            @click="router.push('/')"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Welcome
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {{ isSubmitting ? "Creating..." : "Create Budget" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { budgetService } from "../services/budgetService";

const router = useRouter();
const budget = ref({
  name: "",
  description: "",
});
const error = ref<string | null>(null);
const isSubmitting = ref(false);

const handleSubmit = async () => {
  error.value = null;
  isSubmitting.value = true;

  try {
    await budgetService.createBudget(budget.value);
    router.push("/budget");
  } catch (e: any) {
    if (e.message === "Save operation cancelled") {
      // User cancelled the save dialog, no need to show error
      return;
    }
    error.value = e.message || "Failed to create budget";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
