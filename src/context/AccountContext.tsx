import { SensorContext } from "context/SensorContext";
import { addToast } from "context/ToastContext";
import React, { createContext, useContext, useState } from "react";
import UserService from "services/UserService";
import { Toast } from "types/Toast";
import User from "types/User";

const AccountContext = createContext<{
  state?: {
    user: User;
    accessToken: string;
    loginState: "LOGGED_OUT" | "LOGGED_IN" | "LOGIN_ERROR" | string;
  };
  login?: (email: string, password: string) => Promise<User>;
  loginWithGoogle?: (idToken: string) => Promise<User>;
  register?: (user: Partial<User>) => Promise<User>;
  logout?: () => Promise<void>;
}>({});

function AccountContextProvider(props) {
  const { clearMySensors } = useContext(SensorContext);

  let [state, setState] = useState({
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    loginState: localStorage.getItem("user") ? "LOGGED_IN" : "LOGGED_OUT",
    accessToken: localStorage.getItem("accessToken"),
  });

  const setStateWithSideEffects = (newState: any) => {
    // save to local storage
    newState.user
      ? localStorage.setItem("user", JSON.stringify(newState.user))
      : localStorage.removeItem("user");
    newState.accessToken
      ? localStorage.setItem("accessToken", newState.accessToken)
      : localStorage.removeItem("accessToken");
    setState(newState);
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { accessToken, user } = await UserService.login(email, password);
      if (accessToken) {
        setStateWithSideEffects({
          ...state,
          loginState: "LOGGED_IN",
          user: user,
          accessToken: accessToken,
        });

        return user;
      }
    } catch (e) {
      setStateWithSideEffects({ ...state, loginState: "LOGIN_ERROR" });
      throw e;
    }

    return null;
  };

  const loginWithGoogle = async (idToken: string): Promise<User> => {
    try {
      const { accessToken, user } = await UserService.loginWithGoogle(idToken);
      if (accessToken) {
        setStateWithSideEffects({
          ...state,
          loginState: "LOGGED_IN",
          user: user,
          accessToken: accessToken,
        });

        return user;
      }
    } catch (e) {
      setStateWithSideEffects({ ...state, loginState: "LOGIN_ERROR" });
      throw e;
    }

    return null;
  };

  const register = async (user: Partial<User>) => {
    return await UserService.register(user);
  };

  const logout = async (): Promise<void> => {
    setStateWithSideEffects({
      ...state,
      loginState: "LOGGED_OUT",
      user: undefined,
      accessToken: undefined,
    });

    if (clearMySensors) {
      clearMySensors();
    }

    addToast(new Toast({ message: "Logout successful", type: "success" }));
  };

  return (
    <AccountContext.Provider
      value={{ state, login, logout, register, loginWithGoogle }}
    >
      {props.children}
    </AccountContext.Provider>
  );
}

export { AccountContext, AccountContextProvider };
