<!-- AddExpense.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { budgetService } from "../services/budgetService";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BaseInput from "../components/atoms/BaseInput.vue";

const router = useRouter();
const route = useRoute();
const payPeriodIndex = parseInt(route.query.payPeriodIndex as string);

const expense = ref({
  name: "",
  amount: 0,
  isPaid: false,
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
        </div>
      </div>
    </div>

    <div class="flex-1">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BaseCard elevated>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <BaseInput
              v-model="expense.name"
              name="name"
              label="Expense Name"
              type="text"
              required
              placeholder="e.g., Groceries"
            />

            <BaseInput
              v-model="expense.amount"
              name="amount"
              type="number"
              label="Amount"
              required
              min="0"
              step="0.01"
              prefix="$"
              placeholder="0.00"
            />

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

            <div class="flex justify-end space-x-3">
              <BaseButton
                type="button"
                variant="outline"
                @click="router.back()"
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                variant="primary"
              >
                Add Expense
              </BaseButton>
            </div>
          </form>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
