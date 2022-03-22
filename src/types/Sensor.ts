import { parseISO } from 'date-fns';
import { makeAutoObservable } from 'mobx';
import { AbstractEntity } from 'types/AbstractEntity';
import BoardTypeEnum from 'types/BoardTypeEnum';
import MeasurementTypeEnum from 'types/MeasurementTypeEnum';
import SensorTypeEnum from 'types/SensorTypeEnum';
import User, { UserId } from 'types/User';
import Measurement from './Measurement';

export type SensorId = string;

class Sensor implements AbstractEntity {
  constructor(s) {
    this.name = s?.name || '';
    this.displayName = s?.displayName || '';
    this.type = s?.type || undefined;
    this.visible = s?.visible || true;
    this.expanded = false;
    this.id = s?.id;
    this.measurementTypes = s?.measurementTypes || [];
    this.userId = s?.userId;
    this.user = s?.user ? new User(s.user) : null;
    this.timezone = s?.timezone;
    this.boardType = s?.boardType;
    this.location = s?.location;
    this.accessToken = s?.accessToken;
    this.lastSeenAt = s?.lastSeenAt ? parseISO(s.lastSeenAt) : null;
    this.private = s?.private;
    this.sensorTypes = s?.sensorTypes;
    this.createdAt = s?.createdAt ? parseISO(s.createdAt) : new Date();
    this.updatedAt = s?.updatedAt ? parseISO(s.updatedAt) : null;
    this.lastMeasurements = s?.lastMeasurements || [];
    this.lastMeasurements = this.lastMeasurements.map((m) => new Measurement(m));
    makeAutoObservable(this);
  }

  public createdAt: Date;

  public updatedAt: Date;

  public id: SensorId;

  public name: string;

  public displayName: string; // eslint-disable-line

  public type: MeasurementTypeEnum;

  public visible: boolean;

  public expanded: boolean;

  public measurementTypes: MeasurementTypeEnum[];

  public userId: UserId;

  public user: User;

  public location: string;

  public boardType: BoardTypeEnum;

  public sensorTypes: SensorTypeEnum[];

  public timezone: string;

  public accessToken: string;

  public lastSeenAt: Date;

  public private: boolean;

  public lastMeasurements?: Measurement[];

  public static measurementTypeProperties = {
    [MeasurementTypeEnum.ALTITUDE]: {
      domain: [0, 2000],
      unit: 'm',
    },
    [MeasurementTypeEnum.GAS]: {
      domain: [0, 30],
      unit: 'kΩ',
    },
    [MeasurementTypeEnum.HUMIDITY]: {
      domain: [0, 100],
      unit: '%',
    },
    [MeasurementTypeEnum.PRESSURE]: {
      domain: [90000, 105000],
      unit: 'Pa',
    },
    [MeasurementTypeEnum.TEMPERATURE]: {
      domain: [-20, 40],
      unit: '°C',
    },
    [MeasurementTypeEnum.BATTERY_VOLTAGE]: {
      domain: [0, 5],
      unit: 'V',
    },
    [MeasurementTypeEnum.RAW_BATTERY_VOLTAGE]: {
      domain: [0, 8192], // 13 bit ADC
      unit: '',
    },
  };
}

export default Sensor;
