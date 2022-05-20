import { makeAutoObservable } from 'mobx';
import React, { createContext, useMemo } from 'react';

export interface Error {
  statusCode?: string;
  message: string;
}

export class ErrorStore {
  error: Error = null;

  type: 'error' | 'info';

  constructor() {
    makeAutoObservable(this);
  }

  setError = (error: Error, type?: 'error' | 'info') => {
    this.error = error;
    this.type = type || 'error';
  };

  clearError = () => {
    this.error = null;
  };
}

export const ErrorContext = createContext<ErrorStore>(null);

export function ErrorContextProvider(props) {
  const errorStore = useMemo(() => {
    return new ErrorStore();
  }, []);

  return <ErrorContext.Provider value={errorStore}>{props.children}</ErrorContext.Provider>;
}
