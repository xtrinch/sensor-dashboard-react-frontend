import { AccountContext, AccountStore } from 'context/AccountContext';
import { makeAutoObservable } from 'mobx';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import SensorService from 'services/SensorService';
import Sensor, { SensorId } from 'types/Sensor';
import { Toast } from 'types/Toast';
import { ToastContext, ToastStore } from './ToastContext';

export const SensorContext = createContext<SensorStore>(null);

export class SensorStore {
  public sensorsLoaded: boolean;

  public sensors: Sensor[] = [];

  public mySensors: Sensor[] = [];

  public mySensorsLoaded: boolean;

  constructor(public accountStore: AccountStore, public toastStore: ToastStore) {
    makeAutoObservable(this);
  }

  public clearMySensors = () => {
    this.mySensors = [];
  };

  public listSensors = async () => {
    try {
      // to circumvent the fact we do not have loading statuses
      this.sensors = [];
      const resp = await SensorService.listSensors({ page: 1, limit: 1000 });
      const sensorData = resp.items;
      if (this.accountStore.loginState === 'LOGGED_IN') {
        sensorData.map((s) => {
          s.visible = false;
          if (s.userId === this.accountStore.user?.id) {
            s.visible = true;
          }
          return s;
        });
      }

      this.sensors = sensorData;
      this.sensorsLoaded = true;
    } catch (error) {
      this.sensorsLoaded = true;
    }
  };

  public listMySensors = async () => {
    try {
      // to circumvent the fact we do not have loading statuses
      this.mySensors = [];
      let mySensorData = [];
      if (this.accountStore.loginState === 'LOGGED_IN') {
        const resp = await SensorService.listMySensors();
        resp.items.map((s) => {
          s.visible = true;
          return s;
        });
        mySensorData = resp.items;
      }
      this.mySensors = mySensorData;
      this.mySensorsLoaded = true;
    } catch (error) {
      this.mySensorsLoaded = true;
    }
  };

  public addSensor = async (sensor: Partial<Sensor>): Promise<Sensor> => {
    const s = await SensorService.addSensor(sensor);
    this.sensors.push(s);
    this.mySensors.push(s);

    this.toastStore.addToast(
      new Toast({ message: 'Successfully added a sensor', type: 'success' }),
    );

    return s;
  };

  public updateSensor = async (
    id: SensorId,
    sensor: Partial<Sensor>,
    skipApiCall?: boolean,
  ): Promise<Sensor> => {
    let s;
    if (skipApiCall) {
      s = sensor;
    } else {
      s = await SensorService.updateSensor(id, sensor);
    }
    const sensorIndex = this.sensors.findIndex((sd) => sd.id === s.id);
    this.sensors[sensorIndex] = s;

    this.toastStore.addToast(
      new Toast({
        message: 'Successfully updated the sensor',
        type: 'success',
      }),
    );

    return s;
  };

  public deleteSensor = async (id: SensorId): Promise<boolean> => {
    await SensorService.deleteSensor(id);

    const idx = this.sensors.findIndex((s) => s.id === id);
    this.sensors.splice(idx, 1);

    this.toastStore.addToast(
      new Toast({
        message: 'Successfully deleted the sensor',
        type: 'success',
      }),
    );

    return true;
  };

  public toggleSensorVisibility = async (sensor: Sensor) => {
    sensor.visible = !sensor.visible;
    if (!sensor.visible) {
      sensor.expanded = false;
    }
    // bust the reference so the callback can react
    this.sensors = [...this.sensors];
    this.mySensors = [...this.mySensors];
  };
}

export function SensorContextProvider(props) {
  const accountStore = useContext(AccountContext);
  const toastStore = useContext(ToastContext);
  const sensorStore = useMemo(
    () => new SensorStore(accountStore, toastStore),
    [accountStore, toastStore],
  );

  return <SensorContext.Provider value={sensorStore}>{props.children}</SensorContext.Provider>;
}
