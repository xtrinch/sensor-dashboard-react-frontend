import Sensor from "types/Sensor";
import { computed, observable } from "mobx";
import SensorService from "services/SensorService";
import { startOfDay, endOfDay } from "date-fns";

export default class SensorStore {
  @observable
  private _sensors: Sensor[] = null;

  @observable
  private _fromDate: Date;

  @observable
  private _toDate: Date;

  @computed
  get fromDate() {
    return this._fromDate;
  }

  @computed
  get toDate() {
    return this._toDate;
  }

  public changeFromDate = (date: Date) => {
    this._fromDate = startOfDay(date);
  };

  public changeToDate = (date: Date) => {
    this._toDate = endOfDay(date);
  };

  @computed
  get sensors() {
    return this._sensors;
  }

  public listSensors = async () => {
    const resp = await SensorService.listSensors();
    this._sensors = resp.items;
  };

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
