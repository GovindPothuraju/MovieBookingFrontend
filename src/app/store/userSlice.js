import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: true,
  },

  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },

    removeUser: (state) => {
      state.user = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addUser,
  removeUser,
  setLoading,
} = userSlice.actions;

export default userSlice.reducer;