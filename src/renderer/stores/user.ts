import { type AnyAction, createAsyncThunk, createSlice, type PayloadAction, type ThunkAction } from "@reduxjs/toolkit";
import type { RootState } from "renderer/redux/store";

export interface UserState {
  users: string[];
  selectedUser: string | null;
  credits: number;
  status: "ready" | "loading" | "failed";
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  credits: 0,
  status: "failed",
};

export const updateCredit = createAsyncThunk(
  "user/updateCredit",
  async (_, { getState }) => {
    const user = (getState() as any).user.selectedUser;
    if (!user) return null;
    try {
      const result = await fetch(`https://www.regcheck.org.uk/ajax/getcredits.aspx?username=${user}`);
      if (result.ok) {
        const text = await result.text();
        return parseInt(text);
      }
    } catch { }
    return null;
  }
);

export const setSelectedUser: (user: string | null) => ThunkAction<void, unknown, undefined, AnyAction> =
  (user) => ((dispatch) => {
    dispatch(userSlice.actions.selectUser(user));
    if (!user) return;
    dispatch(updateCredit());
  });

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<string>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user !== action.payload);
    },
    selectUser: (state, action: PayloadAction<string | null>) => {
      state.selectedUser = action.payload;
      if (!!action.payload && !state.users.includes(action.payload))
        state.users.push(action.payload);
    }
  },
  extraReducers: builder =>
    builder
      .addCase(updateCredit.pending, (state) => {
        state.status = "loading";
        state.credits = 0;
      })
      .addCase(updateCredit.fulfilled, (state, action) => {
        if (action.payload !== null) {
          state.credits = action.payload;
          state.status = "ready";
        } else {
          state.credits = 0;
          state.status = "failed";
        }
      })
});

export const { addUser, removeUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
