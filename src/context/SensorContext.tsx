import { AccountContext, AccountStore } from 'context/AccountContext';
import { addToast } from 'context/ToastContext';
import { makeAutoObservable } from 'mobx';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import SensorService from 'services/SensorService';
import Sensor, { SensorId } from 'types/Sensor';
import { Toast } from 'types/Toast';

export const SensorContext = createContext<SensorStore>(null);

export class SensorStore {
  public sensorsLoaded: boolean;

  public sensors: Sensor[];

  public mySensors: Sensor[];

  public mySensorsLoaded: boolean;

  constructor(public accountStore: AccountStore) {
    makeAutoObservable(this);
  }

  public clearMySensors = () => {
    this.mySensors = [];
  };

  public reloadSensors = async () => {
    try {
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
      let mySensorData = [];
      if (this.accountStore.loginState === 'LOGGED_IN') {
        const resp = await SensorService.listMySensors();
        resp.items.map((s) => {
          s.visible = true;
          return s;
        });
        mySensorData = resp.items;
      }
      this.sensors = sensorData;
      this.sensorsLoaded = true;
      this.mySensors = mySensorData;
      this.mySensorsLoaded = true;
    } catch (error) {
      this.sensorsLoaded = true;
    }
  };

  public addSensor = async (sensor: Partial<Sensor>): Promise<Sensor> => {
    const s = await SensorService.addSensor(sensor);
    this.sensors.push(s);
    this.mySensors.push(s);

    addToast(new Toast({ message: 'Successfully added a sensor', type: 'success' }));

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

    addToast(
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

    addToast(
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
  const sensorStore = useMemo(() => new SensorStore(accountStore), []);

  return <SensorContext.Provider value={sensorStore}>{props.children}</SensorContext.Provider>;
}
