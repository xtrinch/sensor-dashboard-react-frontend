import { AccountContext, AccountContextState } from "context/AccountContext";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import DisplayService from "services/DisplayService";
import Display, { DisplayId } from "types/Display";

const reload = async (
  dispatch: React.Dispatch<any>,
  accountContext: AccountContextState
) => {
  try {
    const resp = await DisplayService.listDisplays();
    const displayData = resp.items;

    dispatch({
      type: "displayReady",
      payload: displayData,
    });
  } catch (error) {
    console.log(error);
  }
};

const addDisplay = async (
  dispatch: React.Dispatch<any>,
  display: Partial<Display>
): Promise<Display> => {
  const s = await DisplayService.addDisplay(display);

  dispatch({
    type: "addDisplay",
    payload: s,
  });

  return s;
};

const updateDisplay = async (
  dispatch: React.Dispatch<any>,
  id: DisplayId,
  display: Partial<Display>
): Promise<Display> => {
  const s = await DisplayService.updateDisplay(id, display);

  dispatch({
    type: "updateDisplay",
    payload: s,
  });

  return s;
};

type DisplayContextState = {
  displaysLoaded: boolean;
  displays: Display[];

  reload: (
    dispatch: React.Dispatch<any>,
    accountContext: AccountContextState
  ) => {};
  addDisplay: (
    dispatch: React.Dispatch<any>,
    display: Partial<Display>
  ) => Promise<Display>;
  updateDisplay: (
    dispatch: React.Dispatch<any>,
    id: DisplayId,
    display: Partial<Display>
  ) => Promise<Display>;
};

const initialState: DisplayContextState = {
  displays: [],
  displaysLoaded: false,
  reload: reload,
  addDisplay: addDisplay,
  updateDisplay: updateDisplay,
};

interface DisplayAddAction {
  type: "addDisplay";
  payload: Display;
}

interface DisplayReadyAction {
  type: "displayReady";
  payload: Display[];
}

interface UpdateDisplayAction {
  type: "updateDisplay";
  payload: Display;
}

export type DisplayActionTypes =
  | DisplayReadyAction
  | UpdateDisplayAction
  | DisplayAddAction;

const DisplayContext = createContext<
  [DisplayContextState, React.Dispatch<any>]
>(null);

let reducer = (
  state: DisplayContextState,
  action: DisplayActionTypes
): DisplayContextState => {
  switch (action.type) {
    case "displayReady":
      return { ...state, displays: action.payload, displaysLoaded: true };
    case "updateDisplay":
      const displays = state.displays;
      const displayIndex = displays.findIndex(
        (s) => s.id === action.payload.id
      );
      displays[displayIndex] = action.payload;
      return { ...state, displays: [...displays] };
    case "addDisplay":
      return { ...state, displays: [...state.displays, action.payload] };
    default: {
      return { ...state, displays: [] };
    }
  }
};

function DisplayContextProvider(props) {
  let [state, dispatch] = useReducer(reducer, initialState);
  let [accountContext] = useContext(AccountContext);

  useEffect(() => {
    if (!state.displaysLoaded) {
      state.reload(dispatch, accountContext);
    }
  }, [state, accountContext]); // The empty array causes this effect to only run on mount

  return (
    <DisplayContext.Provider value={[state, dispatch]}>
      {props.children}
    </DisplayContext.Provider>
  );
}

export { DisplayContext, DisplayContextProvider };
