<template>
  <div class="min-h-screen bg-gray-100 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <BaseCard :title="isEditing ? 'Edit Bill' : 'Add Bill'" elevated>
        <div v-if="!currentBudget" class="text-center py-12">
          <p class="text-gray-500">No budget is currently open.</p>
          <BaseButton @click="$router.push('/')" class="mt-4">
            Open or Create Budget
          </BaseButton>
        </div>

        <template v-else>
          <BillForm
            :initial-data="bill"
            :is-editing="isEditing"
            :existing-bills="currentBudget.bills"
            @submit="handleSubmit"
            @cancel="$router.push('/income-expenses')"
          />
        </template>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { budgetService, type Bill } from "../services/budgetService";
import BaseButton from "../components/atoms/BaseButton.vue";
import BaseCard from "../components/atoms/BaseCard.vue";
import BillForm from "../components/forms/BillForm.vue";

const router = useRouter();
const route = useRoute();
const currentBudget = computed(() => budgetService.getCurrentBudget());
const isEditing = computed(() => !!route.query.edit);

const bill = ref<Bill>({
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
    }
  }
});

const handleSubmit = async (formData: Bill) => {
  try {
    if (isEditing.value) {
      // Update the bill
      await budgetService.updateBill(route.query.edit as string, formData);
    } else {
      // Add the bill to the budget
      await budgetService.addBill(formData);
    }

    // Navigate back to income-expenses
    router.push("/income-expenses");
  } catch (err) {
    console.error("Error saving bill:", err);
  }
};
</script>
