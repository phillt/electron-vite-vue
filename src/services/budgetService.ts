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

export interface Budget {
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  filePath?: string;
  items: Item[];
  incomes: Income[];
}

class BudgetService {
  private static instance: BudgetService;
  private currentBudget: Budget | null = null;

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
      "createdAt" | "updatedAt" | "filePath" | "items" | "incomes"
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
      };

      // Save the budget to file
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: result.filePath,
        content: JSON.stringify(newBudget, null, 2),
      });

      this.currentBudget = newBudget;
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
        // Ensure incomes array exists for older budget files
        if (!budget.incomes) {
          budget.incomes = [];
        }
        this.currentBudget = budget;
        return budget;
      }
      return null;
    } catch (error) {
      console.error("Error opening budget:", error);
      return null;
    }
  }

  async addItem(item: Omit<Item, "id" | "date">): Promise<Item> {
    if (!this.currentBudget) {
      throw new Error("No budget is currently open");
    }

    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    this.currentBudget.items.push(newItem);
    this.currentBudget.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.filePath,
        content: JSON.stringify(this.currentBudget, null, 2),
      });
    }

    return newItem;
  }

  async addIncome(income: Income): Promise<void> {
    if (!this.currentBudget) {
      throw new Error("No budget is currently open");
    }

    // Ensure incomes array exists
    if (!this.currentBudget.incomes) {
      this.currentBudget.incomes = [];
    }

    this.currentBudget.incomes.push(income);
    this.currentBudget.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.filePath,
        content: JSON.stringify(this.currentBudget, null, 2),
      });
    }
  }

  async deleteIncome(name: string): Promise<void> {
    if (!this.currentBudget) {
      throw new Error("No budget is currently open");
    }

    const index = this.currentBudget.incomes.findIndex(
      (inc) => inc.name === name
    );
    if (index === -1) {
      throw new Error("Income not found");
    }

    this.currentBudget.incomes.splice(index, 1);
    this.currentBudget.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.filePath,
        content: JSON.stringify(this.currentBudget, null, 2),
      });
    }
  }

  async updateIncome(name: string, updatedIncome: Income): Promise<void> {
    if (!this.currentBudget) {
      throw new Error("No budget is currently open");
    }

    const index = this.currentBudget.incomes.findIndex(
      (inc) => inc.name === name
    );
    if (index === -1) {
      throw new Error("Income not found");
    }

    this.currentBudget.incomes[index] = updatedIncome;
    this.currentBudget.updatedAt = new Date().toISOString();

    // Save the updated budget
    if (this.currentBudget.filePath) {
      await window.electron.ipcRenderer.invoke("file:save", {
        filePath: this.currentBudget.filePath,
        content: JSON.stringify(this.currentBudget, null, 2),
      });
    }
  }

  getCurrentBudget(): Budget | null {
    return this.currentBudget;
  }

  getItems(type?: "income" | "expense"): Item[] {
    if (!this.currentBudget) return [];
    if (!type) return this.currentBudget.items;
    return this.currentBudget.items.filter((item) => item.type === type);
  }

  getTotalIncome(): number {
    if (!this.currentBudget) return 0;
    return this.currentBudget.incomes.reduce(
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
