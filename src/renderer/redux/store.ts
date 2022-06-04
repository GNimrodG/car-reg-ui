import { type ThunkAction, type Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import ElectronStore from "electron-store";
import {
  persistStore, persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createElectronStorage from "redux-persist-electron-storage";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import recentSlice from "renderer/stores/recent";
import userSlice from "renderer/stores/user";

const rootReducer = combineReducers({
  user: userSlice,
  recent: recentSlice,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage: createElectronStorage(),
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
