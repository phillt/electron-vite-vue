import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../components/templates/MainLayout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "welcome",
      component: () => import("../views/Welcome.vue"),
    },
    {
      path: "/create-budget",
      name: "create-budget",
      component: () => import("../views/CreateBudget.vue"),
    },
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "budget",
          name: "budget",
          component: () => import("../views/Budget.vue"),
        },
        {
          path: "income-expenses",
          name: "income-expenses",
          component: () => import("../views/IncomeExpenses.vue"),
        },
        {
          path: "settings",
          name: "settings",
          component: () => import("../views/Settings.vue"),
        },
      ],
    },
    {
      path: "/add-income",
      name: "add-income",
      component: () => import("../views/AddIncome.vue"),
    },
    {
      path: "/add-bill",
      name: "add-bill",
      component: () => import("../views/AddBill.vue"),
    },
    {
      path: "/add-expense",
      name: "add-expense",
      component: () => import("../views/AddExpense.vue"),
    },
  ],
});

export default router;
