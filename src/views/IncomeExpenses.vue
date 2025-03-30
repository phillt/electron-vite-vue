<template>
  <BasePage title="Income & Expenses">
    <div v-if="!currentBudget" class="text-center py-12">
      <p class="text-brand-muted">No budget is currently open.</p>
      <BaseButton variant="primary" class="mt-4" @click="$router.push('/')">
        Open or Create Budget
      </BaseButton>
    </div>

    <template v-else>
      <!-- Income Sources Section -->
      <div class="mb-12">
        <BaseSection
          title="Income Sources"
          :action="{
            label: 'Add New Income',
            variant: 'secondary',
            onClick: () => $router.push('/add-income'),
          }"
        />

        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-brand-surface">
            <BaseList
              v-for="income in currentBudget?.incomes || []"
              :key="income.name"
              :title="income.name"
              :subtitle="'Next payday: ' + getNextPayday(income)"
              :amount="income.amount"
              amount-color="success"
              :actions="[
                {
                  label: 'Edit',
                  color: 'primary',
                  onClick: () => editIncome(income),
                },
                {
                  label: 'Delete',
                  color: 'danger',
                  onClick: () => deleteIncome(income),
                },
              ]"
            />
          </ul>
        </div>
      </div>

      <!-- Bills Section -->
      <div>
        <BaseSection
          title="Bills"
          :action="{
            label: 'Add New Bill',
            variant: 'secondary',
            onClick: () => $router.push('/add-bill'),
          }"
        />

        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-brand-surface">
            <BaseList
              v-for="bill in currentBudget?.bills || []"
              :key="bill.name"
              :title="bill.name"
              :subtitle="'Due on the ' + bill.dueDay + 'th of each month'"
              :amount="bill.amount"
              amount-color="warning"
              :actions="[
                {
                  label: 'Edit',
                  color: 'primary',
                  onClick: () => editBill(bill),
                },
                {
                  label: 'Delete',
                  color: 'danger',
                  onClick: () => deleteBill(bill),
                },
              ]"
            />
          </ul>
        </div>
      </div>
    </template>
  </BasePage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { budgetService } from "../services/budgetService";
import { useRouter } from "vue-router";
import type { Income, Bill } from "../services/budgetService";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BaseList from "../components/atoms/BaseList.vue";
import BaseSection from "../components/atoms/BaseSection.vue";
import BasePage from "../components/atoms/BasePage.vue";

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const getNextPayday = (income: Income) => {
  const lastPayday = new Date(income.lastPayday);
  const nextPayday = new Date(lastPayday);
  nextPayday.setDate(nextPayday.getDate() + 15); // Add 15 days to get to the next payday (14 days for current period + 1 day)
  return formatDate(nextPayday.toISOString());
};

const editIncome = (income: Income) => {
  router.push(`/add-income?edit=${income.name}`);
};

const deleteIncome = async (income: Income) => {
  if (confirm(`Are you sure you want to delete ${income.name}?`)) {
    try {
      await budgetService.deleteIncome(income.name);
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  }
};

const editBill = (bill: Bill) => {
  router.push(`/add-bill?edit=${bill.name}`);
};

const deleteBill = async (bill: Bill) => {
  if (confirm(`Are you sure you want to delete ${bill.name}?`)) {
    try {
      await budgetService.deleteBill(bill.name);
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  }
};
</script>
