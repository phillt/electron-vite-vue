<!-- PayPeriodHeader.vue -->
<script setup lang="ts">
import type { PayPeriod } from "../../services/budgetService";
import DateRangeBadge from "./pay-period/DateRangeBadge.vue";
import ProgressBar from "./pay-period/ProgressBar.vue";
import PaycheckEditor from "./pay-period/PaycheckEditor.vue";
import FinancialSummary from "./pay-period/FinancialSummary.vue";

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
</script>

<template>
  <div class="px-4 py-5 sm:px-6">
    <div
      class="flex items-center justify-between border-b border-gray-200 pb-3"
    >
      <DateRangeBadge
        :start-date="payPeriod.startDate"
        :end-date="payPeriod.endDate"
        :status="status"
      />
      <slot name="after-badge" />
      <ProgressBar
        :current-amount="payPeriod.paidAmount"
        :total-amount="payPeriod.totalAmount"
      />
    </div>
    <div class="mt-4">
      <div class="bg-brand-primary/10 rounded-lg">
        <div class="flex justify-between items-start text-sm">
          <PaycheckEditor
            :amount="payPeriod.paycheckAmount"
            @update:amount="emit('update:paycheckAmount', $event)"
          />
          <FinancialSummary
            :paycheck-amount="payPeriod.paycheckAmount"
            :total-amount="payPeriod.totalAmount"
            :total-expenses="payPeriod.totalExpenses"
          />
        </div>
      </div>
    </div>
  </div>
</template>
