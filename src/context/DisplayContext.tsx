import { AccountContext, AccountContextState } from "context/AccountContext";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import DisplayService from "services/DisplayService";
import Display, { DisplayId } from "types/Display";

export const reload = async (
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

export const addDisplay = async (
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

export const updateDisplay = async (
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

export const deleteDisplay = async (
  dispatch: React.Dispatch<any>,
  id: DisplayId
): Promise<boolean> => {
  await DisplayService.deleteDisplay(id);

  dispatch({
    type: "deleteDisplay",
    payload: id,
  });

  return true;
};

type DisplayContextState = {
  displaysLoaded: boolean;
  displays: Display[];
};

const initialState: DisplayContextState = {
  displays: [],
  displaysLoaded: false,
};

export type DisplayActionTypes =
  | { type: "displayReady"; payload: Display[] }
  | { type: "updateDisplay"; payload: Display }
  | { type: "addDisplay"; payload: Display }
  | { type: "deleteDisplay"; payload: DisplayId };

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
    case "deleteDisplay":
      const idx = state.displays.findIndex((s) => s.id === action.payload);
      state.displays.splice(idx, 1);
      return { ...state };
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
      reload(dispatch, accountContext);
    }
  }, [state, accountContext]); // The empty array causes this effect to only run on mount

  return (
    <DisplayContext.Provider value={[state, dispatch]}>
      {props.children}
    </DisplayContext.Provider>
  );
}

export { DisplayContext, DisplayContextProvider };
