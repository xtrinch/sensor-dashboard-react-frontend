import { getUrl, getHeaders, processResponse } from "utils/http";
import Sensor from "types/Sensor";

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
}
