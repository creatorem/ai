import type { Unsubscribe } from "../unsubscribe";
import type { ModelContextProvider } from "../../model-context/model-context-types";

export type ModelContextState = Record<string, never>;

export type ModelContextMethods = ModelContextProvider & {
  getState(): ModelContextState;
  register: (provider: ModelContextProvider) => Unsubscribe;
};

export type ModelContextClientSchema = {
  state: ModelContextState;
  methods: ModelContextMethods;
};
