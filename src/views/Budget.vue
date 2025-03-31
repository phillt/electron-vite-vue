<!-- Budget.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { budgetService } from "../services/budgetService";
import type { PayPeriod } from "../services/budgetService";
import { useRouter } from "vue-router";
import BaseButton from "../components/atoms/BaseButton.vue";
import BasePage from "../components/atoms/BasePage.vue";
import PayPeriodCard from "../components/molecules/PayPeriodCard.vue";

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());
const currentPayPeriodIndex = computed(() =>
  budgetService.getCurrentPayPeriodIndex()
);
const loading = ref(false);
const error = ref<string | null>(null);

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
        v-for="(payPeriod, index) in currentBudget.payPeriods"
        :key="payPeriod.startDate"
        :pay-period="payPeriod"
        :index="index"
        :is-current-period="index === currentPayPeriodIndex"
        :is-past-period="index < currentPayPeriodIndex"
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
      />
    </div>
  </BasePage>
</template>
