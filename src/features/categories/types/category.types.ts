export interface Category {
  id: number;
  categoryName?: string;
  description?: string;
  parentId: number | null;
  children: Category[];
}

export interface CreateCategoryPayload {
  categoryName?: string;
  description?: string;
  parentId?: number;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
