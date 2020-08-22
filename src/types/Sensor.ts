import {
  IsBoolean,
  IsEnum,
  IsString,
  Length,
  MinLength,
} from "class-validator";
import MeasurementTypeEnum from "types/MeasurementTypeEnum";
import SensorTypesEnum from "types/SensorTypesEnum";

export type SensorId = number;

class Sensor {
  constructor(s?: Sensor) {
    this.name = s?.name || "";
    this.address = s?.address || "";
    this.type = s?.type || undefined;
    this.visible = s?.visible || true;
    this.expanded = s?.visible || true;
    this.id = s?.id;
    this.measurementTypes = s?.measurementTypes;
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
