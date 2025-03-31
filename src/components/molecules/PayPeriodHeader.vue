<!-- PayPeriodHeader.vue -->
<script setup lang="ts">
import type { PayPeriod } from "../../services/budgetService";
import BaseInput from "../atoms/BaseInput.vue";

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
    emit("update:paycheckAmount", newAmount);
  }
};
</script>

<template>
  <div class="px-4 py-5 sm:px-6">
    <div class="flex items-center justify-between">
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
    <div class="mt-4 grid grid-cols-4 gap-4 text-sm">
      <div class="col-span-4 bg-brand-primary/10 p-3 rounded-lg">
        <div class="font-medium text-brand-primary">Expected Income</div>
        <div class="mt-1 grid grid-cols-3 gap-4">
          <div>
            <span class="text-brand-primary">Paycheck:</span>
            <div class="relative inline-block ml-2">
              <BaseInput
                v-model="payPeriod.paycheckAmount"
                name="paycheck-amount"
                type="number"
                class="w-32"
                prefix="$"
                @update:modelValue="handlePaycheckAmountChange"
              />
            </div>
          </div>
          <div>
            <span class="text-brand-primary">Total Outgoing:</span>
            <span class="ml-2 font-medium text-brand-primary">{{
              formatCurrency(
                payPeriod.totalAmount + (payPeriod.totalExpenses || 0)
              )
            }}</span>
          </div>
          <div>
            <span class="text-brand-primary">Remaining:</span>
            <span
              class="ml-2 font-medium"
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
</template>
