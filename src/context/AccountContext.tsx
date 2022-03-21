import { SensorContext } from 'context/SensorContext';
import { addToast } from 'context/ToastContext';
import { makeAutoObservable } from 'mobx';
import React, { createContext, useContext } from 'react';
import UserService from 'services/UserService';
import { Toast } from 'types/Toast';
import User from 'types/User';

export const AccountContext = createContext<AccountStore>(null);

export class AccountStore {
  public user: User = localStorage.getItem('user')
    ? new User(JSON.parse(localStorage.getItem('user')))
    : null;

  public loginState = localStorage.getItem('user') ? 'LOGGED_IN' : 'LOGGED_OUT';

  constructor(public sensorContext: any) {
    makeAutoObservable(this);
  }

  private setUser = (user: User) => {
    this.user = user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  private setLoginState = (loginState: 'LOGGED_IN' | 'LOGGED_OUT' | 'LOGIN_ERROR') => {
    this.loginState = loginState;
    if (loginState === 'LOGGED_OUT') {
      localStorage.removeItem('user');
    }
  };

  public login = async (email: string, password: string): Promise<User> => {
    try {
      const { user } = await UserService.login(email, password);
      if (user) {
        this.setUser(user);
        this.setLoginState('LOGGED_IN');

        return user;
      }
    } catch (e) {
      this.setLoginState('LOGIN_ERROR');
      throw e;
    }

    return null;
  };

  public getMyData = async (): Promise<User> => {
    try {
      const user = await UserService.getMe();
      this.setUser(user);
      this.setLoginState('LOGGED_IN');

      return user;
    } catch (e) {
      this.setLoginState('LOGIN_ERROR');
      throw e;
    }
  };

  public register = async (user: Partial<User>) => UserService.register(user);

  public logout = async (): Promise<void> => {
    await UserService.logout();

    this.setLoginState('LOGGED_OUT');
    this.setUser(undefined);

    if (this.sensorContext.clearMySensors) {
      this.sensorContext.clearMySensors();
    }

    addToast(new Toast({ message: 'Logout successful', type: 'success' }));
  };
}

export function AccountContextProvider(props) {
  const sensorContext = useContext(SensorContext);

  return (
    <AccountContext.Provider value={new AccountStore(sensorContext)}>
      {props.children}
    </AccountContext.Provider>
  );
}
