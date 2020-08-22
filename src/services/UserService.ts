import User from "types/User";
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

  public static register = async (user: User) => {
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
}
