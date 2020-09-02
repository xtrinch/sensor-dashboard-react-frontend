import React, { createContext, useReducer } from "react";

export const openConfirmation = (
  dispatch: React.Dispatch<any>,
  onConfirm: Function,
  onClose?: Function,
  content?: string
) => {
  dispatch({
    type: "openConfirmation",
    payload: {
      onConfirm,
      onClose,
      content,
    },
  });
};

export const closeConfirmation = (dispatch: React.Dispatch<any>) => {
  dispatch({ type: "closeConfirmation" });
};

export const confirm = async (
  dispatch: React.Dispatch<any>,
  state: ConfirmationContextState
) => {
  dispatch({ type: "closing" });

  if (state.onConfirm) {
    try {
      await state.onConfirm();
    } catch (e) {
      dispatch({ type: "closeConfirmation" });
      throw e;
    }
  }

  dispatch({ type: "closeConfirmation" });
};

export const close = async (
  dispatch: React.Dispatch<any>,
  state: ConfirmationContextState
) => {
  dispatch({ type: "closing" });

  if (state.onClose) {
    await state.onClose();
  }

  dispatch({ type: "closeConfirmation" });
};

type ConfirmationContextState = {
  onConfirm: Function;
  onClose: Function;
  loading: boolean;
  content: string;
  open: boolean;
};

const initialState: ConfirmationContextState = {
  onConfirm: null,
  onClose: null,
  loading: false,
  content: "",
  open: false,
};

export type ConfirmationActionTypes =
  | {
      type: "openConfirmation";
      payload: { onConfirm: Function; onClose?: Function; content?: string };
    }
  | { type: "closeConfirmation" }
  | { type: "closing" };

const ConfirmationContext = createContext<
  [ConfirmationContextState, React.Dispatch<any>]
>(null);

let reducer = (
  state: ConfirmationContextState,
  action: ConfirmationActionTypes
): ConfirmationContextState => {
  switch (action.type) {
    case "openConfirmation":
      return {
        ...state,
        ...action.payload,
        open: true,
      };
    case "closeConfirmation":
      return {
        ...state,
        onConfirm: undefined,
        onClose: undefined,
        loading: false,
        open: false,
      };
    case "closing":
      return {
        ...state,
        loading: true,
      };
    default: {
      return { ...state };
    }
  }
};

function ConfirmationContextProvider(props) {
  let [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ConfirmationContext.Provider value={[state, dispatch]}>
      {props.children}
    </ConfirmationContext.Provider>
  );
}

export { ConfirmationContext, ConfirmationContextProvider };
