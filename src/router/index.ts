import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "welcome",
      component: () => import("../views/WelcomeScreen.vue"),
    },
    {
      path: "/create-budget",
      name: "create-budget",
      component: () => import("../views/CreateBudget.vue"),
    },
    {
      path: "/income-expenses",
      name: "income-expenses",
      component: () => import("../views/IncomeExpenses.vue"),
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
  ],
});

export default router;
