import { makeAutoObservable } from 'mobx';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import CategoryService from 'services/CategoryService';
import Category, { CategoryId } from 'types/Category';
import { Toast } from 'types/Toast';
import { ToastContext, ToastStore } from './ToastContext';

export class CategoryStore {
  public categoriesLoaded: boolean = false;

  public categories: Category[] = [];

  constructor(public toastStore: ToastStore) {
    makeAutoObservable(this);
  }

  public updateCategory = async (
    id: CategoryId,
    category: Partial<Category>,
  ): Promise<Category> => {
    const s = await CategoryService.updateCategory(id, category);

    const categoryIndex = this.categories.findIndex((s) => s.id === id);
    this.categories[categoryIndex] = s;

    this.toastStore.addToast(
      new Toast({
        message: 'Successfully updated the category',
        type: 'success',
      }),
    );

    return s;
  };

  public reload = async (): Promise<void> => {
    const resp = await CategoryService.listCategories();
    const categoryData = resp.items;

    this.categories = categoryData;
    this.categoriesLoaded = true;
  };

  public increaseInSequence = async (id: CategoryId): Promise<Category> => {
    const s = await CategoryService.increaseInSequence(id);

    this.reload();

    this.toastStore.addToast(
      new Toast({
        message: 'Successfully updated the category',
        type: 'success',
      }),
    );

    return s;
  };

  public decreaseInSequence = async (id: CategoryId): Promise<Category> => {
    const s = await CategoryService.decreaseInSequence(id);

    this.reload();

    this.toastStore.addToast(
      new Toast({
        message: 'Successfully updated the category',
        type: 'success',
      }),
    );

    return s;
  };

  public deleteCategory = async (id: CategoryId): Promise<boolean> => {
    await CategoryService.deleteCategory(id);

    const idx = this.categories.findIndex((s) => s.id === id);
    this.categories.splice(idx, 1);

    this.toastStore.addToast(
      new Toast({
        message: 'Successfully deleted the category',
        type: 'success',
      }),
    );

    return true;
  };

  public addCategory = async (category: Partial<Category>): Promise<Category> => {
    const s = await CategoryService.addCategory(category);
    this.categories.push(s);

    this.toastStore.addToast(
      new Toast({ message: 'Successfully added a category', type: 'success' }),
    );

    return s;
  };
}

const CategoryContext = createContext<CategoryStore>(null);

function CategoryContextProvider(props) {
  const toastStore = useContext(ToastContext);
  const categoryStore = useMemo(() => new CategoryStore(toastStore), []);
  useEffect(() => {
    if (!categoryStore.categoriesLoaded) {
      categoryStore.reload();
    }
  }, []);

  return (
    <CategoryContext.Provider value={categoryStore}>{props.children}</CategoryContext.Provider>
  );
}

export { CategoryContext, CategoryContextProvider };
