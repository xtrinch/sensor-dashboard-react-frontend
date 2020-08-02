import { observable } from "mobx";
import MeasurementTypeEnum from "types/MeasurementTypeEnum";

class Measurement {
  constructor(m?: Measurement) {
    this.createdAt = m?.createdAt || undefined;
    this.measurement = m?.measurement || 0;
  }

  @observable
  public createdAt: string; // partial date

  @observable
  public measurement: number;

  public measurementType: MeasurementTypeEnum;
}

export default Measurement;
