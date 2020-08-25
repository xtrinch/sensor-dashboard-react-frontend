import React, { createContext, useReducer } from "react";

const openModal = (
  dispatch: React.Dispatch<any>,
  onConfirm: Function,
  onClose?: Function,
  content?: string
) => {
  dispatch({
    type: "openModal",
    payload: {
      onConfirm,
      onClose,
      content,
    },
  });
};

const closeModal = (dispatch: React.Dispatch<any>) => {
  dispatch({
    type: "closeModal",
  });
};

const containerConfirm = async (
  dispatch: React.Dispatch<any>,
  state: ConfirmationContextState
) => {
  dispatch({
    type: "closing",
  });

  if (state.onConfirm) {
    await state.onConfirm();
  }

  dispatch({
    type: "closeModal",
  });
};

const containerClose = async (
  dispatch: React.Dispatch<any>,
  state: ConfirmationContextState
) => {
  dispatch({
    type: "closing",
  });

  if (state.onClose) {
    await state.onClose();
  }

  dispatch({
    type: "closeModal",
  });
};

type ConfirmationContextState = {
  openModal: (
    dispatch: React.Dispatch<any>,
    onConfirm: Function,
    onClose?: Function,
    content?: string
  ) => void;
  closeModal: (dispatch: React.Dispatch<any>) => void;
  containerConfirm: (
    dispatch: React.Dispatch<any>,
    state: ConfirmationContextState
  ) => void;
  containerClose: (
    dispatch: React.Dispatch<any>,
    state: ConfirmationContextState
  ) => void;

  onConfirm: Function;
  onClose: Function;
  loading: boolean;
  content: string;
  open: boolean;
};

const initialState: ConfirmationContextState = {
  openModal,
  closeModal,
  containerConfirm,
  containerClose,

  onConfirm: null,
  onClose: null,
  loading: false,
  content: "",
  open: false,
};

interface OpenModalAction {
  type: "openModal";
  payload: {
    onConfirm: Function;
    onClose?: Function;
    content?: string;
  };
}

interface CloseModalAction {
  type: "closeModal";
}

interface ClosingModalAction {
  type: "closing";
}

export type ConfirmationActionTypes =
  | OpenModalAction
  | CloseModalAction
  | ClosingModalAction;

const ConfirmationContext = createContext<
  [ConfirmationContextState, React.Dispatch<any>]
>(null);

let reducer = (
  state: ConfirmationContextState,
  action: ConfirmationActionTypes
): ConfirmationContextState => {
  switch (action.type) {
    case "openModal":
      return {
        ...state,
        ...action.payload,
        open: true,
      };
    case "closeModal":
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
