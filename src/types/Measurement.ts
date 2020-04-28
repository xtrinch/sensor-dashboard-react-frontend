import { observable } from "mobx";

class Measurement {
  constructor(m?: Measurement) {
    this.date = m?.date || undefined;
    this.value = m?.value || 0;
  }

  @observable
  public date: Date;

  @observable
  public value: number;
}

export default Measurement;
