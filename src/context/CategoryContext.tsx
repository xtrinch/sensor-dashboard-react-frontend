import React, { createContext, useContext, useEffect, useState } from 'react';
import CategoryService from 'services/CategoryService';
import Category, { CategoryId } from 'types/Category';
import { Toast } from 'types/Toast';
import { ToastContext } from './ToastContext';

const CategoryContext = createContext<{
  state?: {
    categoriesLoaded: boolean;
    categories: Category[];
  };
  updateCategory?: (id: CategoryId, category: Category) => Promise<Category>;
  addCategory?: (category: Category) => Promise<Category>;
  deleteCategory?: (id: CategoryId) => Promise<boolean>;
  increaseInSequence?: (id: CategoryId) => Promise<Category>;
  decreaseInSequence?: (id: CategoryId) => Promise<Category>;
  reload?: () => Promise<void>;
}>({});

function CategoryContextProvider(props) {
  const [state, setState] = useState({
    categories: [],
    categoriesLoaded: false,
  });
  const toastStore = useContext(ToastContext);

  const reload = async (): Promise<void> => {
    const resp = await CategoryService.listCategories();
    const categoryData = resp.items;

    setState({ ...state, categories: categoryData, categoriesLoaded: true });
  };

  const updateCategory = async (id: CategoryId, category: Partial<Category>): Promise<Category> => {
    const s = await CategoryService.updateCategory(id, category);

    const { categories } = state;
    const categoryIndex = categories.findIndex((s) => s.id === id);
    categories[categoryIndex] = s;
    setState({ ...state, categories: [...categories] });

    toastStore.addToast(
      new Toast({
        message: 'Successfully updated the category',
        type: 'success',
      }),
    );

    return s;
  };

  const increaseInSequence = async (id: CategoryId): Promise<Category> => {
    const s = await CategoryService.increaseInSequence(id);

    reload();

    toastStore.addToast(
      new Toast({
        message: 'Successfully updated the category',
        type: 'success',
      }),
    );

    return s;
  };

  const decreaseInSequence = async (id: CategoryId): Promise<Category> => {
    const s = await CategoryService.decreaseInSequence(id);

    reload();

    toastStore.addToast(
      new Toast({
        message: 'Successfully updated the category',
        type: 'success',
      }),
    );

    return s;
  };

  const deleteCategory = async (id: CategoryId): Promise<boolean> => {
    await CategoryService.deleteCategory(id);

    const idx = state.categories.findIndex((s) => s.id === id);
    state.categories.splice(idx, 1);
    setState({ ...state });

    toastStore.addToast(
      new Toast({
        message: 'Successfully deleted the category',
        type: 'success',
      }),
    );

    return true;
  };

  const addCategory = async (category: Partial<Category>): Promise<Category> => {
    const s = await CategoryService.addCategory(category);
    setState({ ...state, categories: [...state.categories, s] });

    toastStore.addToast(new Toast({ message: 'Successfully added a category', type: 'success' }));

    return s;
  };

  useEffect(() => {
    if (!state.categoriesLoaded) {
      reload();
    }
  }, [state]);

  return (
    <CategoryContext.Provider
      value={{
        state,
        updateCategory,
        deleteCategory,
        addCategory,
        reload,
        increaseInSequence,
        decreaseInSequence,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
}

export { CategoryContext, CategoryContextProvider };
