import { type ModelContextProvider } from "../../../model-context/model-context-types";
import type { Unsubscribe } from "../../../types/unsubscribe";
import type { AssistantRuntimeCore } from "./assistant-runtime-core";
import { CompositeContextProvider } from "../../../utils/composite-context-provider";
import { ThreadListRuntimeCore } from "./thread-list-runtime-core";

export abstract class BaseAssistantRuntimeCore implements AssistantRuntimeCore {
  protected readonly _contextProvider = new CompositeContextProvider();
  public abstract get threads(): ThreadListRuntimeCore;

  public registerModelContextProvider(
    provider: ModelContextProvider,
  ): Unsubscribe {
    return this._contextProvider.registerModelContextProvider(provider);
  }

  public getModelContextProvider(): ModelContextProvider {
    return this._contextProvider;
  }
}
