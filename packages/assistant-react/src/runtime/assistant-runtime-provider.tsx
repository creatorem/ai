"use client";

import { FC, memo, PropsWithChildren, useEffect } from "react";
import { useAui, AuiProvider, AssistantClient } from "@creatorem/ai-assistant-store";
import { AssistantRuntime } from "./runtime/assistant-runtime";
import { AssistantRuntimeCore } from "./runtime-cores/core/assistant-runtime-core";
import { RuntimeAdapter } from "./runtime-adapter";
import { ThreadPrimitiveViewportProvider } from "../context/providers/thread-viewport-provider";
import { useAssistantState } from "..";
// import { DevToolsProviderApi } from "../devtools";

const Test = () => {


  // const attachment = useAssistantState((state) => state.attachment);
  // console.log( {attachment} )
  
  const composer = useAssistantState((state) => state.composer);
  console.log( {composer} )

  // const message = useAssistantState((state) => state.message);
  // console.log( {message} )

  // const part = useAssistantState((state) => state.part);
  // console.log( {part} )

  // const suggestion = useAssistantState((state) => state.suggestion);
  // console.log( {suggestion} )

  const suggestions = useAssistantState((state) => state.suggestions);
  console.log( {suggestions} )

  const thread = useAssistantState((state) => state.thread);
  console.log( {thread} )

  const threadListItem = useAssistantState((state) => state.threadListItem);
  console.log( {threadListItem} )

  const threads = useAssistantState((state) => state.threads);
  console.log( {threads} )

  const tools = useAssistantState((state) => state.tools);
  console.log( {tools} )

  return null
}

export namespace AssistantRuntimeProvider {
  export type Props = PropsWithChildren<{
    /**
     * The runtime to provide to the rest of your app.
     */
    runtime: AssistantRuntime;

    /**
     * The aui instance to extend. If not provided, a new aui instance will be created.
     */
    aui?: AssistantClient;
  }>;
}

const getRenderComponent = (runtime: AssistantRuntime) => {
  return (runtime as { _core?: AssistantRuntimeCore })._core?.RenderComponent;
};

export const AssistantRuntimeProviderImpl: FC<
  AssistantRuntimeProvider.Props
> = ({ children, aui: parent = null, runtime }) => {
  const aui = useAui({ threads: RuntimeAdapter(runtime) }, { parent: parent });
  // console.log( {aui} )


  

  // useEffect(() => {
  //   if (process.env["NODE_ENV"] === "production") return;
  //   return DevToolsProviderApi.register(aui);
  // }, [aui]);

  const RenderComponent = getRenderComponent(runtime);

  return (
    <AuiProvider value={aui}>
      <Test />
      {RenderComponent && <RenderComponent />}

      {/* TODO temporarily allow accessing viewport state from outside the viewport */}
      {/* TODO figure out if this behavior should be deprecated, since it is quite hacky */}
      <ThreadPrimitiveViewportProvider>
        {children}
      </ThreadPrimitiveViewportProvider>
    </AuiProvider>
  );
};

export const AssistantRuntimeProvider = memo(AssistantRuntimeProviderImpl);
