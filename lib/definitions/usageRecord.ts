export const getCostForUsage = (costPerUnit: number, usage: number) => {
  return costPerUnit ? costPerUnit * usage : 0;
};

export function getUsageForCost(costPerUnit: number, cost: number) {
  return costPerUnit ? cost / costPerUnit : 0;
}
