import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  status: "idle" | "success" | "needs_clarification" | "error";
  prompt: string;
  targetLanguage: string;
  contextId: string | null;
  message: string | null;
  errorCode: string | null;
}

const initialState: SessionState = {
  status: "idle",
  prompt: "",
  targetLanguage: "",
  contextId: null,
  message: null,
  errorCode: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    requestSubmitted(state, action: PayloadAction<{ prompt: string; targetLanguage: string }>) {
      state.prompt = action.payload.prompt;
      state.targetLanguage = action.payload.targetLanguage;
    },
    responseSucceeded(state, action: PayloadAction<{ contextId: string }>) {
      state.status = "success";
      state.contextId = action.payload.contextId;
      state.message = null;
      state.errorCode = null;
    },
    responseNeedsClarification(state, action: PayloadAction<{ message: string }>) {
      state.status = "needs_clarification";
      state.contextId = null;
      state.message = action.payload.message;
      state.errorCode = null;
    },
    responseFailed(state, action: PayloadAction<{ errorCode: string; message: string }>) {
      state.status = "error";
      state.contextId = null;
      state.message = action.payload.message;
      state.errorCode = action.payload.errorCode;
    },
    reset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  requestSubmitted,
  responseSucceeded,
  responseNeedsClarification,
  responseFailed,
  reset,
} = sessionSlice.actions;

export default sessionSlice.reducer;
