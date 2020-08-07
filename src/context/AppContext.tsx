import React, { createContext, useReducer } from "react";
import GroupMeasurementByEnum from "types/GroupMeasurementByEnum";
import { DateRegex } from "utils/date.range";

type AppContextState = {
  menuOpen: boolean;
  groupBy: GroupMeasurementByEnum;
  date: DateRegex;
};

const initialState: AppContextState = {
  menuOpen: false,
  groupBy: GroupMeasurementByEnum.day,
  date: null,
};

const AppContext = createContext<[AppContextState, React.Dispatch<any>]>(null);

let reducer = (state: AppContextState, action): AppContextState => {
  switch (action.type) {
    case "toggle":
      return { ...state, menuOpen: !state.menuOpen };
    case "setDate":
      return { ...state, date: action.payload };
    case "setGroupBy":
      return { ...state, groupBy: action.payload };
    default: {
      return state;
    }
  }
};

function AppContextProvider(props) {
  let [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {props.children}
    </AppContext.Provider>
  );
}

export { AppContext, AppContextProvider };
