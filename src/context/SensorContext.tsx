import React, { useReducer, createContext, useEffect } from "react";
import SensorService from "services/SensorService";
import Sensor from "types/Sensor";

type InitialStateType = {
  sensors: Sensor[];
  reload: (dispatch: React.Dispatch<any>) => {};
};

const initialState: InitialStateType = {
  sensors: [],
  reload: async (dispatch: React.Dispatch<any>) => {
    const sensorData = await reloadSensors();
    dispatch({
      type: "sensorReady",
      payload: sensorData,
    });
  },
};

const SensorContext = createContext<InitialStateType>(initialState);

let reducer = (state, action): InitialStateType => {
  switch (action.type) {
    case "sensorReady":
      return { ...state, sensors: action.payload };
    default: {
      return { ...state, sensors: [] };
    }
  }
};

const reloadSensors = async () => {
  try {
    const resp = await SensorService.listSensors();
    return resp.items;
  } catch (error) {
    console.log(error);
  }
};

function SensorContextProvider(props) {
  let [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    state.reload(dispatch);
  }, []); // The empty array causes this effect to only run on mount

  return (
    <SensorContext.Provider value={state}>
      {props.children}
    </SensorContext.Provider>
  );
}

export { SensorContext, SensorContextProvider };
