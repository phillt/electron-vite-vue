<template>
  <BasePage :title="'Add New Income'">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-xl font-medium text-gray-900">Add New Income</h1>
          <p class="text-sm text-gray-500 mt-1">
            Configure your income details and payment schedule
          </p>
        </div>
        <BaseButton
          variant="outline"
          size="sm"
          @click="$router.push('/income-expenses')"
        >
          View All
        </BaseButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left Column: Form -->
        <div class="md:col-span-2">
          <BaseCard>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Income Name -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Income Name</label
                >
                <input
                  v-model="incomeName"
                  type="text"
                  class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="e.g., Main Job, Side Gig, etc."
                />
                <p class="text-sm text-gray-500">
                  Give this income source a unique name
                </p>
              </div>

              <!-- Amount -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Amount</label
                >
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  >
                    <span class="text-gray-500">$</span>
                  </div>
                  <input
                    v-model="incomeAmount"
                    type="number"
                    class="block w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
              </div>

              <!-- Pay Frequency -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Pay Frequency</label
                >
                <select
                  v-model="income.frequency"
                  class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="bi-weekly">Bi-weekly</option>
                </select>
              </div>

              <!-- Last Payday -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Last Payday</label
                >
                <input
                  v-model="incomeLastPayday"
                  type="date"
                  class="block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                  :min="lastWeekDate"
                />
                <p class="text-sm text-gray-500">
                  Select your most recent payday
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3 pt-4">
                <BaseButton
                  variant="outline"
                  @click="$router.push('/income-expenses')"
                >
                  Cancel
                </BaseButton>
                <BaseButton
                  type="submit"
                  variant="primary"
                  :disabled="isSubmitting || !isFormValid"
                >
                  {{ isSubmitting ? "Saving..." : "Add Income" }}
                </BaseButton>
              </div>
            </form>
          </BaseCard>
        </div>

        <!-- Right Column: Info Cards -->
        <div class="space-y-4">
          <!-- Quick Tips -->
          <BaseCard>
            <h3 class="text-base font-medium text-gray-900 mb-4">Quick Tips</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <div
                  class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mr-3"
                >
                  1
                </div>
                <p class="text-sm text-gray-600">
                  Use clear, descriptive names for your income sources
                </p>
              </li>
              <li class="flex items-start">
                <div
                  class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mr-3"
                >
                  2
                </div>
                <p class="text-sm text-gray-600">
                  Enter your net income (after taxes and deductions)
                </p>
              </li>
              <li class="flex items-start">
                <div
                  class="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mr-3"
                >
                  3
                </div>
                <p class="text-sm text-gray-600">
                  Make sure your last payday is accurate
                </p>
              </li>
            </ul>
          </BaseCard>

          <!-- About Pay Periods -->
          <BaseCard>
            <h3 class="text-base font-medium text-gray-900 mb-4">
              About Pay Periods
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              The system will automatically generate 5 pay periods based on your
              last payday:
            </p>
            <ul class="space-y-2">
              <li class="flex items-center text-sm text-gray-600">
                <span class="text-blue-600 mr-2">•</span>
                Starts the day after your last payday
              </li>
              <li class="flex items-center text-sm text-gray-600">
                <span class="text-blue-600 mr-2">•</span>
                Runs for 14 days (bi-weekly)
              </li>
              <li class="flex items-center text-sm text-gray-600">
                <span class="text-blue-600 mr-2">•</span>
                Helps track your income across the budget period
              </li>
            </ul>
          </BaseCard>
        </div>
      </div>
    </div>
  </BasePage>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { budgetService, type Income } from "../services/budgetService";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BasePage from "../components/atoms/BasePage.vue";

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

const income = ref<Partial<Income>>({
  name: "",
  amount: 0,
  frequency: "bi-weekly" as const,
  lastPayday: today,
  payPeriods: [],
});

// Computed properties for v-model bindings
const incomeName = computed({
  get: () => income.value.name || "",
  set: (value: string) => {
    income.value.name = value;
  },
});

const incomeAmount = computed({
  get: () => income.value.amount || 0,
  set: (value: number) => {
    income.value.amount = value;
  },
});

const incomeLastPayday = computed({
  get: () => income.value.lastPayday || today,
  set: (value: string) => {
    income.value.lastPayday = value;
  },
});

const isFormValid = computed(() => {
  return (
    incomeName.value.trim() !== "" &&
    incomeAmount.value > 0 &&
    income.value.frequency === "bi-weekly" &&
    incomeLastPayday.value !== ""
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    const payPeriods = generatePayPeriods(income.value.lastPayday!, 5);
    await budgetService.addIncome({
      ...income.value,
      payPeriods,
      frequency: "bi-weekly" as const,
    } as Income);

    router.push("/income-expenses");
  } catch (err) {
    console.error("Error saving income:", err);
    error.value = "Failed to save income. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

function generatePayPeriods(lastPayday: string, count: number) {
  const periods = [];
  let currentDate = new Date(lastPayday);
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 0; i < count; i++) {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    end.setDate(end.getDate() + 14);

    periods.push({
      start: start.toISOString(),
      end: end.toISOString(),
    });

    currentDate.setDate(currentDate.getDate() + 14);
  }

  return periods;
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
