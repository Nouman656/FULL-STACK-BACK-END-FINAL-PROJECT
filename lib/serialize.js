export function serializeBudget(budget) {
  return {
    id: budget.id,
    name: budget.name,
    amount: Number(budget.amount),
    color: budget.color,
    userId: budget.userId,
    createdAt: budget.createdAt.getTime(),
  };
}

export function serializeExpense(expense, budget) {
  return {
    id: expense.id,
    name: expense.name,
    amount: Number(expense.amount),
    budgetId: expense.budgetId,
    createdAt: expense.createdAt.getTime(),
    budget: budget
      ? {
          id: budget.id,
          name: budget.name,
          color: budget.color,
        }
      : undefined,
  };
}
