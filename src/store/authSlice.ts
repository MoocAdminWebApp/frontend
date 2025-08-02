import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user";
interface AuthState {
  isAuth: boolean;
  user: User | null;
  permissions: string[]; // user's permission to the entire webapp.
}

const getInitialState = (): AuthState => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return {
      isAuth: false,
      user: null,
      permissions: [], // no permission when not logged in
    };
  }
  let userInfoString = localStorage.getItem("userInfo");
  return {
    isAuth: true,
    user:
      userInfoString === "" || userInfoString == null
        ? null
        : (JSON.parse(userInfoString) as User),
    permissions: [], // wait for permission api
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    login(
      state,
      action: PayloadAction<{
        accessToken: string;
        user: User;
      }>
    ) {
      state.isAuth = true;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("userInfo", JSON.stringify(state.user));
    },
    logout(state) {
      state.isAuth = false;
      state.permissions = []; // clear all permissions when logged out
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
    },

    reSetAvatar(state, action: PayloadAction<{ avatar: string }>) {
      state.user!.avatar = action.payload.avatar;
      localStorage.setItem("userInfo", JSON.stringify(state.user));
    },

    // set user's permission to an array of string (easier for page-based filtering using page title)
    setPermissions(state, action: PayloadAction<string[]>) {
      state.permissions = action.payload;
    },
    clearPermissions(state) {
      state.permissions = [];
    },
  },
});

export const { login, logout, reSetAvatar, setPermissions, clearPermissions } =
  authSlice.actions;
export default authSlice.reducer;
