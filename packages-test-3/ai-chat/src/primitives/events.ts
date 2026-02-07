import { Unsubscribe } from "../types/unsuscribe";

export interface AiChatEvents {
    'threadListItem.switchedTo': { threadId: string };
    
    'thread.runStart': { threadId: string };
    "thread.runEnd": { threadId: string };
    "thread.initialize": { threadId: string };
    "thread.modelContextUpdate": { threadId: string };
}

export class AiChatEventHandler {
    private eventCallback: {
        [K in keyof AiChatEvents]?: (p: AiChatEvents[K]) => void;
    }

    constructor() {
        this.eventCallback = {};
    }

    trigger<TEvent extends keyof AiChatEvents>(name: TEvent, p: AiChatEvents[TEvent]) {
        const callback = this.eventCallback[name];
        if (callback) {
            (callback as (args: AiChatEvents[TEvent]) => void)(p);
        }
    }

    on<TEvent extends keyof AiChatEvents>(
        name: TEvent,
        callback: (p: AiChatEvents[TEvent]) => void,
    ): Unsubscribe {
        this.eventCallback[name] = callback;
        return () => {
            if (this.eventCallback[name] === callback) {
                delete this.eventCallback[name];
            }
        };
    }
};
