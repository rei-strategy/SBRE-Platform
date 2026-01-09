import { StoreSlice, CategorySlice } from './types';
import { serviceCategoryLibrary } from '../data/serviceCategoryLibrary';

export const createCategorySlice: StoreSlice<CategorySlice> = (set) => ({
  categoryLibrary: serviceCategoryLibrary,
  addCategory: (category) =>
    set((state) => ({
      categoryLibrary: [...state.categoryLibrary, category],
    })),
  updateCategory: (category) =>
    set((state) => ({
      categoryLibrary: state.categoryLibrary.map((existing) =>
        existing.id === category.id ? category : existing
      ),
    })),
  approveCategory: (categoryId, reviewerId) =>
    set((state) => ({
      categoryLibrary: state.categoryLibrary.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              status: 'APPROVED',
              reviewedBy: reviewerId,
              reviewedAt: new Date().toISOString(),
            }
          : category
      ),
    })),
  rejectCategory: (categoryId, reviewerId) =>
    set((state) => ({
      categoryLibrary: state.categoryLibrary.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              status: 'REJECTED',
              reviewedBy: reviewerId,
              reviewedAt: new Date().toISOString(),
            }
          : category
      ),
    })),
});
