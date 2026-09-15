import { configureStore } from "@reduxjs/toolkit";
import { api } from "../api/apiSlice";
import sessionReducer from "../features/request/sessionSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
