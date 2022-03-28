import { makeAutoObservable } from 'mobx';
import React, { createContext, useMemo } from 'react';

export interface Error {
  statusCode?: string;
  message: string;
}

export class ErrorStore {
  error: Error = null;

  constructor() {
    makeAutoObservable(this);
  }

  setError = (error: Error) => {
    this.error = error;
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
