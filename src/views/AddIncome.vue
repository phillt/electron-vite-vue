<template>
  <BasePage
    :title="'Add New Income'"
    description="Configure your income details and payment schedule"
  >
    <div class="max-w-5xl mx-auto">
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
                <BaseInput
                  v-model="incomeName"
                  type="text"
                  name="income-name"
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
                <BaseInput
                  v-model="incomeAmount"
                  type="number"
                  name="income-amount"
                  prefix="$"
                  placeholder="0"
                />
              </div>

              <!-- Pay Frequency -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Pay Frequency</label
                >
                <BaseInput
                  v-model="income.frequency"
                  type="select"
                  name="income-frequency"
                  :options="[{ value: 'bi-weekly', label: 'Bi-weekly' }]"
                />
              </div>

              <!-- Last Payday -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Last Payday</label
                >
                <BaseInput
                  v-model="incomeLastPayday"
                  type="date"
                  name="income-last-payday"
                  :min="lastWeekDate"
                />
                <p class="text-sm text-gray-500">
                  Select your most recent payday
                </p>
              </div>

              <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

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
import { useRouter } from "vue-router";
import { budgetService, type Income } from "../services/budgetService";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BaseInput from "../components/atoms/BaseInput.vue";
import BasePage from "../components/atoms/BasePage.vue";

const router = useRouter();
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
