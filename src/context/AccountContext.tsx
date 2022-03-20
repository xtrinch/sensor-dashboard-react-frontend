import { SensorContext } from "context/SensorContext";
import { addToast } from "context/ToastContext";
import React, { createContext, useContext, useState } from "react";
import UserService from "services/UserService";
import { Toast } from "types/Toast";
import User from "types/User";

const AccountContext = createContext<{
  user?: User;
  loginState?: "LOGGED_OUT" | "LOGGED_IN" | "LOGIN_ERROR" | string;
  login?: (email: string, password: string) => Promise<User>;
  loginWithGoogle?: (idToken: string) => Promise<User>;
  register?: (user: Partial<User>) => Promise<User>;
  logout?: () => Promise<void>;
  getMyData?: () => Promise<User>;
}>({});

function AccountContextProvider(props) {
  const { clearMySensors } = useContext(SensorContext);

  let [user, setUser] = useState(() =>
    localStorage.getItem("user")
      ? new User(JSON.parse(localStorage.getItem("user")))
      : null
  );

  let [loginState, setLoginState] = useState(() =>
    localStorage.getItem("user") ? "LOGGED_IN" : "LOGGED_OUT"
  );

  const setStateWithSideEffects = (newState: any) => {
    // save to local storage
    if (newState.loginState) {
      setLoginState(newState.loginState);
      if (newState.loginState === "LOGGED_OUT") {
        localStorage.removeItem("user");
      }
    }
    if (newState.user) {
      localStorage.setItem("user", JSON.stringify(newState.user));
    }
    setUser(newState.user);
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { user } = await UserService.login(email, password);
      if (user) {
        setStateWithSideEffects({
          user: user,
          loginState: "LOGGED_IN",
        });

        return user;
      }
    } catch (e) {
      setStateWithSideEffects({ loginState: "LOGIN_ERROR" });
      throw e;
    }

    return null;
  };

  const getMyData = async (): Promise<User> => {
    try {
      const user = await UserService.getMe();
      setStateWithSideEffects({
        user,
        loginState: "LOGGED_IN",
      });

      return user;
    } catch (e) {
      setStateWithSideEffects({ loginState: "LOGIN_ERROR" });
      throw e;
    }
  };

  const register = async (user: Partial<User>) => {
    return await UserService.register(user);
  };

  const logout = async (): Promise<void> => {
    await UserService.logout();

    setStateWithSideEffects({
      loginState: "LOGGED_OUT",
      user: undefined,
    });

    if (clearMySensors) {
      clearMySensors();
    }

    addToast(new Toast({ message: "Logout successful", type: "success" }));
  };

  return (
    <AccountContext.Provider
      value={{ user, loginState, login, logout, register, getMyData }}
    >
      {props.children}
    </AccountContext.Provider>
  );
}

export { AccountContext, AccountContextProvider };
