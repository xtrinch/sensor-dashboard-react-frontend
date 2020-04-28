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

class Sensor {
  constructor(s?: Sensor) {
    this.name = s?.name || "";
    this.address = s?.address || "";
    this.type = s?.type || undefined;
    this.visible = s?.visible || false;
    this.id = uuid.v4();
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
}

export default Sensor;
