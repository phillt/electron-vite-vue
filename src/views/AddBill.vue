<template>
  <div class="min-h-screen bg-gray-100 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditing ? "Edit" : "Add" }} Bill
          </h2>
          <button
            @click="$router.push('/income-expenses')"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Income & Bills
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
                Bill Name
              </label>
              <input
                type="text"
                id="name"
                v-model="bill.name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                :disabled="isEditing"
                placeholder="e.g., Rent, Utilities, etc."
              />
              <p class="mt-1 text-sm text-gray-500">
                Give this bill a name to help you identify it.
              </p>
            </div>

            <div>
              <label
                for="dueDay"
                class="block text-sm font-medium text-gray-700"
              >
                Due Day of Month
              </label>
              <input
                type="number"
                id="dueDay"
                v-model="bill.dueDay"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                min="1"
                max="31"
                placeholder="1-31"
              />
              <p class="mt-1 text-sm text-gray-500">
                Enter the day of the month when this bill is due.
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
                  v-model="bill.amount"
                  class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
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
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {{
                  isSubmitting
                    ? "Saving..."
                    : isEditing
                    ? "Save Changes"
                    : "Add Bill"
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
import { budgetService, type Bill } from "../services/budgetService";

const router = useRouter();
const route = useRoute();
const currentBudget = computed(() => budgetService.getCurrentBudget());
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const isEditing = computed(() => !!route.query.edit);

const bill = ref({
  name: "",
  dueDay: 1,
  amount: 0,
});

onMounted(() => {
  if (isEditing.value) {
    const billName = route.query.edit as string;
    const existingBill = currentBudget.value?.bills.find(
      (b) => b.name === billName
    );
    if (existingBill) {
      bill.value = { ...existingBill };
    } else {
      error.value = "Bill not found.";
    }
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  error.value = null;

  try {
    // Check if name already exists (only for new bills)
    if (!isEditing.value) {
      const existingBills = currentBudget.value?.bills || [];
      if (existingBills.some((b: Bill) => b.name === bill.value.name)) {
        error.value = "A bill with this name already exists.";
        return;
      }
    }

    // Validate due day
    if (bill.value.dueDay < 1 || bill.value.dueDay > 31) {
      error.value = "Due day must be between 1 and 31.";
      return;
    }

    if (isEditing.value) {
      // Update the bill
      await budgetService.updateBill(route.query.edit as string, bill.value);
    } else {
      // Add the bill to the budget
      await budgetService.addBill({
        name: bill.value.name,
        dueDay: bill.value.dueDay,
        amount: bill.value.amount,
      });
    }

    // Reset form
    bill.value.name = "";
    bill.value.dueDay = 1;
    bill.value.amount = 0;

    // Navigate back to income-expenses
    router.push("/income-expenses");
  } catch (err) {
    console.error("Error saving bill:", err);
    error.value = "Failed to save bill. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
