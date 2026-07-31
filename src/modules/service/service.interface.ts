export type TCreateService = {
  categoryId: string;
  title: string;
  description?: string;
  price: number;
};

export type TUpdateService = {
  categoryId?: string;
  title?: string;
  description?: string;
  price?: number;
};

export type TServiceFilters = {
  categoryId?: string;
  location?: string;
  minRating?: number;
};
