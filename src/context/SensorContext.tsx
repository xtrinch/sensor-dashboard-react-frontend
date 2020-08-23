import React, { createContext, useEffect, useReducer } from "react";
import SensorService from "services/SensorService";
import Sensor from "types/Sensor";

const addSensor = async (
  dispatch: React.Dispatch<any>,
  sensor: Partial<Sensor>
) => {
  await SensorService.addSensor(sensor);
};

type SensorContextState = {
  sensorsLoaded: boolean;
  sensors: Sensor[];
  reload: (dispatch: React.Dispatch<any>) => {};
  addSensor: (dispatch: React.Dispatch<any>, sensor: Partial<Sensor>) => {};
};

const initialState: SensorContextState = {
  sensors: [],
  sensorsLoaded: false,
  reload: async (dispatch: React.Dispatch<any>) => {
    const sensorData = await reloadSensors();
    dispatch({
      type: "sensorReady",
      payload: sensorData,
    });
  },
  addSensor: addSensor,
};

interface SensorReadyAction {
  type: "sensorReady";
  payload: Sensor[];
}

interface UpdateSensorAction {
  type: "updateSensor";
  payload: Sensor;
}

export type SensorActionTypes = SensorReadyAction | UpdateSensorAction;

const SensorContext = createContext<[SensorContextState, React.Dispatch<any>]>(
  null
);

let reducer = (
  state: SensorContextState,
  action: SensorActionTypes
): SensorContextState => {
  switch (action.type) {
    case "sensorReady":
      return { ...state, sensors: action.payload, sensorsLoaded: true };
    case "updateSensor":
      const sensors = state.sensors;
      const sensorIndex = sensors.findIndex((s) => s.id === action.payload.id);
      sensors[sensorIndex] = action.payload;
      return { ...state, sensors: [...sensors] };
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
