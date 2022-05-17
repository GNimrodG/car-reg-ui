import { XMLParser } from "fast-xml-parser";

export const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "medium",
});

export function serializeQuery(obj: any) {
  if (!obj) return "";
  if (typeof obj === "string") return encodeURIComponent(obj);
  var str = [];
  for (var p in obj) {
    if (obj[p] !== null && obj[p] !== undefined && obj[p] !== "") {
      if (obj[p] instanceof Array)
        for (const v of obj[p])
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(v));
      else
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  }
  return (str.length > 0 ? str.join("&") : '');
}

const parser = new XMLParser();

export function handleResponse(body: string): any | null {
  if (!body) return null;
  try {
    // const match = /<vehicleJson>([A-Za-z0-9.":{},\/@=$&\r\n\t\s\w]+)<\/vehicleJson>/.exec(body);
    // if (!match) return null;
    const xmlData = parser.parse(body);
    console.log({ xmlData });
    return JSON.parse(xmlData.Vehicle.vehicleJson);
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function getRelevantData(data: any) {
  const Year: number | null = data?.RegistrationYear || null;
  const Make: string | null = data?.CarMake?.CurrentTextValue || data?.MakeDescription?.CurrentTextValue || null;
  const Model: string | null = data?.CarModel?.CurrentTextValue || data?.ModelDescription?.CurrentTextValue || null;
  const VIN: string | null =
    data?.VIN ||
    data?.VechileIdentificationNumber ||
    data?.VehicleIdentificationNumber ||
    data?.ExtendedData?.numSerieMoteur || // France
    null;
  const Color: string | null = data?.Color || data?.Colour || null;
  const Fuel: string | null = data?.FuelType?.CurrentTextValue || null;

  return { Year, Make, Model, VIN, Color, Fuel };
}
