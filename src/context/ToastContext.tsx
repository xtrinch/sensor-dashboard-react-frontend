import React, { createContext, useReducer } from "react";
import { Toast } from "types/Toast";

export const addToast = (dispatch: React.Dispatch<any>, toast: Toast) => {
  dispatch({ type: "addToast", payload: toast });

  setTimeout(() => {
    removeToast(dispatch, toast);
  }, 3000);
};

export const removeToast = (dispatch: React.Dispatch<any>, toast: Toast) => {
  dispatch({ type: "removeToast", payload: toast });
};

type ToastContextState = {
  toasts: Toast[];
};

const initialState: ToastContextState = {
  toasts: [],
};

export type ToastActionTypes =
  | { type: "addToast"; payload: Toast }
  | { type: "removeToast"; payload: Toast };

const ToastContext = createContext<[ToastContextState, React.Dispatch<any>]>(
  null
);

let reducer = (
  state: ToastContextState,
  action: ToastActionTypes
): ToastContextState => {
  switch (action.type) {
    case "addToast":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case "removeToast":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload.id),
      };
    default: {
      return { ...state };
    }
  }
};

function ToastContextProvider(props) {
  let [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ToastContext.Provider value={[state, dispatch]}>
      {props.children}
    </ToastContext.Provider>
  );
}

export { ToastContext, ToastContextProvider };
