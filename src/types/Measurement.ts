import MeasurementTypeEnum from "types/MeasurementTypeEnum";

class Measurement {
  constructor(m?: Measurement) {
    this.createdAt = m?.createdAt || undefined;
    this.measurement = m?.measurement || 0;
  }

  public createdAt: string; // partial date

  public measurement: number;

  public measurementType: MeasurementTypeEnum;
}

export default Measurement;
