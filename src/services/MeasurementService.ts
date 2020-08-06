import Measurement from "types/Measurement";
import { getHeaders, getUrl, processResponse } from "utils/http";

export default class MeasurementService {
  public static listMeasurements = async (queryParams) => {
    const url = getUrl("/measurements", queryParams);

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    for (const sensor of Object.keys(result)) {
      for (const measureType of Object.keys(result[sensor])) {
        result[sensor][measureType] = result[sensor][measureType].map(
          (m) => new Measurement(m)
        );
      }
    }

    return result;
  };
}
