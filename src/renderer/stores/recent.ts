import { type AnyAction, createSlice, type PayloadAction, type ThunkAction } from "@reduxjs/toolkit";
import { CountryData } from "renderer/static/countries.json";
import type { RootState } from "renderer/redux/store";
import { updateCredit } from "./user";

export interface ResponseData {
  data: string;
  json: any;
  country: string;
  label: string | null;
  fields: Record<string, string>;
  date?: number;
}

export interface RecentState {
  types: CountryData[];
  responses: ResponseData[];
}

const initialState: RecentState = {
  types: [],
  responses: [],
};

const MAX_RECENT_TYPES = 5;
const MAX_RECENT_RESPONES = 1000;

export const addResponse: (response: string, json: any, fields: Record<string, string>, type: CountryData) =>
  ThunkAction<void, unknown, unknown, AnyAction> =
  (response, json, fields, type) => ((dispatch) => {
    dispatch(recentSlice.actions.addResponse({ response, json, fields, type }));
    dispatch(updateCredit())
  });

export const recentSlice = createSlice({
  name: "recent",
  initialState,
  reducers: {
    addType: (state, action: PayloadAction<CountryData>) => {
      state.types = [
        action.payload,
        ...state.types
          .filter((type) => type.endpoint !== action.payload.endpoint),
      ].slice(0, MAX_RECENT_TYPES);
    },
    addResponse: (state,
      { payload: { response, json, fields, type } }:
        PayloadAction<{ response: string, json: any, fields: Record<string, string>, type: CountryData }>) => {
      state.responses = [
        {
          data: response.replace(/\r\n/g, "").replace(/\s{2,}/g, ""),
          json, country: type.country, label: type.label || null, fields,
          date: Date.now(),
        },
        ...state.responses,
      ].slice(0, MAX_RECENT_RESPONES);
    },
    importRecentData: (state, action: PayloadAction<RecentState>) => {
      state.types = action.payload.types;
      state.responses = action.payload.responses;
    },
  },
});

export const { addType, importRecentData } = recentSlice.actions;

export const selectRecent = (state: RootState) => state.recent;

export default recentSlice.reducer;
