import Category, { CategoryId } from "types/Category";
import { getHeaders, getUrl, processResponse } from "utils/http";

export default class CategoryService {
  public static listCategories = async () => {
    const url = getUrl("/categories");

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    const categories: Category[] = [];
    for (const item of result.items) {
      categories.push(new Category(item));
    }

    return {
      meta: result.meta,
      items: categories,
    };
  };

  public static addCategory = async (
    category: Partial<Category>
  ): Promise<Category> => {
    const url = getUrl("/categories");

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
      body: JSON.stringify(category),
    });

    const result = await processResponse(resp);
    const s = new Category(result);
    return s;
  };

  public static updateCategory = async (
    id: CategoryId,
    category: Partial<Category>
  ): Promise<Category> => {
    const url = getUrl(`/categories/${id}`);

    const resp = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
      body: JSON.stringify(category),
    });

    const result = await processResponse(resp);
    const s = new Category(result);
    return s;
  };

  public static deleteCategory = async (
    id: CategoryId
  ): Promise<{ success: string }> => {
    const url = getUrl(`/categories/${id}`);

    const resp = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    return result;
  };
}
