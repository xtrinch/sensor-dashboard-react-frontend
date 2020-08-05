import React, { useReducer, createContext, useEffect } from "react";
import SensorService from "services/SensorService";
import Sensor from "types/Sensor";

type InitialStateType = {
  sensorsLoaded: boolean;
  sensors: Sensor[];
  reload: (dispatch: React.Dispatch<any>) => {};
};

const initialState: InitialStateType = {
  sensors: [],
  sensorsLoaded: false,
  reload: async (dispatch: React.Dispatch<any>) => {
    const sensorData = await reloadSensors();
    dispatch({
      type: "sensorReady",
      payload: sensorData,
    });
  },
};

const SensorContext = createContext<[InitialStateType, React.Dispatch<any>]>(
  null
);

let reducer = (state: InitialStateType, action): InitialStateType => {
  switch (action.type) {
    case "sensorReady":
      return { ...state, sensors: action.payload, sensorsLoaded: true };
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
    if (!state.sensorsLoaded) {
      state.reload(dispatch);
    }
  }, [state]); // The empty array causes this effect to only run on mount

  return (
    <SensorContext.Provider value={[state, dispatch]}>
      {props.children}
    </SensorContext.Provider>
  );
}

export { SensorContext, SensorContextProvider };
