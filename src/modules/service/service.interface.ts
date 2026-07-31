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
  type?: string; // category name, e.g. "Plumbing"
  location?: string;
  minRating?: number;
};
