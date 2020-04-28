import Sensor from "types/Sensor";
import { computed, observable } from "mobx";

export default class SensorStore {
  @observable
  private _sensors: Sensor[];

  constructor() {
    this._sensors = JSON.parse(localStorage.getItem("sensors")) || [];
  }

  @computed
  get sensors() {
    return this._sensors;
  }

  public addSensor = (sensor: Sensor) => {
    const visibleCount = this._sensors.filter((s) => s.visible).length;
    if (visibleCount < 4) {
      sensor.visible = true;
    }

    this._sensors.push(sensor);
    localStorage.setItem("sensors", JSON.stringify(this._sensors));
  };

  public removeSensor = (sensor: Sensor) => {
    this._sensors = this._sensors.filter((s) => s.id !== sensor.id);
    localStorage.setItem("sensors", JSON.stringify(this._sensors));
  };

  public toggleVisibility = (sensor: Sensor) => {
    const visibleCount = this._sensors.filter((s) => s.visible).length;
    if (visibleCount >= 4 && !sensor.visible) {
      // only allow 4 visible sensors at the same time
      return;
    }

    sensor.visible = !sensor.visible;
    localStorage.setItem("sensors", JSON.stringify(this._sensors));
  };
}

export interface SensorStoreProps {
  sensorStore?: SensorStore;
}
