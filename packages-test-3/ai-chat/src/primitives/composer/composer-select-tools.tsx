import { useAiContext } from "@creatorem/ai-chat/ai-provider";
import { UITool } from "@creatorem/ai-chat/types/tools-types";
import { useCallback, useMemo } from "react";

export namespace ComposerPrimitiveSelectTools {
    export type ToolUIComponentProps = {
        toolName: string;
        display?: UITool<any,any>['display']
        isEnabled: boolean;
        toggle: () => void;
    };

    export type Props = {
        toolUI: React.ComponentType<ToolUIComponentProps>;
        empty?: React.ReactNode;
        header?: React.ReactNode
    };
}

export const ComposerPrimitiveSelectTools = ({ toolUI: ToolUI, empty, header }: ComposerPrimitiveSelectTools.Props) => {
    const tools = useAiContext((s) => s.tools);
    const upsertTool = useAiContext((s) => s.upsertTool);

    const toolNames = useMemo(() => {
        return Object.keys(tools ?? {});
    }, [tools]);

    const onToggle = useCallback((toolName: string) => {
        const tool = tools[toolName];
        if (!tool) return;

        upsertTool({
            ...tool,
            disabled: !tool.disabled,
        })
    }, [tools]);

    return (
        <>
            {toolNames.length === 0 ? empty : (
                <>
                    {header}
                    {toolNames.map((toolName) => (
                        <ToolUI
                            key={toolName}
                            toolName={toolName}
                            display={tools[toolName]!.display}
                            isEnabled={!tools[toolName]!.disabled}
                            toggle={() => onToggle(toolName)}
                        />
                    ))}
                </>
            ) 
            }
        </>
    );
};
