export type UpdateGearPayload = {
  categoryId?: string;
  title?: string;
  brand?: string;
  description?: string;
  pricePerDay?: number;
  deposit?: number;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
  totalQuantity?: number;
};

