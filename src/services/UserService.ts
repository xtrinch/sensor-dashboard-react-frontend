import User, { UserId } from "types/User";
import { getHeaders, getUrl, processResponse } from "utils/http";

export default class UserService {
  public static login = async (email, password) => {
    const url = getUrl("/auth/login");

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
      body: JSON.stringify({ username: email, password }),
    });

    const result = await processResponse(resp);

    return {
      accessToken: result.accessToken,
      user: new User(result.user),
    };
  };

  public static loginWithGoogle = async (idToken: string) => {
    const url = getUrl("/auth/google-login");

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        ...getHeaders({ contentType: "application/json" }),
        Authorization: idToken,
      },
    });

    const result = await processResponse(resp);

    return {
      accessToken: result.accessToken,
      user: new User(result.user),
    };
  };

  public static register = async (user: Partial<User>) => {
    const url = getUrl("/auth/register");

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
      body: JSON.stringify(user),
    });

    const result = await processResponse(resp);

    return new User(result);
  };

  public static listUsers = async () => {
    const url = getUrl("/users");

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    const users: User[] = [];
    for (const item of result.items) {
      users.push(new User(item));
    }

    return {
      meta: result.meta,
      items: users,
    };
  };

  public static updateUser = async (
    id: UserId,
    user: Partial<User>
  ): Promise<User> => {
    const url = getUrl(`/users/${id}`);

    const resp = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
      body: JSON.stringify(user),
    });

    const result = await processResponse(resp);
    const s = new User(result);
    return s;
  };

  public static deleteUser = async (
    id: UserId
  ): Promise<{ success: string }> => {
    const url = getUrl(`/users/${id}`);

    const resp = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    return result;
  };
}
