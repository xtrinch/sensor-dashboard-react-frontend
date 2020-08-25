import React, { createContext, useReducer } from "react";
import { DateRange, DateRangeEnum, DateRegex } from "utils/date.range";

type AppContextState = {
  menuOpen: boolean;
  groupBy: DateRangeEnum;
  date: DateRegex;
};

const initialState: AppContextState = {
  menuOpen: false,
  groupBy: DateRangeEnum.day,
  date: DateRange.getDateString(new Date(), DateRangeEnum.day),
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
