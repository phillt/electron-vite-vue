<!-- Sidebar.vue -->
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import NavItem from "../molecules/NavItem.vue";
const router = useRouter();
const route = useRoute();

const navigation = [
  {
    name: "Budget",
    path: "/budget",
  },
  {
    name: "Income & Bills",
    path: "/income-expenses",
  },
];
</script>

<template>
  <nav class="bg-white h-full w-48 p-4 border-r border-gray-300 flex flex-col">
    <div class="flex-grow">
      <NavItem
        v-for="item in navigation"
        :key="item.name"
        v-bind="item"
        :is-active="route.path === item.path"
        @click="router.push(item.path)"
      />
    </div>
    <button
      class="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors"
      :class="[
        route.path === '/settings'
          ? 'bg-black text-white'
          : 'text-brand-muted hover:bg-brand-background hover:text-brand-text',
        'text-left',
      ]"
      @click="router.push('/settings')"
    >
      Settings
    </button>
    <button
      class="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors text-brand-muted hover:bg-brand-background hover:text-brand-text text-left"
      @click="router.push('/')"
    >
      Open/Create
    </button>
    <button
      class="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors text-brand-muted hover:bg-brand-background hover:text-brand-text text-left"
      @click="router.push('/')"
    >
      Quit
    </button>
  </nav>
</template>
