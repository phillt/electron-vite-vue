<!-- Budget.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { budgetService } from "../services/budgetService";
import type { PayPeriod } from "../services/budgetService";
import { useRouter } from "vue-router";
import BaseButton from "../components/atoms/BaseButton.vue";
import BasePage from "../components/atoms/BasePage.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BaseToggle from "../components/atoms/BaseToggle.vue";
import PayPeriodCard from "../components/molecules/PayPeriodCard.vue";

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());
const currentPayPeriodIndex = computed(() =>
  budgetService.getCurrentPayPeriodIndex()
);
const loading = ref(false);
const error = ref<string | null>(null);
const filters = ref<Set<"past" | "current" | "future">>(new Set());

const pastFilter = computed({
  get: () => filters.value.has("past"),
  set: (value: boolean) => {
    if (value) filters.value.add("past");
    else filters.value.delete("past");
  },
});

const currentFilter = computed({
  get: () => filters.value.has("current"),
  set: (value: boolean) => {
    if (value) filters.value.add("current");
    else filters.value.delete("current");
  },
});

const futureFilter = computed({
  get: () => filters.value.has("future"),
  set: (value: boolean) => {
    if (value) filters.value.add("future");
    else filters.value.delete("future");
  },
});

const filteredPayPeriods = computed(() => {
  if (!currentBudget.value) return [];

  // If no filters are selected, show all periods
  if (filters.value.size === 0) return currentBudget.value.payPeriods;

  return currentBudget.value.payPeriods.filter((_, index) => {
    const isPast = index < currentPayPeriodIndex.value;
    const isCurrent = index === currentPayPeriodIndex.value;
    const isFuture = index > currentPayPeriodIndex.value;

    return (
      (filters.value.has("past") && isPast) ||
      (filters.value.has("current") && isCurrent) ||
      (filters.value.has("future") && isFuture)
    );
  });
});

const handleCreatePayPeriod = async () => {
  loading.value = true;
  error.value = null;
  try {
    await budgetService.createPayPeriod();
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const handleDeleteLastPayPeriod = async () => {
  try {
    await budgetService.deleteLastPayPeriod();
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleToggleBillPaid = async (
  payPeriodIndex: number,
  billName: string
) => {
  try {
    await budgetService.toggleBillPaid(payPeriodIndex, billName);
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleToggleExpensePaid = async (
  payPeriodIndex: number,
  expenseId: string
) => {
  try {
    await budgetService.toggleExpensePaid(payPeriodIndex, expenseId);
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleUpdateBillAmount = async (
  payPeriodIndex: number,
  billName: string,
  newAmount: number
) => {
  try {
    await budgetService.updatePayPeriodBillAmount(
      payPeriodIndex,
      billName,
      newAmount
    );
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleUpdateExpenseAmount = async (
  payPeriodIndex: number,
  expenseId: string,
  newAmount: number
) => {
  try {
    await budgetService.updatePayPeriodExpenseAmount(
      payPeriodIndex,
      expenseId,
      newAmount
    );
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleDeleteExpense = async (
  payPeriodIndex: number,
  expenseId: string
) => {
  try {
    await budgetService.deleteExpense(payPeriodIndex, expenseId);
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleUpdatePaycheckAmount = async (
  payPeriodIndex: number,
  newAmount: number
) => {
  try {
    await budgetService.updatePayPeriodPaycheckAmount(
      payPeriodIndex,
      newAmount
    );
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleAddBill = (payPeriodIndex: number) => {
  router.push(`/add-bill?payPeriodIndex=${payPeriodIndex}`);
};

const handleAddExpense = (payPeriodIndex: number) => {
  router.push(`/add-expense?payPeriodIndex=${payPeriodIndex}`);
};
</script>

<template>
  <BasePage title="Budget Overview">
    <template #actions>
      <BaseButton
        variant="outline"
        v-if="
          currentBudget &&
          currentBudget.payPeriods.length > 0 &&
          currentPayPeriodIndex !== currentBudget.payPeriods.length - 1
        "
        @click="handleDeleteLastPayPeriod"
      >
        Delete Last Period
      </BaseButton>
      <BaseButton
        variant="primary"
        :disabled="loading"
        @click="handleCreatePayPeriod"
      >
        {{ loading ? "Creating..." : "Create Next Pay Period" }}
      </BaseButton>
    </template>

    <BaseCard class="mb-6">
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium text-brand-text">Filter:</label>
        <div class="flex space-x-4">
          <BaseToggle v-model="pastFilter" label="Past" />
          <BaseToggle v-model="currentFilter" label="Current" />
          <BaseToggle v-model="futureFilter" label="Future" />
        </div>
      </div>
    </BaseCard>

    <div v-if="error" class="rounded-md bg-brand-danger/10 p-4">
      <div class="text-sm text-brand-danger">{{ error }}</div>
    </div>

    <div v-if="!currentBudget" class="text-center py-12">
      <h3 class="text-lg font-medium text-brand-text">No Budget Open</h3>
      <p class="mt-2 text-sm text-brand-muted">
        Please open or create a budget to get started.
      </p>
    </div>

    <div
      v-else-if="currentBudget.payPeriods.length === 0"
      class="text-center py-12"
    >
      <h3 class="text-lg font-medium text-brand-text">No Pay Periods Yet</h3>
      <p class="mt-2 text-sm text-brand-muted">
        Click the button above to create your first pay period.
      </p>
    </div>

    <div v-else class="space-y-6">
      <PayPeriodCard
        v-for="(payPeriod, index) in filteredPayPeriods"
        :key="payPeriod.startDate"
        :pay-period="payPeriod"
        :index="currentBudget.payPeriods.indexOf(payPeriod)"
        :is-current-period="
          currentBudget.payPeriods.indexOf(payPeriod) === currentPayPeriodIndex
        "
        :is-past-period="
          currentBudget.payPeriods.indexOf(payPeriod) < currentPayPeriodIndex
        "
        @create-pay-period="handleCreatePayPeriod"
        @delete-last-pay-period="handleDeleteLastPayPeriod"
        @toggle-bill-paid="(billName) => handleToggleBillPaid(index, billName)"
        @toggle-expense-paid="
          (expenseId) => handleToggleExpensePaid(index, expenseId)
        "
        @update-bill-amount="
          (billName, amount) => handleUpdateBillAmount(index, billName, amount)
        "
        @update-expense-amount="
          (expenseId, amount) =>
            handleUpdateExpenseAmount(index, expenseId, amount)
        "
        @update-paycheck-amount="
          (amount) => handleUpdatePaycheckAmount(index, amount)
        "
        @add-bill="() => handleAddBill(index)"
        @add-expense="() => handleAddExpense(index)"
        @delete-expense="(expenseId) => handleDeleteExpense(index, expenseId)"
      />
    </div>
  </BasePage>
</template>
