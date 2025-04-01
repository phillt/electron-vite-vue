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
            variant: 'primary',
            onClick: () => (showAddIncomeModal = true),
          }"
        />

        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-brand-surface">
            <BaseListHeader title="Income" />
            <template
              v-for="(income, index) in currentBudget?.incomes || []"
              :key="income.name"
            >
              <li :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'">
                <BaseList
                  :title="income.name"
                  :subtitle="getNextPayday(income)"
                  :amount="income.amount"
                  :actions="[
                    {
                      label: 'Delete',
                      color: 'ghost',
                      onClick: () => deleteIncome(income),
                    },
                    {
                      label: 'Edit',
                      color: 'outline',
                      onClick: () => editIncome(income),
                    },
                  ]"
                />
              </li>
            </template>
          </ul>
        </div>
      </div>

      <!-- Bills Section -->
      <div>
        <BaseSection
          title="Bills"
          :action="{
            label: 'Add New Bill',
            variant: 'primary',
            onClick: () => (showAddBillModal = true),
          }"
        />

        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-brand-surface">
            <BaseListHeader title="Bills" />
            <BaseList
              v-for="(bill, index) in currentBudget?.bills || []"
              :key="bill.name"
              class="even:bg-gray-100"
              :title="bill.name"
              :subtitle="getNextDueDate(bill.dueDay)"
              :amount="bill.amount"
              :actions="[
                {
                  label: 'Delete',
                  color: 'ghost',
                  onClick: () => deleteBill(bill),
                },
                {
                  label: 'Edit',
                  color: 'outline',
                  onClick: () => editBill(bill),
                },
              ]"
            />
          </ul>
        </div>
      </div>
    </template>

    <!-- Add Bill Modal -->
    <BaseModal v-model="showAddBillModal" title="Add New Bill">
      <BillForm
        :existing-bills="currentBudget?.bills"
        @submit="handleAddBill"
        @cancel="showAddBillModal = false"
      />
    </BaseModal>

    <!-- Add Income Modal -->
    <BaseModal v-model="showAddIncomeModal" title="Add New Income">
      <AddIncome @close="showAddIncomeModal = false" />
    </BaseModal>
  </BasePage>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { budgetService } from "../services/budgetService";
import { useRouter } from "vue-router";
import type { Income, Bill } from "../services/budgetService";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BaseList from "../components/atoms/BaseList.vue";
import BaseSection from "../components/atoms/BaseSection.vue";
import BasePage from "../components/atoms/BasePage.vue";
import BaseModal from "../components/atoms/BaseModal.vue";
import BillForm from "../components/forms/BillForm.vue";
import AddIncome from "./AddIncome.vue";
import BaseListHeader from "../components/atoms/BaseListHeader.vue";

const router = useRouter();
const currentBudget = computed(() => budgetService.getCurrentBudget());
const showAddBillModal = ref(false);
const showAddIncomeModal = ref(false);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const getNextPayday = (income: Income) => {
  const lastPayday = new Date(income.lastPayday);
  const nextPayday = new Date(lastPayday);
  nextPayday.setDate(nextPayday.getDate() + 15); // Add 15 days to get to the next payday (14 days for current period + 1 day)

  // Calculate days until payday
  const today = new Date();
  const daysUntilPayday = Math.ceil(
    (nextPayday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilPayday <= 5) {
    return `Next payday in ${daysUntilPayday} day${
      daysUntilPayday === 1 ? "" : "s"
    }`;
  }

  return `Next payday: ${formatDate(nextPayday.toISOString())}`;
};

const getNextDueDate = (dueDay: number) => {
  const today = new Date();
  const currentDay = today.getDate();
  const nextDueDate = new Date(today);

  if (currentDay > dueDay) {
    // If we're past the due day this month, set it for next month
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  }

  nextDueDate.setDate(dueDay);

  // Calculate days until due
  const daysUntilDue = Math.ceil(
    (nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue <= 14) {
    return `Due in ${daysUntilDue} day${daysUntilDue === 1 ? "" : "s"}`;
  }

  return `Due ${formatDate(nextDueDate.toISOString())}`;
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

const handleAddBill = async (bill: Bill) => {
  try {
    await budgetService.addBill(bill);
    showAddBillModal.value = false;
  } catch (error) {
    console.error("Error adding bill:", error);
  }
};

const handleAddIncomeSuccess = () => {
  showAddIncomeModal.value = false;
  // Optionally refresh the income sources list here
};
</script>
