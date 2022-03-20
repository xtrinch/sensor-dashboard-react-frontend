import { SensorContext } from "context/SensorContext";
import { addToast } from "context/ToastContext";
import { makeAutoObservable } from "mobx";
import React, { createContext, useContext } from "react";
import UserService from "services/UserService";
import { Toast } from "types/Toast";
import User from "types/User";

const AccountContext = createContext<AccountStore>(null);

class AccountStore {
  public user: User = localStorage.getItem("user")
    ? new User(JSON.parse(localStorage.getItem("user")))
    : null;

  public loginState = localStorage.getItem("user") ? "LOGGED_IN" : "LOGGED_OUT";

  constructor(public sensorContext: any) {
    makeAutoObservable(this);
  }

  public setStateWithSideEffects = (newState: any) => {
    // save to local storage
    if (newState.loginState) {
      this.loginState = newState.loginState;
      if (newState.loginState === "LOGGED_OUT") {
        localStorage.removeItem("user");
      }
    }
    if (newState.user) {
      localStorage.setItem("user", JSON.stringify(newState.user));
    }
    this.user = newState.user;
  };

  public login = async (email: string, password: string): Promise<User> => {
    try {
      const { user } = await UserService.login(email, password);
      if (user) {
        this.setStateWithSideEffects({
          user: user,
          loginState: "LOGGED_IN",
        });

        return user;
      }
    } catch (e) {
      this.setStateWithSideEffects({ loginState: "LOGIN_ERROR" });
      throw e;
    }

    return null;
  };

  public getMyData = async (): Promise<User> => {
    try {
      const user = await UserService.getMe();
      this.setStateWithSideEffects({
        user,
        loginState: "LOGGED_IN",
      });

      return user;
    } catch (e) {
      this.setStateWithSideEffects({ loginState: "LOGIN_ERROR" });
      throw e;
    }
  };

  public register = async (user: Partial<User>) => {
    return UserService.register(user);
  };

  public logout = async (): Promise<void> => {
    await UserService.logout();

    this.setStateWithSideEffects({
      loginState: "LOGGED_OUT",
      user: undefined,
    });

    if (this.sensorContext.clearMySensors) {
      this.sensorContext.clearMySensors();
    }

    addToast(new Toast({ message: "Logout successful", type: "success" }));
  };
}

function AccountContextProvider(props) {
  const sensorContext = useContext(SensorContext);

  return (
    <AccountContext.Provider value={new AccountStore(sensorContext)}>
      {props.children}
    </AccountContext.Provider>
  );
}

export { AccountContext, AccountContextProvider };
