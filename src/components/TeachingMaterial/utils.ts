import { get } from "lodash";

export const getJsonValue = (json: any, path: string) => {
  try {
    const data = JSON.parse(json || "");
    return get(data, path);
  } catch (error) {
    return null;
  }
};
