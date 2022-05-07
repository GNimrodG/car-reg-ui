import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";
import { CountryData } from "renderer/countries.json";
import useLocalStorage from "renderer/utils/useLocalStorage";

export interface ResponseData {
  data: string;
  json: any;
  country: string;
  label: string | null;
  fields: { [key: string]: string };
}

export interface IRecentContext {
  types: CountryData[];
  responses: ResponseData[];
  addResponse: (response: string, json: any, fields: { [key: string]: string }, type: CountryData) => void;
  addType: (type: CountryData) => void;
}

const RecentContext = createContext<IRecentContext>({
  types: [],
  responses: [],
  addResponse: () => { },
  addType: () => { }
});

export default function useRecentStore() {
  return useContext(RecentContext);
}

const MAX_RECENT_TYPES = 5;
const MAX_RECENT_RESPONES = 100;

export function RecentContextProvider({ children }: { children: ReactNode }) {
  const [recentStore, setValue] = useLocalStorage<{ types: CountryData[], responses: ResponseData[] }>
    ("RECENT_STORAGE", { types: [], responses: [], });

  const addResponse = useCallback((response: string, json: any, fields: { [key: string]: string }, type: CountryData) => {
    let types = recentStore.types;
    if (types.includes(type))
      types.splice(types.indexOf(type), 1);
    setValue(recentStore =>
    ({
      ...recentStore,
      responses: [
        {
          data: response.replace(/\r\n/g, "").replace(/\s{2,}/g, ""),
          json, country: type.country, label: type.label || null, fields
        },
        ...recentStore.responses
      ].slice(0, MAX_RECENT_RESPONES),
      types: [type, ...types].slice(0, MAX_RECENT_TYPES),
    }));
  }, [setValue]);

  const addType = useCallback((type: CountryData) => {
    console.log("adding type", type);
    if (recentStore.types.includes(type)) {
      let types = recentStore.types;
      types.splice(types.indexOf(type), 1);
      setValue(recentStore => ({ ...recentStore, types: [type, ...types].slice(0, MAX_RECENT_TYPES) }));
      console.log("added existing type", type);
      return;
    }
    setValue(recentStore => ({ ...recentStore, types: [type, ...recentStore.types].slice(0, MAX_RECENT_TYPES) }));
    console.log("added new type", type);
  }, [recentStore, setValue]);


  const value = useMemo(() => ({ ...recentStore, addResponse, addType }), [recentStore, addResponse, addType]);

  return <RecentContext.Provider value={value}>{children}</RecentContext.Provider>;
}
