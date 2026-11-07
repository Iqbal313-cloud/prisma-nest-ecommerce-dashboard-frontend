export interface CategoryUser {
  name: string;
}

export interface Category {
  id: number;
  categoryName?: string;
  description?: string;
  parentId: number | null;
  children: Category[];
  createdAt: string;
  updatedAt: string;

  createdBy?: CategoryUser | null;
  updatedBy?: CategoryUser | null;
}

export interface CreateCategoryPayload {
  categoryName?: string;
  description?: string;
  parentId?: number | null;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
