import { AccountContext } from "context/AccountContext";
import { addToast } from "context/ToastContext";
import React, { createContext, useContext, useEffect, useState } from "react";
import SensorService from "services/SensorService";
import Sensor, { SensorId } from "types/Sensor";
import { Toast } from "types/Toast";
import User from "types/User";

const SensorContext = createContext<{
  state?: {
    sensorsLoaded: boolean;
    sensors: Sensor[];
    mySensors: Sensor[];
    mySensorsLoaded: boolean;
  };
  updateSensor?: (
    id: SensorId,
    sensor: Sensor,
    skipApiCall?: boolean
  ) => Promise<Sensor>;
  deleteSensor?: (id: SensorId) => Promise<boolean>;
  addSensor?: (sensor: Partial<Sensor>) => Promise<Sensor>;
  reloadSensors?: (loginState: string, user: User) => Promise<void>;
  toggleSensorVisibility?: (sensor: Sensor) => void;
  clearMySensors?: () => void;
}>({});

function SensorContextProvider(props) {
  let [state, setState] = useState({
    sensors: [],
    sensorsLoaded: false,
    mySensors: [],
    mySensorsLoaded: false,
  });
  let { loginState, user } = useContext(AccountContext);

  const clearMySensors = () => {
    setState({ ...state, mySensors: [] });
  };

  const reloadSensors = async (loginState: string, user: User) => {
    try {
      let resp = await SensorService.listSensors({ page: 1, limit: 1000 });
      let sensorData = resp.items;
      if (loginState === "LOGGED_IN") {
        sensorData.map((s) => {
          s.visible = false;
          if (s.userId === user?.id) {
            s.visible = true;
          }
          return s;
        });
      }
      let mySensorData = [];
      if (loginState === "LOGGED_IN") {
        const resp = await SensorService.listMySensors();
        resp.items.map((s) => {
          s.visible = true;
          return s;
        });
        mySensorData = resp.items;
      }
      setState((s) => ({
        ...s,
        sensors: sensorData,
        sensorsLoaded: true,
        mySensors: mySensorData,
        mySensorsLoaded: true,
      }));
    } catch (error) {
      setState({ ...state, sensorsLoaded: true });
    }
  };

  const addSensor = async (sensor: Partial<Sensor>): Promise<Sensor> => {
    const s = await SensorService.addSensor(sensor);
    setState({
      ...state,
      sensors: [...state.sensors, s],
      mySensors: [...state.mySensors, s],
    });

    addToast(
      new Toast({ message: "Successfully added a sensor", type: "success" })
    );

    return s;
  };

  const updateSensor = async (
    id: SensorId,
    sensor: Partial<Sensor>,
    skipApiCall?: boolean
  ): Promise<Sensor> => {
    let s;
    if (skipApiCall) {
      s = sensor;
    } else {
      s = await SensorService.updateSensor(id, sensor);
    }
    const sensors = state.sensors;
    const sensorIndex = sensors.findIndex((sd) => sd.id === s.id);
    sensors[sensorIndex] = s;
    setState({ ...state, sensors: [...sensors] });

    addToast(
      new Toast({
        message: "Successfully updated the sensor",
        type: "success",
      })
    );

    return s;
  };

  const deleteSensor = async (id: SensorId): Promise<boolean> => {
    await SensorService.deleteSensor(id);

    const idx = state.sensors.findIndex((s) => s.id === id);
    state.sensors.splice(idx, 1);
    setState({ ...state });

    addToast(
      new Toast({
        message: "Successfully deleted the sensor",
        type: "success",
      })
    );

    return true;
  };

  const toggleSensorVisibility = async (sensor: Sensor) => {
    sensor.visible = !sensor.visible;
    if (!sensor.visible) {
      sensor.expanded = false;
    }
    const sensors = state.sensors;
    const sensorIndex = sensors.findIndex((sd) => sd.id === sensor.id);
    sensors[sensorIndex] = sensor;
    setState({ ...state, sensors: [...sensors] });
  };

  useEffect(() => {
    const fetch = async () => {
      if (!state.sensorsLoaded) {
        await reloadSensors(loginState, user);
      }
    };
    fetch();
  }, [loginState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SensorContext.Provider
      value={{
        state,
        addSensor,
        deleteSensor,
        updateSensor,
        toggleSensorVisibility,
        clearMySensors,
        reloadSensors,
      }}
    >
      {props.children}
    </SensorContext.Provider>
  );
}

export { SensorContext, SensorContextProvider };
