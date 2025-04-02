<template>
  <BaseForm
    :is-submitting="isSubmitting"
    :is-form-valid="isFormValid"
    :error="error"
    :submit-button-text="editingIncome ? 'Update Income' : 'Add Income'"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <!-- Income Name -->
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Income Name</label>
      <BaseInput
        v-model="incomeName"
        type="text"
        name="income-name"
        placeholder="e.g., Main Job, Side Gig, etc."
        :disabled="!!editingIncome"
      />
      <p class="text-sm text-gray-500">Give this income source a unique name</p>
    </div>

    <!-- Amount -->
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Amount</label>
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
        :disabled="true"
      />
      <p class="text-sm text-gray-500">
        Currently only bi-weekly pay periods are supported
      </p>
    </div>

    <!-- Last Payday -->
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Last Payday</label>
      <BaseInput
        v-model="incomeLastPayday"
        type="date"
        name="income-last-payday"
        :min="lastWeekDate"
      />
      <p class="text-sm text-gray-500">Select your most recent payday</p>
    </div>
  </BaseForm>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { budgetService, type Income } from "../services/budgetService";
import BaseInput from "../components/atoms/BaseInput.vue";
import BaseForm from "../components/templates/BaseForm.vue";

const props = defineProps<{
  editingIncome?: Income | null;
}>();

const isSubmitting = ref(false);
const error = ref<string | null>(null);

// Get today's date in YYYY-MM-DD format for the date input min attribute
const today = new Date().toISOString().split("T")[0];
const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);
const lastWeekDate = lastWeek.toISOString().split("T")[0];

const defaultIncome = {
  name: "",
  amount: 0,
  frequency: "bi-weekly" as const,
  lastPayday: today,
  payPeriods: [],
};

const income = ref<Partial<Income>>({ ...defaultIncome });

// Watch for changes to editingIncome prop
watch(
  () => props.editingIncome,
  (newIncome) => {
    if (newIncome) {
      // Create a new object to avoid reference issues
      income.value = {
        name: newIncome.name,
        amount: newIncome.amount,
        frequency: newIncome.frequency,
        lastPayday: newIncome.lastPayday,
        payPeriods: [...newIncome.payPeriods],
      };
    } else {
      // Reset form when not editing
      income.value = { ...defaultIncome };
    }
  },
  { immediate: true, deep: true }
);

// Computed properties for v-model bindings
const incomeName = computed({
  get: () => income.value.name || "",
  set: (value: string) => {
    income.value.name = value;
  },
});

const incomeAmount = computed({
  get: () => Number(income.value.amount) || 0,
  set: (value: number) => {
    income.value.amount = Number(value) || 0;
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
    const incomeData = {
      ...income.value,
      payPeriods,
      frequency: "bi-weekly" as const,
    } as Income;

    if (props.editingIncome) {
      await budgetService.updateIncome(props.editingIncome.name, incomeData);
    } else {
      await budgetService.addIncome(incomeData);
    }

    emit("close");
  } catch (err) {
    console.error("Error saving income:", err);
    error.value = "Failed to save income. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

const emit = defineEmits<{
  (e: "close"): void;
}>();

const handleCancel = () => {
  emit("close");
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
