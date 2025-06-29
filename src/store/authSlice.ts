import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuth: boolean;
}

const getInitialState = (): AuthState => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return {
      isAuth: false,

    };
  }

  return {
    isAuth: true,
    
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
      }>
    ) {
      state.isAuth = true;
      //state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
      
    },
    logout(state) {
      state.isAuth = false;

      localStorage.removeItem("accessToken");

    },

    reSetAvatar(state, action: PayloadAction<{ avatar: string}>) {
     
     
    },
  },
});

export const { login, logout,reSetAvatar } = authSlice.actions;
export default authSlice.reducer;
