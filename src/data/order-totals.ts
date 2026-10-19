export interface OrderTotals {
  itemTotal: string;
  tax: string;
  total: string;
}

export const backpackOrderTotals: OrderTotals = {
  itemTotal: 'Item total: $29.99',
  tax: 'Tax: $2.40',
  total: 'Total: $32.39',
};
