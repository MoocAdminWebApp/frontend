import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import permissionSlice from "./PermissionSlice";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
localStorage.removeItem("user_menuItems");

const store = configureStore({
  reducer: {
    auth: authReducer,
    permission: permissionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState
) => ReturnType;
export default store;
