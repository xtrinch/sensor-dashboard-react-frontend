import {
  IsString,
  MinLength,
  Length,
  IsEnum,
  IsBoolean,
  IsUUID,
} from "class-validator";
import { observable } from "mobx";
import SensorTypesEnum from "types/SensorTypesEnum";
import * as uuid from "uuid";
import MeasurementTypeEnum from "types/MeasurementTypeEnum";
import { AxisDomain } from "recharts";

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

  @observable
  @IsUUID()
  public id: string;

  @observable
  @IsString()
  @MinLength(2)
  public name: string;

  @observable
  @IsString()
  @Length(34, 34)
  public address: string;

  @observable
  @IsEnum(SensorTypesEnum)
  public type: SensorTypesEnum;

  @observable
  @IsBoolean()
  public visible: boolean;

  @observable
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
