import {
  Connection,
  Transaction,
  ApiResponseWithPagination,
} from "@arkecosystem/client";
import Sensor from "types/Sensor";
import { computed, observable } from "mobx";
import Measurement from "types/Measurement";
import Config from "config/Config";
import { subDays } from "date-fns/esm";
import { startOfDay, endOfDay } from "date-fns";
import toArkTimestamp from "utils/date";

export default class ArkStore {
  private _client: Connection;
  private _sensor: Sensor;

  @observable
  private _fromDate: Date;

  @observable
  private _toDate: Date;

  @observable
  private _measurements: Measurement[] = [];

  constructor(sensor: Sensor) {
    this._client = new Connection(`${Config.arkNode}/api`);
    this._sensor = sensor;
    this._fromDate = startOfDay(subDays(new Date(), 7));
    this._toDate = endOfDay(new Date());

    this.getMeasurements();
  }

  @computed
  get sensor() {
    return this._sensor;
  }

  @computed
  get measurements() {
    return this._measurements;
  }

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
    this.getMeasurements();
  };

  public changeToDate = (date: Date) => {
    this._toDate = endOfDay(date);
    this.getMeasurements();
  };

  public getMeasurements = async () => {
    const response: ApiResponseWithPagination<
      Transaction[]
    > = await this._client.api("transactions").search({
      senderId: this._sensor.address,
      timestamp: {
        from: toArkTimestamp(this._fromDate),
        to: toArkTimestamp(this._toDate),
      },
    });

    const transactions: Transaction[] = response.body.data;

    this._measurements = transactions.map((t) => {
      return new Measurement({
        date: new Date(t.timestamp.human),
        value: parseInt(t.vendorField) || 0,
      });
    });
  };
}

export interface ArkStoreProps {
  arkStore?: ArkStore;
}
