import { parseISO } from "date-fns";
import { AbstractEntity } from "types/AbstractEntity";
import DisplayBoardTypesEnum from "types/DisplayBoardTypesEnum";
import MeasurementTypeEnum from "types/MeasurementTypeEnum";
import Sensor, { SensorId } from "types/Sensor";
import User, { UserId } from "types/User";

export type DisplayId = number;

class Display extends AbstractEntity {
  constructor(s) {
    super(s);

    this.name = s?.name || "";
    this.id = s?.id;
    this.userId = s?.userId;
    this.user = s?.user ? new User(s.user) : null;
    this.boardType = s?.boardType;
    this.location = s?.location;
    this.accessToken = s?.accessToken;
    this.lastSeenAt = s?.lastSeenAt ? parseISO(s.lastSeenAt) : null;
    this.sensors = s?.sensors
      ? s.sensors.map((sensor) => new Sensor(sensor))
      : [];
    this.sensorIds = s?.sensorIds || [];
    this.measurementTypes = s?.measurementTypes || [];
  }

  public id: DisplayId;

  public name: string;

  public userId: UserId;

  public user: User;

  public location: string;

  public boardType: DisplayBoardTypesEnum;

  public accessToken: string;

  public lastSeenAt: Date;

  public sensors: Sensor[];

  public sensorIds: SensorId[];

  public measurementTypes: MeasurementTypeEnum[];
}

export default Display;
