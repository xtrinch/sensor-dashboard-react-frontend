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
    this.id = uuid.v4();
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

  public static getDomainForType(
    type: MeasurementTypeEnum
  ): [AxisDomain, AxisDomain] {
    switch (type) {
      case MeasurementTypeEnum.ALTITUDE:
        return [0, 2000];
      case MeasurementTypeEnum.GAS:
        return [0, 100];
      case MeasurementTypeEnum.HUMIDITY:
        return [0, 100];
      case MeasurementTypeEnum.PRESSURE:
        return [0, 1500];
      case MeasurementTypeEnum.TEMPERATURE:
        return [-20, 40];
      default:
        return [0, 0];
    }
  }
}

export default Sensor;
