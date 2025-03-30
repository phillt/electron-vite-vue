declare global {
  interface Window {
    electron: {
      dialog: {
        showOpenDialog: (options: any) => Promise<any>;
        showSaveDialog: (options: any) => Promise<any>;
      };
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
      };
    };
  }
}

export interface Item {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}

export interface Income {
  name: string;
  amount: number;
  frequency: "weekly" | "biweekly" | "monthly";
  originalAmount: number;
  nextPayday: string; // ISO date string
}

export interface Bill {
  name: string;
  dueDay: number; // 1-31
  amount: number;
}

export interface Budget {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  filePath?: string;
  items: Item[];
  incomes: Income[];
  bills: Bill[];
}

import { ref } from "vue";

class BudgetService {
  private static instance: BudgetService;
  private currentBudget = ref<Budget | null>(null);

  private constructor() {}

  static getInstance(): BudgetService {
    if (!BudgetService.instance) {
      BudgetService.instance = new BudgetService();
    }
    return BudgetService.instance;
  }

  async createBudget(
    budget: Omit<
      Budget,
      "createdAt" | "updatedAt" | "filePath" | "items" | "incomes" | "bills"
    >
  ): Promise<Budget> {
    try {
      const result = await window.electron.dialog.showSaveDialog({
        title: "Save Budget",
        defaultPath: `${budget.name}.bdgtmn`,
        filters: [
          { name: "Budget Manager Files", extensions: ["bdgtmn"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (result.canceled || !result.filePath) {
        throw new Error("Save operation cancelled");
      }

      const newBudget: Budget = {
        ...budget,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        filePath: result.filePath,
        items: [],
        incomes: [],
        bills: [],
      };

      // Save the budget to file
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: result.filePath,
        content: JSON.stringify(newBudget, null, 2),
      });

      this.currentBudget.value = newBudget;
      return newBudget;
    } catch (error) {
      console.error("Error saving budget:", error);
      throw error;
    }
  }

  async openBudget(): Promise<Budget | null> {
    try {
      const result = await window.electron.dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
          { name: "Budget Manager Files", extensions: ["bdgtmn"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const content = await window.electron.ipcRenderer.invoke(
          "file:read",
          filePath
        );
        const budget = JSON.parse(content) as Budget;
        // Ensure incomes and bills arrays exist for older budget files
        if (!budget.incomes) {
          budget.incomes = [];
        }
        if (!budget.bills) {
          budget.bills = [];
        }
        this.currentBudget.value = budget;
        return budget;
      }
      return null;
    } catch (error) {
      console.error("Error opening budget:", error);
      return null;
    }
  }

  async addItem(item: Omit<Item, "id" | "date">): Promise<Item> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    this.currentBudget.value.items.push(newItem);
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }

    return newItem;
  }

  async addIncome(income: Income): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    // Ensure incomes array exists
    if (!this.currentBudget.value.incomes) {
      this.currentBudget.value.incomes = [];
    }

    this.currentBudget.value.incomes.push(income);
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async deleteIncome(name: string): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const index = this.currentBudget.value.incomes.findIndex(
      (inc) => inc.name === name
    );
    if (index === -1) {
      throw new Error("Income not found");
    }

    this.currentBudget.value.incomes.splice(index, 1);
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async updateIncome(name: string, updatedIncome: Income): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const index = this.currentBudget.value.incomes.findIndex(
      (inc) => inc.name === name
    );
    if (index === -1) {
      throw new Error("Income not found");
    }

    this.currentBudget.value.incomes[index] = updatedIncome;
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async addBill(bill: Bill): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    // Ensure bills array exists
    if (!this.currentBudget.value.bills) {
      this.currentBudget.value.bills = [];
    }

    this.currentBudget.value.bills.push(bill);
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async deleteBill(name: string): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    // Ensure bills array exists
    if (!this.currentBudget.value.bills) {
      this.currentBudget.value.bills = [];
    }

    const index = this.currentBudget.value.bills.findIndex(
      (bill) => bill.name === name
    );
    if (index === -1) {
      throw new Error("Bill not found");
    }

    // Remove the bill
    this.currentBudget.value.bills = this.currentBudget.value.bills.filter(
      (bill) => bill.name !== name
    );
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  async updateBill(name: string, updatedBill: Bill): Promise<void> {
    if (!this.currentBudget.value) {
      throw new Error("No budget is currently open");
    }

    const index = this.currentBudget.value.bills.findIndex(
      (bill) => bill.name === name
    );
    if (index === -1) {
      throw new Error("Bill not found");
    }

    this.currentBudget.value.bills[index] = updatedBill;
    this.currentBudget.value.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.value.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.value.filePath,
        content: JSON.stringify(this.currentBudget.value, null, 2),
      });
    }
  }

  getCurrentBudget(): Budget | null {
    return this.currentBudget.value;
  }

  refreshCurrentBudget(): void {
    if (this.currentBudget.value) {
      this.currentBudget.value = { ...this.currentBudget.value };
    }
  }

  getItems(type?: "income" | "expense"): Item[] {
    if (!this.currentBudget.value) return [];
    if (!type) return this.currentBudget.value.items;
    return this.currentBudget.value.items.filter((item) => item.type === type);
  }

  getTotalIncome(): number {
    if (!this.currentBudget.value) return 0;
    return this.currentBudget.value.incomes.reduce(
      (sum, income) => sum + income.amount,
      0
    );
  }

  getTotalExpenses(): number {
    return this.getItems("expense").reduce((sum, item) => sum + item.amount, 0);
  }

  getBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }
}

export const budgetService = BudgetService.getInstance();
