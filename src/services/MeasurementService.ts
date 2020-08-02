import { getUrl, getHeaders, processServerResponse } from "utils/http";
import Measurement from "types/Measurement";

export default class MeasurementService {
  public static listMeasurements = async (queryParams) => {
    const url = getUrl("/measurements", queryParams);

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processServerResponse(resp);
    for (const key of Object.keys(result)) {
      result[key] = result[key].map((m) => new Measurement(m));
    }

    return result;
  };
}
