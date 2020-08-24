import {
  IsBoolean,
  IsEnum,
  IsString,
  Length,
  MinLength,
} from "class-validator";
import MeasurementTypeEnum from "types/MeasurementTypeEnum";
import SensorBoardTypesEnum from "types/SensorBoardTypesEnum";
import SensorTypesEnum from "types/SensorTypesEnum";
import User, { UserId } from "types/User";

export type SensorId = number;

class Sensor {
  constructor(s?: Sensor) {
    this.name = s?.name || "";
    this.address = s?.address || "";
    this.type = s?.type || undefined;
    this.visible = s?.visible || true;
    this.expanded = false;
    this.id = s?.id;
    this.measurementTypes = s?.measurementTypes;
    this.userId = s?.userId;
    this.user = s?.user ? new User(s.user) : null;
    this.timezone = s?.timezone;
    this.boardType = s?.boardType;
    this.location = s?.location;
    this.sensorAccessToken = s?.sensorAccessToken;
  }

  public id: SensorId;

  @IsString()
  @MinLength(2)
  public name: string;

  @IsString()
  @Length(34, 34)
  public address: string;

  @IsEnum(SensorTypesEnum)
  public type: SensorTypesEnum;

  @IsBoolean()
  public visible: boolean;

  public expanded: boolean;

  public measurementTypes: MeasurementTypeEnum[];

  public userId: UserId;

  public user: User;

  public location: string;

  public boardType: SensorBoardTypesEnum;

  public timezone: string;

  public sensorAccessToken: string;

  public static measurementTypeProperties = {
    [MeasurementTypeEnum.ALTITUDE]: {
      domain: [0, 2000],
      unit: "m",
    },
    [MeasurementTypeEnum.GAS]: {
      domain: [0, 100],
      unit: "kΩ",
    },
    [MeasurementTypeEnum.HUMIDITY]: {
      domain: [0, 100],
      unit: "%",
    },
    [MeasurementTypeEnum.PRESSURE]: {
      domain: [0, 1500],
      unit: "hPa",
    },
    [MeasurementTypeEnum.TEMPERATURE]: {
      domain: [-20, 40],
      unit: "°C",
    },
  };
}

export default Sensor;
