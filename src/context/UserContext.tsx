import { addToast } from "context/ToastContext";
import React, { createContext, useEffect, useReducer } from "react";
import UserService from "services/UserService";
import { Toast } from "types/Toast";
import User, { UserId } from "types/User";

type UserContextState = {
  usersLoaded: boolean;
  users: User[];
};

export type UserActionTypes =
  | { type: "userReady"; payload: User[] }
  | { type: "updateUser"; payload: User }
  | { type: "addUser"; payload: User }
  | { type: "deleteUser"; payload: UserId };

const UserContext = createContext<{
  state?: UserContextState;
  dispatch?: React.Dispatch<any>;
  updateUser?: (id: UserId, user: User) => Promise<User>;
  deleteUser?: (id: UserId) => Promise<boolean>;
}>({});

function UserContextProvider(props) {
  const reducer = (
    state: UserContextState,
    action: UserActionTypes
  ): UserContextState => {
    switch (action.type) {
      case "userReady":
        return { ...state, users: action.payload, usersLoaded: true };
      case "updateUser":
        const users = state.users;
        const userIndex = users.findIndex((s) => s.id === action.payload.id);
        users[userIndex] = action.payload;
        return { ...state, users: [...users] };
      case "addUser":
        return { ...state, users: [...state.users, action.payload] };
      case "deleteUser":
        const idx = state.users.findIndex((s) => s.id === action.payload);
        state.users.splice(idx, 1);
        return { ...state };
      default: {
        return { ...state, users: [] };
      }
    }
  };

  let [state, dispatch] = useReducer(reducer, {
    users: [],
    usersLoaded: false,
  });

  const reload = async () => {
    const resp = await UserService.listUsers();
    const userData = resp.items;

    dispatch({
      type: "userReady",
      payload: userData,
    });
  };

  const updateUser = async (id: UserId, user: Partial<User>): Promise<User> => {
    const s = await UserService.updateUser(id, user);

    dispatch({
      type: "updateUser",
      payload: s,
    });

    addToast(
      new Toast({ message: "Successfully updated the user", type: "success" })
    );

    return s;
  };

  const deleteUser = async (id: UserId): Promise<boolean> => {
    await UserService.deleteUser(id);

    dispatch({
      type: "deleteUser",
      payload: id,
    });

    addToast(
      new Toast({ message: "Successfully deleted the user", type: "success" })
    );

    return true;
  };

  useEffect(() => {
    if (!state.usersLoaded) {
      reload();
    }
  }, [state]); // The empty array causes this effect to only run on mount

  return (
    <UserContext.Provider value={{ state, dispatch, updateUser, deleteUser }}>
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContext, UserContextProvider };
