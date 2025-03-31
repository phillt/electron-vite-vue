<template>
  <div class="min-h-screen bg-gray-100 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <BaseCard :title="isEditing ? 'Edit Bill' : 'Add Bill'" elevated>
        <template #header>
          <BaseButton
            variant="ghost"
            size="sm"
            @click="$router.push('/income-expenses')"
          >
            Back to Income & Bills
          </BaseButton>
        </template>

        <div v-if="!currentBudget" class="text-center py-12">
          <p class="text-gray-500">No budget is currently open.</p>
          <BaseButton @click="$router.push('/')" class="mt-4">
            Open or Create Budget
          </BaseButton>
        </div>

        <template v-else>
          <form @submit.prevent="handleSubmit" class="space-y-6">
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

            <BaseInput
              v-model="bill.name"
              name="name"
              label="Bill Name"
              placeholder="e.g., Rent, Utilities, etc."
              :disabled="isEditing"
              required
              helper-text="Give this bill a name to help you identify it."
            />

            <BaseInput
              v-model="bill.dueDay"
              name="dueDay"
              type="number"
              label="Due Day of Month"
              placeholder="1-31"
              required
              min="1"
              max="31"
              helper-text="Enter the day of the month when this bill is due."
            />

            <BaseInput
              v-model="bill.amount"
              name="amount"
              type="number"
              label="Amount"
              placeholder="0.00"
              required
              min="0"
              step="0.01"
              prefix="$"
            />

            <div class="flex justify-end space-x-3">
              <BaseButton
                type="button"
                variant="outline"
                @click="$router.push('/income-expenses')"
              >
                Cancel
              </BaseButton>
              <BaseButton
                type="submit"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                variant="primary"
              >
                {{ isEditing ? "Save Changes" : "Add Bill" }}
              </BaseButton>
            </div>
          </form>
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
import BaseInput from "../components/atoms/BaseInput.vue";

const router = useRouter();
const route = useRoute();
const currentBudget = computed(() => budgetService.getCurrentBudget());
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const isEditing = computed(() => !!route.query.edit);

const bill = ref({
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
    } else {
      error.value = "Bill not found.";
    }
  }
});

const handleSubmit = async () => {
  isSubmitting.value = true;
  error.value = null;

  try {
    // Check if name already exists (only for new bills)
    if (!isEditing.value) {
      const existingBills = currentBudget.value?.bills || [];
      if (existingBills.some((b: Bill) => b.name === bill.value.name)) {
        error.value = "A bill with this name already exists.";
        return;
      }
    }

    // Validate due day
    if (bill.value.dueDay < 1 || bill.value.dueDay > 31) {
      error.value = "Due day must be between 1 and 31.";
      return;
    }

    if (isEditing.value) {
      // Update the bill
      await budgetService.updateBill(route.query.edit as string, bill.value);
    } else {
      // Add the bill to the budget
      await budgetService.addBill({
        name: bill.value.name,
        dueDay: bill.value.dueDay,
        amount: bill.value.amount,
      });
    }

    // Reset form
    bill.value.name = "";
    bill.value.dueDay = 1;
    bill.value.amount = 0;

    // Navigate back to income-expenses
    router.push("/income-expenses");
  } catch (err) {
    console.error("Error saving bill:", err);
    error.value = "Failed to save bill. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
