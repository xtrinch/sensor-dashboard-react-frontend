import { AccountContext, AccountContextState } from "context/AccountContext";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import SensorService from "services/SensorService";
import Sensor, { SensorId } from "types/Sensor";

const reload = async (
  dispatch: React.Dispatch<any>,
  accountContext: AccountContextState
) => {
  try {
    let resp = await SensorService.listSensors();
    let sensorData = resp.items;
    let mySensorData;
    if (accountContext.loginState === "LOGGED_IN") {
      sensorData.map((s) => {
        s.visible = false;
        if (s.userId === accountContext.user?.id) {
          s.visible = true;
        }
        return s;
      });
    }
    if (accountContext.loginState === "LOGGED_IN") {
      resp = await SensorService.listMySensors();
      resp.items.map((s) => {
        s.visible = true;
        return s;
      });
      mySensorData = resp.items;

      dispatch({
        type: "mySensorsReady",
        payload: mySensorData,
      });
    }

    dispatch({
      type: "sensorsReady",
      payload: sensorData,
    });
  } catch (error) {
    console.log(error);
  }
};

const addSensor = async (
  dispatch: React.Dispatch<any>,
  sensor: Partial<Sensor>
): Promise<Sensor> => {
  const s = await SensorService.addSensor(sensor);

  dispatch({
    type: "addSensor",
    payload: s,
  });

  return s;
};

const updateSensor = async (
  dispatch: React.Dispatch<any>,
  id: SensorId,
  sensor: Partial<Sensor>
): Promise<Sensor> => {
  const s = await SensorService.updateSensor(id, sensor);

  dispatch({
    type: "updateSensor",
    payload: s,
  });

  return s;
};

type SensorContextState = {
  sensorsLoaded: boolean;
  sensors: Sensor[];
  mySensors: Sensor[];

  reload: (
    dispatch: React.Dispatch<any>,
    accountContext: AccountContextState
  ) => {};
  addSensor: (
    dispatch: React.Dispatch<any>,
    sensor: Partial<Sensor>
  ) => Promise<Sensor>;
  updateSensor: (
    dispatch: React.Dispatch<any>,
    id: SensorId,
    sensor: Partial<Sensor>
  ) => Promise<Sensor>;
};

const initialState: SensorContextState = {
  sensors: [],
  mySensors: [],
  sensorsLoaded: false,
  reload: reload,
  addSensor: addSensor,
  updateSensor: updateSensor,
};

interface SensorAddAction {
  type: "addSensor";
  payload: Sensor;
}

interface SensorReadyAction {
  type: "sensorsReady";
  payload: Sensor[];
}

interface MySensorsReadyAction {
  type: "mySensorsReady";
  payload: Sensor[];
}

interface UpdateSensorAction {
  type: "updateSensor";
  payload: Sensor;
}

export type SensorActionTypes =
  | SensorReadyAction
  | UpdateSensorAction
  | SensorAddAction
  | MySensorsReadyAction;

const SensorContext = createContext<[SensorContextState, React.Dispatch<any>]>(
  null
);

let reducer = (
  state: SensorContextState,
  action: SensorActionTypes
): SensorContextState => {
  switch (action.type) {
    case "sensorsReady":
      return { ...state, sensors: action.payload, sensorsLoaded: true };
    case "mySensorsReady":
      return { ...state, mySensors: action.payload, sensorsLoaded: true };
    case "updateSensor":
      const sensors = state.sensors;
      const sensorIndex = sensors.findIndex((s) => s.id === action.payload.id);
      sensors[sensorIndex] = action.payload;
      return { ...state, sensors: [...sensors] };
    case "addSensor":
      return { ...state, sensors: [...state.sensors, action.payload] };
    default: {
      return { ...state, sensors: [] };
    }
  }
};

function SensorContextProvider(props) {
  let [state, dispatch] = useReducer(reducer, initialState);
  let [accountContext] = useContext(AccountContext);

  useEffect(() => {
    if (!state.sensorsLoaded) {
      state.reload(dispatch, accountContext);
    }
  }, [state, accountContext]); // The empty array causes this effect to only run on mount

  return (
    <SensorContext.Provider value={[state, dispatch]}>
      {props.children}
    </SensorContext.Provider>
  );
}

export { SensorContext, SensorContextProvider };
