import type { NotionDataType } from "../types";

export interface State {
  data?: NotionDataType;
  loading: boolean;
  error?: string;
}

export type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: NotionDataType }
  | { type: "FETCH_ERROR"; error: string };

export const initialState: State = {
  data: undefined,
  loading: true,
  error: undefined,
};

export const notionReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_START":
      return { data: undefined, loading: true, error: undefined };
    case "FETCH_SUCCESS":
      return { data: action.payload, loading: false, error: undefined };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};
