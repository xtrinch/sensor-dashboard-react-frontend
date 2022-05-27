import { parseISO } from 'date-fns';
import { AbstractEntity } from 'types/AbstractEntity';
import BoardTypeEnum from 'types/BoardTypeEnum';
import DisplayTypeEnum from 'types/DisplayTypeEnum';
import MeasurementTypeEnum from 'types/MeasurementTypeEnum';
import Sensor, { SensorId } from 'types/Sensor';
import User, { UserId } from 'types/User';

export type DisplayId = string;

export interface BoardState {
  objects: any[]; // TODO
}

class Display implements AbstractEntity {
  constructor(s) {
    this.name = s?.name || '';
    this.id = s?.id;
    this.userId = s?.userId;
    this.user = s?.user ? new User(s.user) : null;
    this.boardType = s?.boardType;
    this.location = s?.location;
    this.accessToken = s?.accessToken;
    this.lastSeenAt = s?.lastSeenAt ? parseISO(s.lastSeenAt) : null;
    this.sensors = s?.sensors ? s.sensors.map((sensor) => new Sensor(sensor)) : [];
    this.sensorIds = s?.sensorIds || [];
    this.measurementTypes = s?.measurementTypes || [];
    this.createdAt = s?.createdAt ? parseISO(s.createdAt) : new Date();
    this.updatedAt = s?.updatedAt ? parseISO(s.updatedAt) : null;
    this.state = s?.state;
    this.type = s?.type;
  }

  public createdAt: Date;

  public updatedAt: Date;

  public id: DisplayId;

  public name: string;

  public userId: UserId;

  public user: User;

  public location: string;

  public boardType: BoardTypeEnum;

  public type: DisplayTypeEnum;

  public accessToken: string;

  public lastSeenAt: Date;

  public sensors: Sensor[];

  public sensorIds: SensorId[];

  public measurementTypes: MeasurementTypeEnum[];

  public visible: boolean;

  public expanded: boolean;

  public private: boolean;

  public state: BoardState;
}

export default Display;
