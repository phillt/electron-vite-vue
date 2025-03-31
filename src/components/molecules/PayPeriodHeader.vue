<!-- PayPeriodHeader.vue -->
<script setup lang="ts">
import type { PayPeriod } from "../../services/budgetService";
import BaseInput from "../atoms/BaseInput.vue";
import { ref } from "vue";

const props = defineProps<{
  payPeriod: PayPeriod;
  status: {
    label: string;
    class: string;
    badge: string;
  };
}>();

const emit = defineEmits<{
  (e: "update:paycheckAmount", value: number): void;
}>();

const isEditingPaycheck = ref(false);
const tempPaycheckAmount = ref(props.payPeriod.paycheckAmount);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const handlePaycheckAmountChange = (value: string | number) => {
  const newAmount = parseFloat(value.toString());
  if (!isNaN(newAmount)) {
    tempPaycheckAmount.value = newAmount;
  }
};

const startEditingPaycheck = () => {
  isEditingPaycheck.value = true;
};

const savePaycheckAmount = () => {
  emit("update:paycheckAmount", tempPaycheckAmount.value);
  isEditingPaycheck.value = false;
};

const cancelEditingPaycheck = () => {
  tempPaycheckAmount.value = props.payPeriod.paycheckAmount;
  isEditingPaycheck.value = false;
};
</script>

<template>
  <div class="px-4 py-5 sm:px-6">
    <div
      class="flex items-center justify-between border-b border-gray-200 pb-3"
    >
      <div>
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-medium text-brand-text">
            {{ formatDate(payPeriod.startDate) }} -
            {{ formatDate(payPeriod.endDate) }}
          </h3>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="status.badge"
          >
            {{ status.label }}
          </span>
        </div>
      </div>
      <div class="text-right">
        <div class="flex items-center justify-end gap-2">
          <span class="text-sm text-brand-muted">Progress:</span>
          <span class="text-sm font-semibold text-brand-text">
            {{ formatCurrency(payPeriod.paidAmount) }} /
            {{ formatCurrency(payPeriod.totalAmount) }}
          </span>
        </div>
        <div class="w-48 h-1.5 mt-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-brand-success transition-all duration-300 rounded-full"
            :style="{
              width: `${(payPeriod.paidAmount / payPeriod.totalAmount) * 100}%`,
            }"
          ></div>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <div class="bg-brand-primary/10 rounded-lg">
        <div class="flex justify-between items-start text-sm">
          <div>
            <div class="flex flex-col">
              <span class="text-brand-muted text-xs mb-1">Paycheck</span>
              <div class="relative inline-block">
                <div
                  v-if="!isEditingPaycheck"
                  class="cursor-pointer hover:text-brand-primary transition-colors text-2xl font-bold"
                  @click="startEditingPaycheck"
                >
                  {{ formatCurrency(payPeriod.paycheckAmount) }}
                </div>
                <div v-else class="flex items-center gap-2">
                  <BaseInput
                    v-model="tempPaycheckAmount"
                    name="paycheck-amount"
                    type="number"
                    class="w-32 text-2xl font-bold"
                    size="sm"
                    prefix="$"
                    @blur="savePaycheckAmount"
                    @keyup.enter="savePaycheckAmount"
                    @keyup.esc="cancelEditingPaycheck"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-right space-y-2">
            <div>
              <span class="text-brand-muted">Total Outgoing:</span>
              <span class="ml-2 font-normal text-brand-primary">
                {{
                  formatCurrency(
                    payPeriod.totalAmount + (payPeriod.totalExpenses || 0)
                  )
                }}
              </span>
            </div>
            <div class="flex items-center justify-end gap-2">
              <span class="text-brand-muted">Remaining:</span>
              <span
                class="font-semibold"
                :class="
                  payPeriod.paycheckAmount -
                    (payPeriod.totalAmount + (payPeriod.totalExpenses || 0)) >=
                  0
                    ? 'text-brand-success'
                    : 'text-brand-danger'
                "
              >
                {{
                  formatCurrency(
                    payPeriod.paycheckAmount -
                      (payPeriod.totalAmount + (payPeriod.totalExpenses || 0))
                  )
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
