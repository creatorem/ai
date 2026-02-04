import { resource, tapMemo, tapState } from "@creatorem/ai-tap";
import { type ClientOutput } from "@creatorem/ai-store";
import { CompositeContextProvider } from "../utils/composite-context-provider";
import type { ModelContextState } from "../types/scopes";

const version = 1;

export const ModelContext = resource((): ClientOutput<"modelContext"> => {
  const [state] = tapState<ModelContextState>(
    () => ({ version: version + 1 }) as unknown as ModelContextState,
  );
  const composite = tapMemo(() => new CompositeContextProvider(), []);

  return {
    state,
    methods: {
      getState: () => state,
      getModelContext: () => composite.getModelContext(),
      subscribe: (callback) => composite.subscribe(callback),
      register: (provider) => composite.registerModelContextProvider(provider),
    },
  };
});
