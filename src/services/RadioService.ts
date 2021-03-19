import Radio, { RadioId } from "types/Radio";
import { getHeaders, getUrl, processResponse } from "utils/http";

export default class RadioService {
  public static listRadios = async () => {
    const url = getUrl("/radios");

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    const radios: Radio[] = [];
    for (const item of result.items) {
      radios.push(new Radio(item));
    }

    return {
      meta: result.meta,
      items: radios,
    };
  };

  public static getRadio = async (id: RadioId): Promise<Radio> => {
    const url = getUrl(`/radios/${id}`);

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    const s = new Radio(result);
    return s;
  };

  public static addRadio = async (radio: Partial<Radio>): Promise<Radio> => {
    const url = getUrl("/radios");

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
      body: JSON.stringify(radio),
    });

    const result = await processResponse(resp);
    const s = new Radio(result);
    return s;
  };

  public static updateRadio = async (
    id: RadioId,
    radio: Partial<Radio>
  ): Promise<Radio> => {
    const url = getUrl(`/radios/${id}`);

    const resp = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
      body: JSON.stringify(radio),
    });

    const result = await processResponse(resp);
    const s = new Radio(result);
    return s;
  };

  public static readConfig = async (id: RadioId): Promise<Radio> => {
    const url = getUrl(`/radios/${id}/request-config`);

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    return result;
  };

  public static sendConfig = async (id: RadioId): Promise<Radio> => {
    const url = getUrl(`/radios/${id}/send-config`);

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    return result;
  };

  public static deleteRadio = async (
    id: RadioId
  ): Promise<{ success: string }> => {
    const url = getUrl(`/radios/${id}`);

    const resp = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: getHeaders({ contentType: "application/json" }),
    });

    const result = await processResponse(resp);
    return result;
  };
}
