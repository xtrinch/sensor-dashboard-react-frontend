import { AccountContext } from "context/AccountContext";
import { addToast } from "context/ToastContext";
import React, { createContext, useContext, useEffect, useState } from "react";
import DisplayService from "services/DisplayService";
import Display, { DisplayId } from "types/Display";
import { Toast } from "types/Toast";

const DisplayContext = createContext<{
  state?: {
    displaysLoaded: boolean;
    displays: Display[];
  };
  updateDisplay?: (id: DisplayId, display: Display) => Promise<Display>;
  deleteDisplay?: (id: DisplayId) => Promise<boolean>;
  addDisplay?: (display: Partial<Display>) => Promise<Display>;
  reloadDisplays?: (loginState: string) => Promise<void>;
}>({});

function DisplayContextProvider(props) {
  let [state, setState] = useState({
    displays: [],
    displaysLoaded: false,
  });
  let {
    state: { loginState },
  } = useContext(AccountContext);

  const reloadDisplays = async (loginState: string) => {
    if (loginState === "LOGGED_OUT") {
      return;
    }

    const resp = await DisplayService.listDisplays();
    const displayData = resp.items;
    setState({ ...state, displays: displayData, displaysLoaded: true });
  };

  const addDisplay = async (display: Partial<Display>): Promise<Display> => {
    const s = await DisplayService.addDisplay(display);
    setState({ ...state, displays: [...state.displays, s] });

    addToast(
      new Toast({ message: "Successfully added a display", type: "success" })
    );

    return s;
  };

  const updateDisplay = async (
    id: DisplayId,
    display: Partial<Display>
  ): Promise<Display> => {
    const s = await DisplayService.updateDisplay(id, display);
    const displays = state.displays;
    const displayIndex = displays.findIndex((sd) => sd.id === s.id);
    displays[displayIndex] = s;
    setState({ ...state, displays: [...displays] });

    addToast(
      new Toast({
        message: "Successfully updated the display",
        type: "success",
      })
    );

    return s;
  };

  const deleteDisplay = async (id: DisplayId): Promise<boolean> => {
    await DisplayService.deleteDisplay(id);

    const idx = state.displays.findIndex((s) => s.id === id);
    state.displays.splice(idx, 1);
    setState({ ...state });

    addToast(
      new Toast({
        message: "Successfully deleted the display",
        type: "success",
      })
    );

    return true;
  };

  useEffect(() => {
    if (!state.displaysLoaded) {
      reloadDisplays(loginState);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DisplayContext.Provider
      value={{
        state,
        updateDisplay,
        deleteDisplay,
        addDisplay,
        reloadDisplays,
      }}
    >
      {props.children}
    </DisplayContext.Provider>
  );
}

export { DisplayContext, DisplayContextProvider };
