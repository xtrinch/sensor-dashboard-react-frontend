import { addToast } from "context/ToastContext";
import React, { createContext, useEffect, useState } from "react";
import UserService from "services/UserService";
import { Toast } from "types/Toast";
import User, { UserId } from "types/User";

type UserContextState = {
  usersLoaded: boolean;
  users: User[];
};

const UserContext = createContext<{
  state?: UserContextState;
  updateUser?: (id: UserId, user: User) => Promise<User>;
  deleteUser?: (id: UserId) => Promise<boolean>;
}>({});

function UserContextProvider(props) {
  let [state, setState] = useState({
    users: [],
    usersLoaded: false,
  });

  const reload = async () => {
    const resp = await UserService.listUsers();
    const userData = resp.items;

    setState({ ...state, users: userData, usersLoaded: true });
  };

  const updateUser = async (id: UserId, user: Partial<User>): Promise<User> => {
    const s = await UserService.updateUser(id, user);

    const users = state.users;
    const userIndex = users.findIndex((s) => s.id === id);
    users[userIndex] = s;
    setState({ ...state, users: [...users] });

    addToast(
      new Toast({ message: "Successfully updated the user", type: "success" })
    );

    return s;
  };

  const deleteUser = async (id: UserId): Promise<boolean> => {
    await UserService.deleteUser(id);

    const idx = state.users.findIndex((s) => s.id === id);
    state.users.splice(idx, 1);
    setState({ ...state });

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
    <UserContext.Provider value={{ state, updateUser, deleteUser }}>
      {props.children}
    </UserContext.Provider>
  );
}

export { UserContext, UserContextProvider };
