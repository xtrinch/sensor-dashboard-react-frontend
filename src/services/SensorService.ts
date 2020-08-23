import Sensor from "types/Sensor";
import { getHeaders, getUrl, processResponse } from "utils/http";

export default class SensorService {
  public static listSensors = async () => {
    const url = getUrl("/sensors");

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    const sensors: Sensor[] = [];
    for (const item of result.items) {
      sensors.push(new Sensor(item));
    }

    return {
      meta: result.meta,
      items: sensors,
    };
  };

  public static addSensor = async (sensor: Partial<Sensor>) => {
    const url = getUrl("/sensors");

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
      body: JSON.stringify(sensor),
    });

    const result = await processResponse(resp);

    return result;
  };
}
