import { makeAutoObservable } from 'mobx';
import React, { createContext, useMemo } from 'react';
import { Toast } from 'types/Toast';

export class ToastStore {
  public toasts: Toast[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  public removeToast = (id: string) => {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  };

  public addToast = (newToast: Toast) => {
    this.toasts.push(newToast);

    setTimeout(() => {
      this.removeToast(newToast.id);
    }, 5000);
  };
}

export const ToastContext = createContext<ToastStore>(null);

export function ToastContextProvider(props) {
  const toastStore = useMemo(() => new ToastStore(), []);

  return <ToastContext.Provider value={toastStore}>{props.children}</ToastContext.Provider>;
}
