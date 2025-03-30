<template>
  <BasePage :title="isEditing ? 'Edit Income' : 'Add Income'">
    <BaseCard>
      <div v-if="!currentBudget" class="text-center py-12">
        <p class="text-brand-muted">No budget is currently open.</p>
        <BaseButton variant="primary" class="mt-4" @click="$router.push('/')">
          Open or Create Budget
        </BaseButton>
      </div>

      <template v-else>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="rounded-md bg-brand-danger/10 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-brand-danger">Error</h3>
                <div class="mt-2 text-sm text-brand-danger/80">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>

          <BaseInput
            v-model="incomeName"
            label="Income Name"
            name="name"
            placeholder="e.g., Main Job, Side Gig, etc."
            :disabled="isEditing"
            required
            helper-text="Give this income source a unique name to help you identify it."
          />

          <BaseInput
            v-model="incomeAmount"
            type="number"
            label="Amount"
            name="amount"
            prefix="$"
            placeholder="0.00"
            required
            min="0"
            step="0.01"
          />

          <div>
            <label
              for="frequency"
              class="block text-sm font-medium text-brand-text"
            >
              Pay Frequency
            </label>
            <select
              id="frequency"
              v-model="income.frequency"
              class="mt-1 block w-full rounded-md border-brand-surface shadow-sm focus:border-brand-dark focus:ring-brand-dark sm:text-sm"
              required
            >
              <option value="bi-weekly">Bi-weekly</option>
            </select>
            <p class="mt-1 text-sm text-brand-muted">
              Select how often you receive this income.
            </p>
          </div>

          <BaseInput
            v-model="incomeLastPayday"
            type="date"
            label="Last Payday"
            name="lastPayday"
            required
            :min="lastWeekDate"
            helper-text="Select the date of your most recent payday for this income source."
          />

          <div class="flex justify-end space-x-3">
            <BaseButton
              variant="outline"
              @click="$router.push('/income-expenses')"
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="submit"
              variant="success"
              :disabled="isSubmitting"
            >
              {{
                isSubmitting
                  ? "Saving..."
                  : isEditing
                  ? "Save Changes"
                  : "Add Income"
              }}
            </BaseButton>
          </div>
        </form>
      </template>
    </BaseCard>
  </BasePage>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { budgetService, type Income } from "../services/budgetService";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BasePage from "../components/atoms/BasePage.vue";
import BaseInput from "../components/atoms/BaseInput.vue";

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

const isEditing = computed(() => {
  return !!route.query.edit;
});

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

onMounted(() => {
  if (isEditing.value) {
    const incomeName = route.query.edit as string;
    const existingIncome = currentBudget.value?.incomes.find(
      (inc) => inc.name === incomeName
    );

    if (existingIncome) {
      income.value = { ...existingIncome };
    } else {
      error.value = "Income not found";
    }
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  error.value = null;

  try {
    // Check if name already exists (only for new incomes)
    if (!isEditing.value) {
      const existingIncomes = currentBudget.value?.incomes || [];
      if (
        existingIncomes.some((inc: Income) => inc.name === income.value.name)
      ) {
        error.value = "An income source with this name already exists.";
        return;
      }
    }

    // Generate pay periods
    const payPeriods = generatePayPeriods(income.value.lastPayday!, 5);

    if (isEditing.value) {
      // Update existing income
      await budgetService.updateIncome(
        route.query.edit as string,
        {
          ...income.value,
          payPeriods,
          frequency: "bi-weekly" as const,
        } as Income
      );
    } else {
      // Add new income
      await budgetService.addIncome({
        ...income.value,
        payPeriods,
        frequency: "bi-weekly" as const,
      } as Income);
    }

    // Reset form
    income.value.name = "";
    income.value.amount = 0;
    income.value.frequency = "bi-weekly" as const;
    income.value.lastPayday = today;
    income.value.payPeriods = [];

    // Navigate back to income-expenses
    router.push("/income-expenses");
  } catch (err) {
    console.error("Error saving income:", err);
    error.value = "Failed to save income. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

// Helper function to generate pay periods
function generatePayPeriods(lastPayday: string, count: number) {
  const periods = [];
  let currentDate = new Date(lastPayday);
  currentDate.setDate(currentDate.getDate() + 1); // Start one day after the payday

  for (let i = 0; i < count; i++) {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    end.setDate(end.getDate() + 14); // Set to the next payday

    periods.push({
      start: start.toISOString(),
      end: end.toISOString(),
    });

    // Move to next payday
    currentDate.setDate(currentDate.getDate() + 14);
  }

  return periods;
}
</script>
