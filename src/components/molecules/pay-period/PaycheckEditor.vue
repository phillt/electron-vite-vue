<!-- PaycheckEditor.vue -->
<script setup lang="ts">
import BaseInput from "../../atoms/BaseInput.vue";
import { ref } from "vue";

const props = defineProps<{
  amount: number;
}>();

const emit = defineEmits<{
  (e: "update:amount", value: number): void;
}>();

const isEditing = ref(false);
const tempAmount = ref(props.amount);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const handleAmountChange = (value: string | number) => {
  const newAmount = parseFloat(value.toString());
  if (!isNaN(newAmount)) {
    tempAmount.value = newAmount;
  }
};

const startEditing = () => {
  isEditing.value = true;
};

const saveAmount = () => {
  emit("update:amount", tempAmount.value);
  isEditing.value = false;
};

const cancelEditing = () => {
  tempAmount.value = props.amount;
  isEditing.value = false;
};
</script>

<template>
  <div class="flex flex-col">
    <span class="text-brand-muted text-xs mb-1">Paycheck</span>
    <div class="relative inline-block">
      <div
        v-if="!isEditing"
        class="cursor-pointer hover:text-brand-primary transition-colors text-2xl font-bold"
        @click="startEditing"
      >
        {{ formatCurrency(amount) }}
      </div>
      <div v-else class="flex items-center gap-2">
        <BaseInput
          v-model="tempAmount"
          name="paycheck-amount"
          type="number"
          class="w-32 text-2xl font-bold"
          size="sm"
          prefix="$"
          @blur="saveAmount"
          @keyup.enter="saveAmount"
          @keyup.esc="cancelEditing"
        />
      </div>
    </div>
  </div>
</template>
