import { addToast } from "context/ToastContext";
import React, { createContext, useEffect, useState } from "react";
import CategoryService from "services/CategoryService";
import Category, { CategoryId } from "types/Category";
import { Toast } from "types/Toast";

const CategoryContext = createContext<{
  state?: {
    categoriesLoaded: boolean;
    categories: Category[];
  };
  updateCategory?: (id: CategoryId, category: Category) => Promise<Category>;
  addCategory?: (category: Category) => Promise<Category>;
  deleteCategory?: (id: CategoryId) => Promise<boolean>;
}>({});

function CategoryContextProvider(props) {
  let [state, setState] = useState({
    categories: [],
    categoriesLoaded: false,
  });

  const reload = async () => {
    const resp = await CategoryService.listCategories();
    const categoryData = resp.items;

    setState({ ...state, categories: categoryData, categoriesLoaded: true });
  };

  const updateCategory = async (
    id: CategoryId,
    category: Partial<Category>
  ): Promise<Category> => {
    const s = await CategoryService.updateCategory(id, category);

    const categories = state.categories;
    const categoryIndex = categories.findIndex((s) => s.id === id);
    categories[categoryIndex] = s;
    setState({ ...state, categories: [...categories] });

    addToast(
      new Toast({
        message: "Successfully updated the category",
        type: "success",
      })
    );

    return s;
  };

  const deleteCategory = async (id: CategoryId): Promise<boolean> => {
    await CategoryService.deleteCategory(id);

    const idx = state.categories.findIndex((s) => s.id === id);
    state.categories.splice(idx, 1);
    setState({ ...state });

    addToast(
      new Toast({
        message: "Successfully deleted the category",
        type: "success",
      })
    );

    return true;
  };

  const addCategory = async (
    category: Partial<Category>
  ): Promise<Category> => {
    const s = await CategoryService.addCategory(category);
    setState({ ...state, categories: [...state.categories, s] });

    addToast(
      new Toast({ message: "Successfully added a category", type: "success" })
    );

    return s;
  };

  useEffect(() => {
    if (!state.categoriesLoaded) {
      reload();
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CategoryContext.Provider
      value={{ state, updateCategory, deleteCategory, addCategory }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
}

export { CategoryContext, CategoryContextProvider };
