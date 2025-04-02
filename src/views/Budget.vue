<!-- Budget.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { budgetService } from "../services/budgetService";
import type { PayPeriod, Bill } from "../services/budgetService";
import { useRouter } from "vue-router";
import BaseButton from "../components/atoms/BaseButton.vue";
import BasePage from "../components/atoms/BasePage.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BaseToggle from "../components/atoms/BaseToggle.vue";
import PayPeriodCard from "../components/molecules/PayPeriodCard.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faArrowDownWideShort);

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());
const currentPayPeriodIndex = computed(() =>
  budgetService.getCurrentPayPeriodIndex()
);
const loading = ref(false);
const error = ref<string | null>(null);
const filters = ref<Set<"past" | "current" | "future">>(
  new Set(["current", "future"])
);

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
    // Enable future filter to show the newly created period
    filters.value.add("future");
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

const handleAddBill = async (payPeriodIndex: number, bill: Bill) => {
  try {
    await budgetService.addBillToPayPeriod(payPeriodIndex, bill);
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleAddExpense = (payPeriodIndex: number) => {
  router.push(`/add-expense?payPeriodIndex=${payPeriodIndex}`);
};

const handleDeleteBill = async (payPeriodIndex: number, billName: string) => {
  try {
    await budgetService.deleteBillFromPayPeriod(payPeriodIndex, billName);
  } catch (e: any) {
    error.value = e.message;
  }
};

const handleDeletePayPeriod = async (index: number) => {
  try {
    await budgetService.deletePayPeriod(index);
  } catch (e: any) {
    error.value = e.message;
  }
};

const nextPayPeriodDates = computed(() => {
  if (!currentBudget.value || currentBudget.value.payPeriods.length === 0)
    return null;

  const lastPayPeriod =
    currentBudget.value.payPeriods[currentBudget.value.payPeriods.length - 1];
  const lastEndDate = new Date(lastPayPeriod.endDate);

  // Calculate next period dates (assuming 2-week periods)
  const nextStartDate = new Date(lastEndDate);
  nextStartDate.setDate(nextStartDate.getDate() + 1);

  const nextEndDate = new Date(nextStartDate);
  nextEndDate.setDate(nextEndDate.getDate() + 13); // 14 days total (including start date)

  return {
    start: nextStartDate.toLocaleDateString(),
    end: nextEndDate.toLocaleDateString(),
  };
});
</script>

<template>
  <BasePage title="Budget Overview">
    <template #actions>
      <BaseCard :padding="4">
        <div class="flex items-center space-x-4">
          <FontAwesomeIcon
            icon="arrow-down-wide-short"
            class="text-brand-text"
          />
          <div class="flex space-x-4">
            <BaseToggle v-model="pastFilter" label="Past" />
            <BaseToggle v-model="currentFilter" label="Current" />
            <BaseToggle v-model="futureFilter" label="Future" />
          </div></div
      ></BaseCard>
    </template>

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
        :is-last-future-period="
          currentBudget.payPeriods.indexOf(payPeriod) ===
            currentBudget.payPeriods.length - 1 &&
          currentBudget.payPeriods.indexOf(payPeriod) > currentPayPeriodIndex
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
        @add-bill="(bill) => handleAddBill(index, bill)"
        @add-expense="() => handleAddExpense(index)"
        @delete-expense="(expenseId) => handleDeleteExpense(index, expenseId)"
        @delete-bill="(billName) => handleDeleteBill(index, billName)"
        @delete-pay-period="handleDeletePayPeriod"
      />

      <!-- Next Pay Period Cutout -->
      <div
        class="relative bg-brand-surface rounded-lg border-2 border-dashed border-brand-primary/30 p-6"
      >
        <div class="text-center text-brand-muted mb-2">
          Ready to start your next pay period?
        </div>
        <div
          v-if="nextPayPeriodDates"
          class="text-center text-sm text-brand-primary mb-4"
        >
          {{ nextPayPeriodDates.start }} - {{ nextPayPeriodDates.end }}
        </div>
        <div class="flex justify-center">
          <BaseButton
            variant="outline"
            :disabled="loading"
            @click="handleCreatePayPeriod"
          >
            {{ loading ? "Creating..." : "Start Next Pay Period" }}
          </BaseButton>
        </div>
      </div>
    </div>
  </BasePage>
</template>
