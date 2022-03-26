import { makeAutoObservable } from 'mobx';
import React, { Context, createContext, Dispatch, useMemo, useReducer } from 'react';

export class ConfirmationStore {
  onConfirm: Function = null;

  onClose: Function = null;

  loading: boolean = false;

  content: string = '';

  open: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  public openConfirmation = (onConfirm: Function, onClose?: Function, content?: string) => {
    this.onConfirm = onConfirm;
    this.onClose = onClose;
    this.content = content;
    this.open = true;
  };

  public closeConfirmation = () => {
    this.onConfirm = undefined;
    this.onClose = undefined;
    this.loading = false;
    this.open = false;
  };

  public confirm = async () => {
    this.loading = true;

    if (this.onConfirm) {
      try {
        await this.onConfirm();
      } catch (e) {
        await this.closeConfirmation();
        throw e;
      }
    }

    await this.closeConfirmation();
  };

  public close = async () => {
    this.loading = true;

    if (this.onClose) {
      await this.onClose();
    }

    await this.closeConfirmation();
  };
}

const ConfirmationContext = createContext<ConfirmationStore>(null);

function ConfirmationContextProvider(props) {
  const confirmationStore = useMemo(() => new ConfirmationStore(), []);

  return (
    <ConfirmationContext.Provider value={confirmationStore}>
      {props.children}
    </ConfirmationContext.Provider>
  );
}

export { ConfirmationContext, ConfirmationContextProvider };
