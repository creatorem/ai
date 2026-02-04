module.exports = [
"[project]/packages/tap/src/core/commit.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cleanupAllEffects",
    ()=>cleanupAllEffects,
    "commitRender",
    ()=>commitRender
]);
function commitRender(renderResult) {
    const errors = [];
    for (const task of renderResult.commitTasks){
        try {
            task();
        } catch (error) {
            errors.push(error);
        }
    }
    if (errors.length > 0) {
        if (errors.length === 1) {
            throw errors[0];
        } else {
            for (const error of errors){
                console.error(error);
            }
            throw new AggregateError(errors, "Errors during commit");
        }
    }
}
function cleanupAllEffects(executionContext) {
    const errors = [];
    for (const cell of executionContext.cells){
        if (cell?.type === "effect") {
            cell.deps = null; // Reset deps so effect runs again on next mount
            if (cell.cleanup) {
                try {
                    cell.cleanup?.();
                } catch (e) {
                    errors.push(e);
                } finally{
                    cell.cleanup = undefined;
                }
            }
        }
    }
    if (errors.length > 0) {
        if (errors.length === 1) {
            throw errors[0];
        } else {
            for (const error of errors){
                console.error(error);
            }
            throw new AggregateError(errors, "Errors during cleanup");
        }
    }
}
}),
"[project]/packages/tap/src/core/env.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isDevelopment",
    ()=>isDevelopment
]);
const isDevelopment = ("TURBOPACK compile-time value", "development") === "development" || ("TURBOPACK compile-time value", "development") === "test";
}),
"[project]/packages/tap/src/core/execution-context.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentResourceFiber",
    ()=>getCurrentResourceFiber,
    "getDevStrictMode",
    ()=>getDevStrictMode,
    "withResourceFiber",
    ()=>withResourceFiber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-ssr] (ecmascript)");
;
let currentResourceFiber = null;
function withResourceFiber(fiber, fn) {
    fiber.currentIndex = 0;
    const previousContext = currentResourceFiber;
    currentResourceFiber = fiber;
    try {
        fn();
        fiber.isFirstRender = false;
        // ensure hook count matches
        if (fiber.cells.length !== fiber.currentIndex) {
            throw new Error(`Rendered ${fiber.currentIndex} hooks but expected ${fiber.cells.length}. ` + "Hooks must be called in the exact same order in every render.");
        }
    } finally{
        currentResourceFiber = previousContext;
    }
}
function getCurrentResourceFiber() {
    if (!currentResourceFiber) {
        throw new Error("No resource fiber available");
    }
    return currentResourceFiber;
}
function getDevStrictMode(enable) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDevelopment"]) return null;
    if (currentResourceFiber?.devStrictMode) return currentResourceFiber.isFirstRender ? "child" : "root";
    return enable ? "root" : null;
}
}),
"[project]/packages/tap/src/core/call-resource-fn.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "callResourceFn",
    ()=>callResourceFn,
    "fnSymbol",
    ()=>fnSymbol
]);
function callResourceFn(resource, props) {
    const fn = resource[fnSymbol];
    if (!fn) {
        throw new Error("ResourceElement.type is not a valid Resource");
    }
    return fn(props);
}
const fnSymbol = Symbol("fnSymbol");
}),
"[project]/packages/tap/src/core/resource-fiber.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "commitResourceFiber",
    ()=>commitResourceFiber,
    "createResourceFiber",
    ()=>createResourceFiber,
    "renderResourceFiber",
    ()=>renderResourceFiber,
    "unmountResourceFiber",
    ()=>unmountResourceFiber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$commit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/commit.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/call-resource-fn.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-ssr] (ecmascript)");
;
;
;
;
function createResourceFiber(type, dispatchUpdate, strictMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDevStrictMode"])(false)) {
    return {
        type,
        dispatchUpdate,
        devStrictMode: strictMode,
        cells: [],
        currentIndex: 0,
        renderContext: undefined,
        isFirstRender: true,
        isMounted: false,
        isNeverMounted: true
    };
}
function unmountResourceFiber(fiber) {
    if (!fiber.isMounted) throw new Error("Tried to unmount a fiber that is already unmounted");
    fiber.isMounted = false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$commit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cleanupAllEffects"])(fiber);
}
function renderResourceFiber(fiber, props) {
    const result = {
        commitTasks: [],
        props,
        output: undefined
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withResourceFiber"])(fiber, ()=>{
        fiber.renderContext = result;
        try {
            result.output = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callResourceFn"])(fiber.type, props);
        } finally{
            fiber.renderContext = undefined;
        }
    });
    return result;
}
function commitResourceFiber(fiber, result) {
    fiber.isMounted = true;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDevelopment"] && fiber.isNeverMounted && fiber.devStrictMode === "root") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$commit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitRender"])(result);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$commit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cleanupAllEffects"])(fiber);
    }
    fiber.isNeverMounted = false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$commit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitRender"])(result);
}
}),
"[project]/packages/tap/src/react/use-resource.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useResource",
    ()=>useResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource-fiber.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-ssr] (ecmascript)");
;
;
;
const useDevStrictMode = ()=>{
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDevelopment"]) return null;
    const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const isFirstRender = count.current === 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>count.current++);
    if (count.current !== 2) return null;
    return isFirstRender ? "child" : "root";
};
const resourceReducer = (version, callback)=>{
    return version + (callback() ? 1 : 0);
};
function useResource(element) {
    const [, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducer"])(resourceReducer, 0);
    const devStrictMode = useDevStrictMode();
    // biome-ignore lint/correctness/useExhaustiveDependencies: user provided deps instead of prop identity
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createResourceFiber"])(element.type, dispatch, devStrictMode);
    }, [
        element.type,
        element.key
    ]);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, element.props);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        return ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(fiber);
    }, [
        fiber
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLayoutEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitResourceFiber"])(fiber, result);
    });
    return result.output;
}
}),
"[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resource",
    ()=>resource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/call-resource-fn.ts [app-ssr] (ecmascript)");
;
function resource(fn) {
    const type = (props)=>{
        return {
            type,
            props: props
        };
    };
    type[__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fnSymbol"]] = fn;
    return type;
}
}),
"[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapState",
    ()=>tapState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-ssr] (ecmascript)");
;
;
const dispatchOnFiber = (fiber, callback)=>{
    if (fiber.renderContext) {
        throw new Error("Resource updated during render");
    }
    if (fiber.isMounted) {
        // Only schedule rerender if currently mounted
        fiber.dispatchUpdate(callback);
    } else if (fiber.isNeverMounted) {
        throw new Error("Resource updated before mount");
    }
// TODO mark dirty
};
function getStateCell(initialValue) {
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentResourceFiber"])();
    const index = fiber.currentIndex++;
    // Check if we're trying to use more hooks than in previous renders
    if (!fiber.isFirstRender && index >= fiber.cells.length) {
        throw new Error("Rendered more hooks than during the previous render. " + "Hooks must be called in the exact same order in every render.");
    }
    const cell = fiber.cells[index];
    if (cell) {
        if (cell.type !== "state") throw new Error("Hook order changed between renders");
        return cell;
    }
    const value = typeof initialValue === "function" ? initialValue() : initialValue;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDevelopment"] && fiber.devStrictMode && typeof initialValue === "function") {
        void initialValue();
    }
    const newCell = {
        type: "state",
        value,
        set: (updater)=>{
            dispatchOnFiber(fiber, ()=>{
                const currentValue = newCell.value;
                const nextValue = typeof updater === "function" ? updater(currentValue) : updater;
                if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDevelopment"] && fiber.devStrictMode && typeof updater === "function") {
                    void updater(currentValue);
                }
                if (Object.is(currentValue, nextValue)) return false;
                newCell.value = nextValue;
                return true;
            });
        }
    };
    fiber.cells[index] = newCell;
    return newCell;
}
function tapState(initial) {
    const cell = getStateCell(initial);
    return [
        cell.value,
        cell.set
    ];
}
}),
"[project]/packages/tap/src/hooks/tap-ref.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapRef",
    ()=>tapRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
;
function tapRef(initialValue) {
    const [state] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(()=>({
            current: initialValue
        }));
    return state;
}
}),
"[project]/packages/tap/src/hooks/utils/deps-shallow-equal.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "depsShallowEqual",
    ()=>depsShallowEqual
]);
const depsShallowEqual = (a, b)=>{
    if (a.length !== b.length) return false;
    for(let i = 0; i < a.length; i++){
        if (!Object.is(a[i], b[i])) return false;
    }
    return true;
};
}),
"[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapMemo",
    ()=>tapMemo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-ref.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$deps$2d$shallow$2d$equal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/utils/deps-shallow-equal.ts [app-ssr] (ecmascript)");
;
;
;
;
const tapMemo = (fn, deps)=>{
    const dataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapRef"])();
    if (!dataRef.current) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDevelopment"]) {
            const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentResourceFiber"])();
            if (fiber.devStrictMode) {
                void fn();
            }
        }
        dataRef.current = {
            value: fn(),
            deps
        };
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$deps$2d$shallow$2d$equal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["depsShallowEqual"])(dataRef.current.deps, deps)) {
        dataRef.current.value = fn();
        dataRef.current.deps = deps;
    }
    return dataRef.current.value;
};
}),
"[project]/packages/tap/src/hooks/utils/tap-hook.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerRenderMountTask",
    ()=>registerRenderMountTask,
    "tapHook",
    ()=>tapHook
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-ssr] (ecmascript)");
;
const tapHook = (type, init)=>{
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentResourceFiber"])();
    const index = fiber.currentIndex++;
    if (!fiber.isFirstRender && index >= fiber.cells.length) {
        // Check if we're trying to use more hooks than in previous renders
        throw new Error("Rendered more hooks than during the previous render. " + "Hooks must be called in the exact same order in every render.");
    }
    let cell = fiber.cells[index];
    if (!cell) {
        cell = init();
        fiber.cells[index] = cell;
    }
    if (cell.type !== type) {
        throw new Error("Hook order changed between renders");
    }
    return cell;
};
const registerRenderMountTask = (task)=>{
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentResourceFiber"])();
    fiber.renderContext.commitTasks.push(task);
};
}),
"[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapEffect",
    ()=>tapEffect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$deps$2d$shallow$2d$equal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/utils/deps-shallow-equal.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$tap$2d$hook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/utils/tap-hook.ts [app-ssr] (ecmascript)");
;
;
const newEffect = ()=>({
        type: "effect",
        cleanup: undefined,
        deps: null
    });
function tapEffect(effect, deps) {
    const cell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$tap$2d$hook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapHook"])("effect", newEffect);
    if (deps && cell.deps && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$deps$2d$shallow$2d$equal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["depsShallowEqual"])(cell.deps, deps)) return;
    if (cell.deps !== null && !!deps !== !!cell.deps) throw new Error("tapEffect called with and without dependencies across re-renders");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$tap$2d$hook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["registerRenderMountTask"])(()=>{
        const errors = [];
        try {
            cell.cleanup?.();
        } catch (error) {
            errors.push(error);
        } finally{
            cell.cleanup = undefined;
        }
        try {
            const cleanup = effect();
            if (cleanup !== undefined && typeof cleanup !== "function") {
                throw new Error("An effect function must either return a cleanup function or nothing. " + `Received: ${typeof cleanup}`);
            }
            cell.cleanup = cleanup;
        } catch (error) {
            errors.push(error);
        }
        cell.deps = deps;
        if (errors.length > 0) {
            if (errors.length === 1) {
                throw errors[0];
            } else {
                for (const error of errors){
                    console.error(error);
                }
                throw new AggregateError(errors, "Errors during commit");
            }
        }
    });
}
}),
"[project]/packages/tap/src/hooks/tap-callback.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapCallback",
    ()=>tapCallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
;
const tapCallback = (fn, deps)=>{
    // biome-ignore lint/correctness/useExhaustiveDependencies: user provided deps instead of callback identity
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>fn, deps);
};
}),
"[project]/packages/tap/src/hooks/tap-const.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapConst",
    ()=>tapConst
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
;
function tapConst(getValue, _deps) {
    const [state] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(getValue);
    return state;
}
}),
"[project]/packages/tap/src/hooks/tap-resources.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapResources",
    ()=>tapResources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-callback.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource-fiber.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-const.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
function tapResources(getElements, getElementsDeps) {
    const [version, setVersion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(0);
    const rerender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapConst"])(()=>()=>setVersion((v)=>v + 1), []);
    const fibers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapConst"])(()=>new Map(), []);
    const getElementsMemo = getElementsDeps ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapCallback"])(getElements, getElementsDeps) : getElements;
    // Process each element
    const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        void version;
        const elementsArray = getElementsMemo();
        const seenKeys = new Set();
        const results = [];
        let newCount = 0;
        // Create/update fibers and render
        for(let i = 0; i < elementsArray.length; i++){
            const element = elementsArray[i];
            const elementKey = element.key;
            if (elementKey === undefined) {
                throw new Error(`tapResources did not provide a key for array at index ${i}`);
            }
            if (seenKeys.has(elementKey)) throw new Error(`Duplicate key ${elementKey} in tapResources`);
            seenKeys.add(elementKey);
            let state = fibers.get(elementKey);
            if (!state) {
                const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createResourceFiber"])(element.type, (callback)=>{
                    if (callback()) rerender();
                });
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, element.props);
                state = {
                    fiber,
                    next: result
                };
                newCount++;
                fibers.set(elementKey, state);
                results.push(result.output);
            } else if (state.fiber.type !== element.type) {
                const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createResourceFiber"])(element.type, (callback)=>{
                    if (callback()) rerender();
                });
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, element.props);
                state.next = [
                    fiber,
                    result
                ];
                results.push(result.output);
            } else {
                state.next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(state.fiber, element.props);
                results.push(state.next.output);
            }
        }
        // Clean up removed fibers (only if there might be stale ones)
        if (fibers.size > results.length - newCount) {
            for (const key of fibers.keys()){
                if (!seenKeys.has(key)) {
                    fibers.get(key).next = "delete";
                }
            }
        }
        return results;
    }, [
        getElementsMemo,
        version
    ]);
    // Cleanup on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        return ()=>{
            for (const key of fibers.keys()){
                const fiber = fibers.get(key).fiber;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(fiber);
            }
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        res; // as a performance optimization, we only run if the results have changed
        for (const [key, state] of fibers.entries()){
            if (state.next === "delete") {
                if (state.fiber.isMounted) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(state.fiber);
                }
                fibers.delete(key);
            } else if (Array.isArray(state.next)) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(state.fiber);
                state.fiber = state.next[0];
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitResourceFiber"])(state.fiber, state.next[1]);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitResourceFiber"])(state.fiber, state.next);
            }
        }
    }, [
        res
    ]);
    return res;
}
}),
"[project]/packages/tap/src/hooks/tap-effect-event.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapEffectEvent",
    ()=>tapEffectEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-ref.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-callback.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-ssr] (ecmascript)");
;
;
;
;
;
function tapEffectEvent(callback) {
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapRef"])(callback);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        callbackRef.current = callback;
    });
    if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDevelopment"]) {
        const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentResourceFiber"])();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapCallback"])((...args)=>{
            if (fiber.renderContext) throw new Error("tapEffectEvent cannot be called during render");
            return callbackRef.current(...args);
        }, [
            fiber
        ]);
    }
    return callbackRef.current;
}
}),
"[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapInlineResource",
    ()=>tapInlineResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/call-resource-fn.ts [app-ssr] (ecmascript)");
;
function tapInlineResource(element) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callResourceFn"])(element.type, element.props);
}
}),
"[project]/packages/tap/src/hooks/tap-resource.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapResource",
    ()=>tapResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource-fiber.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-const.ts [app-ssr] (ecmascript)");
;
;
;
;
;
function tapResource(element, propsDeps) {
    const [version, setVersion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(0);
    const rerender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapConst"])(()=>()=>setVersion((v)=>v + 1), []);
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        void element.key;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createResourceFiber"])(element.type, (callback)=>{
            if (callback()) rerender();
        });
    }, [
        element.type,
        element.key
    ]);
    const result = propsDeps ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, element.props), [
        fiber,
        ...propsDeps,
        version
    ]) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, element.props);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(fiber), [
        fiber
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitResourceFiber"])(fiber, result);
    }, [
        fiber,
        result
    ]);
    return result.output;
}
}),
"[project]/packages/tap/src/core/with-key.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withKey",
    ()=>withKey
]);
function withKey(key, element) {
    return {
        ...element,
        key
    };
}
}),
"[project]/packages/tap/src/core/scheduler.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UpdateScheduler",
    ()=>UpdateScheduler,
    "flushResourcesSync",
    ()=>flushResourcesSync
]);
const MAX_FLUSH_LIMIT = 50;
let flushState = {
    schedulers: new Set([]),
    isScheduled: false
};
class UpdateScheduler {
    _task;
    _isDirty;
    constructor(_task){
        this._task = _task;
        this._isDirty = false;
    }
    get isDirty() {
        return this._isDirty;
    }
    markDirty() {
        this._isDirty = true;
        flushState.schedulers.add(this);
        scheduleFlush();
    }
    runTask() {
        this._isDirty = false;
        this._task();
    }
}
const scheduleFlush = ()=>{
    if (flushState.isScheduled) return;
    flushState.isScheduled = true;
    queueMicrotask(flushScheduled);
};
const flushScheduled = ()=>{
    try {
        const errors = [];
        let flushDepth = 0;
        for (const scheduler of flushState.schedulers){
            flushState.schedulers.delete(scheduler);
            if (!scheduler.isDirty) continue;
            flushDepth++;
            if (flushDepth > MAX_FLUSH_LIMIT) {
                throw new Error(`Maximum update depth exceeded. This can happen when a resource ` + `repeatedly calls setState inside tapEffect.`);
            }
            try {
                scheduler.runTask();
            } catch (error) {
                errors.push(error);
            }
        }
        if (errors.length > 0) {
            if (errors.length === 1) {
                throw errors[0];
            } else {
                for (const error of errors){
                    console.error(error);
                }
                throw new AggregateError(errors, "Errors occurred during flushSync");
            }
        }
    } finally{
        flushState.schedulers.clear();
        flushState.isScheduled = false;
    }
};
const flushResourcesSync = (callback)=>{
    const prev = flushState;
    flushState = {
        schedulers: new Set([]),
        isScheduled: true
    };
    try {
        const result = callback();
        flushScheduled();
        return result;
    } finally{
        flushState = prev;
    }
};
}),
"[project]/packages/tap/src/core/create-resource.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createResource",
    ()=>createResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource-fiber.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/scheduler.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-ref.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-const.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
const HandleWrapperResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])((state)=>{
    const [, setElement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(state.elementRef.current);
    const output = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapResource"])(state.elementRef.current);
    const subscribers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapConst"])(()=>new Set(), []);
    const valueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapRef"])(output);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        if (output !== valueRef.current) {
            valueRef.current = output;
            subscribers.forEach((callback)=>callback());
        }
    });
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            getValue: ()=>valueRef.current,
            subscribe: (callback)=>{
                subscribers.add(callback);
                return ()=>subscribers.delete(callback);
            },
            render: (el)=>{
                const changed = state.elementRef.current !== el;
                state.elementRef.current = el;
                if (state.onRender(changed)) {
                    setElement(el);
                }
            },
            unmount: state.onUnmount
        }), [
        state
    ]);
    return handle;
});
const createResource = (element, { mount = true, devStrictMode = false } = {})=>{
    let isMounted = mount;
    let render;
    const props = {
        elementRef: {
            current: element
        },
        onRender: (changed)=>{
            if (isMounted) return changed;
            isMounted = true;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDevelopment"] && fiber.isNeverMounted && fiber.devStrictMode === "child") {
                if (changed) {
                    render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, props);
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitResourceFiber"])(fiber, render);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flushResourcesSync"])(()=>{
                    if (changed) {
                        // In strict mode, render twice to detect side effects
                        if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDevelopment"] && fiber.devStrictMode === "root") {
                            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, props);
                        }
                        render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, props);
                    }
                    if (scheduler.isDirty) return;
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitResourceFiber"])(fiber, render);
                });
            }
            return false;
        },
        onUnmount: ()=>{
            if (!isMounted) throw new Error("Resource not mounted");
            isMounted = false;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(fiber);
        }
    };
    const scheduler = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UpdateScheduler"](()=>{
        // In strict mode, render twice to detect side effects
        if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDevelopment"] && (fiber.devStrictMode === "root" || fiber.devStrictMode && !fiber.isFirstRender)) {
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, props);
        }
        render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, props);
        if (scheduler.isDirty || !isMounted) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commitResourceFiber"])(fiber, render);
    });
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createResourceFiber"])(HandleWrapperResource, (callback)=>{
        if (callback()) scheduler.markDirty();
    }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDevStrictMode"])(devStrictMode));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flushResourcesSync"])(()=>{
        scheduler.markDirty();
    });
    return render.output;
};
}),
"[project]/packages/store/src/utils/store-resource.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StoreResource",
    ()=>StoreResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$create$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/create-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
;
const StoreResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])((element)=>{
    const [handle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$create$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createResource"])(element, {
            mount: false
        }));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>handle.unmount, [
        handle
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        handle.render(element);
    });
    return handle;
});
}),
"[project]/packages/tap/src/core/context.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createResourceContext",
    ()=>createResourceContext,
    "tap",
    ()=>tap,
    "withContextProvider",
    ()=>withContextProvider
]);
const contextValue = Symbol("tap.Context");
const createResourceContext = (defaultValue)=>{
    return {
        [contextValue]: defaultValue
    };
};
const withContextProvider = (context, value, fn)=>{
    const previousValue = context[contextValue];
    context[contextValue] = value;
    try {
        return fn();
    } finally{
        context[contextValue] = previousValue;
    }
};
const tap = (context)=>{
    return context[contextValue];
};
}),
"[project]/packages/store/src/utils/tap-client-stack-context.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SYMBOL_CLIENT_INDEX",
    ()=>SYMBOL_CLIENT_INDEX,
    "getClientIndex",
    ()=>getClientIndex,
    "tapClientStack",
    ()=>tapClientStack,
    "tapWithClientStack",
    ()=>tapWithClientStack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
;
const SYMBOL_CLIENT_INDEX = Symbol("assistant-ui.store.clientIndex");
const getClientIndex = (client)=>{
    return client[SYMBOL_CLIENT_INDEX];
};
const ClientStackContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createResourceContext"])([]);
const tapClientStack = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tap"])(ClientStackContext);
};
const tapWithClientStack = (client, callback)=>{
    const currentStack = tapClientStack();
    const newStack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>[
            ...currentStack,
            client
        ], [
        currentStack,
        client
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withContextProvider"])(ClientStackContext, newStack, callback);
};
}),
"[project]/packages/store/src/utils/base-proxy-handler.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseProxyHandler",
    ()=>BaseProxyHandler,
    "handleIntrospectionProp",
    ()=>handleIntrospectionProp
]);
const INTROSPECTION_PROPS = new Set([
    "$$typeof",
    "nodeType",
    "then"
]);
const handleIntrospectionProp = (prop, name)=>{
    if (prop === Symbol.toStringTag) return name;
    if (typeof prop === "symbol") return undefined;
    if (prop === "toJSON") return ()=>name;
    if (INTROSPECTION_PROPS.has(prop)) return undefined;
    return false;
};
class BaseProxyHandler {
    getOwnPropertyDescriptor(_, prop) {
        const value = this.get(_, prop);
        if (value === undefined) return undefined;
        return {
            value,
            writable: false,
            enumerable: true,
            configurable: false
        };
    }
    set() {
        return false;
    }
    setPrototypeOf() {
        return false;
    }
    defineProperty() {
        return false;
    }
    deleteProperty() {
        return false;
    }
    preventExtensions() {
        return false;
    }
}
}),
"[project]/packages/store/src/wrapper-resource.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "wrapperResource",
    ()=>wrapperResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-ssr] (ecmascript)");
;
const wrapperResource = (fn)=>{
    const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(fn);
    return (props)=>{
        const el = res(props);
        if (props.key === undefined) return el;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withKey"])(props.key, el);
    };
};
}),
"[project]/packages/store/src/tap-client-resource.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientResource",
    ()=>ClientResource,
    "getClientState",
    ()=>getClientState,
    "tapClientResource",
    ()=>tapClientResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-ref.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-client-stack-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/base-proxy-handler.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$wrapper$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/wrapper-resource.ts [app-ssr] (ecmascript)");
;
;
;
;
/**
 * Symbol used internally to get state from ClientProxy.
 * This allows getState() to be optional in the user-facing client.
 */ const SYMBOL_GET_OUTPUT = Symbol("assistant-ui.store.getValue");
const getClientState = (client)=>{
    const output = client[SYMBOL_GET_OUTPUT];
    if (!output) {
        throw new Error("Client scope contains a non-client resource. " + "Ensure your Derived get() returns a client created with tapClientResource(), not a plain resource.");
    }
    return output.state;
};
// Global cache for function templates by field name
const fieldAccessFns = new Map();
function getOrCreateProxyFn(prop) {
    let template = fieldAccessFns.get(prop);
    if (!template) {
        template = function(...args) {
            if (!this || typeof this !== "object") {
                throw new Error(`Method "${String(prop)}" called without proper context. ` + `This may indicate the function was called incorrectly.`);
            }
            const output = this[SYMBOL_GET_OUTPUT];
            if (!output) {
                throw new Error(`Method "${String(prop)}" called on invalid client proxy. ` + `Ensure you are calling this method on a valid client instance.`);
            }
            const method = output.methods[prop];
            if (!method) throw new Error(`Method "${String(prop)}" is not implemented.`);
            if (typeof method !== "function") throw new Error(`"${String(prop)}" is not a function.`);
            return method(...args);
        };
        fieldAccessFns.set(prop, template);
    }
    return template;
}
class ClientProxyHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseProxyHandler"] {
    outputRef;
    index;
    boundFns;
    cachedReceiver;
    constructor(outputRef, index){
        super(), this.outputRef = outputRef, this.index = index;
    }
    get(_, prop, receiver) {
        if (prop === SYMBOL_GET_OUTPUT) return this.outputRef.current;
        if (prop === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SYMBOL_CLIENT_INDEX"]) return this.index;
        const introspection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleIntrospectionProp"])(prop, "ClientProxy");
        if (introspection !== false) return introspection;
        const value = this.outputRef.current.methods[prop];
        if (typeof value === "function") {
            if (this.cachedReceiver !== receiver) {
                this.boundFns = new Map();
                this.cachedReceiver = receiver;
            }
            let bound = this.boundFns.get(prop);
            if (!bound) {
                bound = getOrCreateProxyFn(prop).bind(receiver);
                this.boundFns.set(prop, bound);
            }
            return bound;
        }
        return value;
    }
    ownKeys() {
        return Object.keys(this.outputRef.current.methods);
    }
    has(_, prop) {
        if (prop === SYMBOL_GET_OUTPUT) return true;
        if (prop === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SYMBOL_CLIENT_INDEX"]) return true;
        return prop in this.outputRef.current.methods;
    }
}
const ClientResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$wrapper$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wrapperResource"])((element)=>{
    const valueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapRef"])(null);
    const index = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientStack"])().length;
    const methods = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>new Proxy({}, new ClientProxyHandler(valueRef, index)), [
        index
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapWithClientStack"])(methods, ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapResource"])(element));
    if (!valueRef.current) {
        valueRef.current = value;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        valueRef.current = value;
    });
    return {
        methods,
        state: value.state,
        key: element.key
    };
});
const tapClientResource = (element)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])(ClientResource(element));
};
}),
"[project]/packages/store/src/utils/proxied-assistant-state.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PROXIED_ASSISTANT_STATE_SYMBOL",
    ()=>PROXIED_ASSISTANT_STATE_SYMBOL,
    "createProxiedAssistantState",
    ()=>createProxiedAssistantState,
    "getProxiedAssistantState",
    ()=>getProxiedAssistantState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/base-proxy-handler.ts [app-ssr] (ecmascript)");
"use client";
;
;
const PROXIED_ASSISTANT_STATE_SYMBOL = Symbol("assistant-ui.store.proxiedAssistantState");
const isIgnoredKey = (key)=>{
    return key === "on" || key === "subscribe" || typeof key === "symbol";
};
const createProxiedAssistantState = (client)=>{
    class ProxiedAssistantStateProxyHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseProxyHandler"] {
        get(_, prop) {
            const introspection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleIntrospectionProp"])(prop, "AssistantState");
            if (introspection !== false) return introspection;
            const scope = prop;
            if (isIgnoredKey(scope)) return undefined;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getClientState"])(client[scope]());
        }
        ownKeys() {
            return Object.keys(client).filter((key)=>!isIgnoredKey(key));
        }
        has(_, prop) {
            return !isIgnoredKey(prop) && prop in client;
        }
    }
    return new Proxy({}, new ProxiedAssistantStateProxyHandler());
};
const getProxiedAssistantState = (client)=>{
    return client[PROXIED_ASSISTANT_STATE_SYMBOL];
};
}),
"[project]/packages/store/src/utils/react-assistant-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuiProvider",
    ()=>AuiProvider,
    "DefaultAssistantClient",
    ()=>DefaultAssistantClient,
    "createRootAssistantClient",
    ()=>createRootAssistantClient,
    "useAssistantContextValue",
    ()=>useAssistantContextValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/proxied-assistant-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/base-proxy-handler.ts [app-ssr] (ecmascript)");
;
;
;
;
const NO_OP_SUBSCRIBE = ()=>()=>{};
const createErrorClientField = (message)=>{
    const fn = ()=>{
        throw new Error(message);
    };
    fn.source = null;
    fn.query = null;
    return fn;
};
class DefaultAssistantClientProxyHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseProxyHandler"] {
    get(_, prop) {
        if (prop === "subscribe") return NO_OP_SUBSCRIBE;
        if (prop === "on") return NO_OP_SUBSCRIBE;
        if (prop === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROXIED_ASSISTANT_STATE_SYMBOL"]) return DefaultAssistantClientProxiedAssistantState;
        const introspection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleIntrospectionProp"])(prop, "DefaultAssistantClient");
        if (introspection !== false) return introspection;
        return createErrorClientField("You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.");
    }
    ownKeys() {
        return [
            "subscribe",
            "on",
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROXIED_ASSISTANT_STATE_SYMBOL"]
        ];
    }
    has(_, prop) {
        return prop === "subscribe" || prop === "on" || prop === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROXIED_ASSISTANT_STATE_SYMBOL"];
    }
}
const DefaultAssistantClient = new Proxy({}, new DefaultAssistantClientProxyHandler());
const DefaultAssistantClientProxiedAssistantState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createProxiedAssistantState"])(DefaultAssistantClient);
const createRootAssistantClient = ()=>new Proxy({}, {
        get (_, prop) {
            const introspection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["handleIntrospectionProp"])(prop, "AssistantClient");
            if (introspection !== false) return introspection;
            return createErrorClientField(`The current scope does not have a "${String(prop)}" property.`);
        }
    });
/**
 * React Context for the AssistantClient
 */ const AssistantContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(DefaultAssistantClient);
const useAssistantContextValue = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AssistantContext);
};
const AuiProvider = ({ value, children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AssistantContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/store/src/utils/react-assistant-context.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/packages/store/src/derived.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Derived",
    ()=>Derived
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
;
const Derived = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])((_config)=>{
    return null;
});
}),
"[project]/packages/store/src/attach-default-peers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "attachDefaultPeers",
    ()=>attachDefaultPeers,
    "getDefaultPeers",
    ()=>getDefaultPeers
]);
/**
 * Symbol used to store default peer clients on a resource.
 */ const DEFAULT_PEERS = Symbol("assistant-ui.default-peers");
function attachDefaultPeers(resource, peers) {
    const resourceWithPeers = resource;
    const existing = resourceWithPeers[DEFAULT_PEERS] ?? {};
    for (const key of Object.keys(peers)){
        if (key in existing) {
            throw new Error(`Default peer "${key}" is already attached to this resource`);
        }
    }
    resourceWithPeers[DEFAULT_PEERS] = {
        ...existing,
        ...peers
    };
}
function getDefaultPeers(resource) {
    return resource[DEFAULT_PEERS];
}
}),
"[project]/packages/store/src/utils/split-clients.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapSplitClients",
    ()=>tapSplitClients
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/attach-default-peers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
;
;
;
/**
 * Splits a clients object into root clients and derived clients.
 *
 * @param clients - The clients input object to split
 * @returns An object with { rootClients, derivedClients }
 *
 * @example
 * ```typescript
 * const clients = {
 *   foo: RootClient({ ... }),
 *   bar: Derived({ ... }),
 * };
 *
 * const { rootClients, derivedClients } = splitClients(clients);
 * // rootClients = { foo: ... }
 * // derivedClients = { bar: ... }
 * ```
 */ function splitClients(clients, baseClient) {
    const rootClients = {};
    const derivedClients = {};
    for (const [key, clientElement] of Object.entries(clients)){
        if (clientElement.type === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"]) {
            derivedClients[key] = clientElement;
        } else {
            rootClients[key] = clientElement;
        }
    }
    // Recursively gather all default peers, flattening nested ones
    const gatherDefaultPeers = (clientElement, visited = new Set())=>{
        // Prevent infinite loops
        if (visited.has(clientElement)) return [];
        visited.add(clientElement);
        const defaultPeers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDefaultPeers"])(clientElement.type);
        if (!defaultPeers) return [];
        const result = [];
        for (const [key, peerElement] of Object.entries(defaultPeers)){
            result.push([
                key,
                peerElement
            ]);
            // If this peer is a root client with its own default peers, recursively gather them
            if (peerElement.type !== __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"]) {
                const nestedPeers = gatherDefaultPeers(peerElement, visited);
                result.push(...nestedPeers);
            }
        }
        return result;
    };
    // Apply flattened default peers for each root client
    for (const [_clientKey, clientElement] of Object.entries(rootClients)){
        const allPeers = gatherDefaultPeers(clientElement);
        for (const [key, peerElement] of allPeers){
            // Skip if already exists (first wins)
            if (key in rootClients || key in derivedClients || baseClient[key].source !== null) continue;
            if (peerElement.type === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"]) {
                derivedClients[key] = peerElement;
            } else {
                rootClients[key] = peerElement;
            }
        }
    }
    return {
        rootClients,
        derivedClients
    };
}
const tapShallowMemoObject = (object)=>{
    // biome-ignore lint/correctness/useExhaustiveDependencies: shallow memo
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>object, [
        ...Object.entries(object).flat()
    ]);
};
const tapSplitClients = (clients, baseClient)=>{
    const { rootClients, derivedClients } = splitClients(clients, baseClient);
    return {
        rootClients: tapShallowMemoObject(rootClients),
        derivedClients: tapShallowMemoObject(derivedClients)
    };
};
}),
"[project]/packages/store/src/types/events.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "normalizeEventSelector",
    ()=>normalizeEventSelector
]);
const normalizeEventSelector = (selector)=>{
    if (typeof selector === "string") {
        const source = selector.split(".")[0];
        return {
            scope: source,
            event: selector
        };
    }
    return {
        scope: selector.scope,
        event: selector.event
    };
};
}),
"[project]/packages/store/src/utils/notification-manager.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationManager",
    ()=>NotificationManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-const.ts [app-ssr] (ecmascript)");
;
;
const NotificationManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapConst"])(()=>{
        const listeners = new Map();
        const wildcardListeners = new Set();
        const subscribers = new Set();
        return {
            on (event, callback) {
                const cb = callback;
                if (event === "*") {
                    wildcardListeners.add(cb);
                    return ()=>wildcardListeners.delete(cb);
                }
                let set = listeners.get(event);
                if (!set) {
                    set = new Set();
                    listeners.set(event, set);
                }
                set.add(cb);
                return ()=>{
                    set.delete(cb);
                    if (set.size === 0) listeners.delete(event);
                };
            },
            emit (event, payload, clientStack) {
                const eventListeners = listeners.get(event);
                if (!eventListeners && wildcardListeners.size === 0) return;
                queueMicrotask(()=>{
                    const errors = [];
                    if (eventListeners) {
                        for (const cb of eventListeners){
                            try {
                                cb(payload, clientStack);
                            } catch (e) {
                                errors.push(e);
                            }
                        }
                    }
                    if (wildcardListeners.size > 0) {
                        const wrapped = {
                            event,
                            payload
                        };
                        for (const cb of wildcardListeners){
                            try {
                                cb(wrapped, clientStack);
                            } catch (e) {
                                errors.push(e);
                            }
                        }
                    }
                    if (errors.length > 0) {
                        if (errors.length === 1) {
                            throw errors[0];
                        } else {
                            for (const error of errors){
                                console.error(error);
                            }
                            throw new AggregateError(errors, "Errors occurred during event emission");
                        }
                    }
                });
            },
            subscribe (callback) {
                subscribers.add(callback);
                return ()=>subscribers.delete(callback);
            },
            notifySubscribers () {
                for (const cb of subscribers){
                    try {
                        cb();
                    } catch (e) {
                        console.error("NotificationManager: subscriber callback error", e);
                    }
                }
            }
        };
    }, []);
});
}),
"[project]/packages/store/src/utils/tap-assistant-context.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapAssistantClientRef",
    ()=>tapAssistantClientRef,
    "tapAssistantEmit",
    ()=>tapAssistantEmit,
    "withAssistantTapContextProvider",
    ()=>withAssistantTapContextProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect-event.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-client-stack-context.ts [app-ssr] (ecmascript)");
;
;
const AssistantTapContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createResourceContext"])(null);
const withAssistantTapContextProvider = (value, fn)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withContextProvider"])(AssistantTapContext, value, fn);
};
const tapAssistantTapContext = ()=>{
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tap"])(AssistantTapContext);
    if (!ctx) throw new Error("AssistantTapContext is not available");
    return ctx;
};
const tapAssistantClientRef = ()=>{
    return tapAssistantTapContext().clientRef;
};
const tapAssistantEmit = ()=>{
    const { emit } = tapAssistantTapContext();
    const clientStack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientStack"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffectEvent"])((event, payload)=>{
        emit(event, payload, clientStack);
    });
};
}),
"[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssistantClientResource",
    ()=>AssistantClientResource,
    "useAui",
    ()=>useAui
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$react$2f$use$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/react/use-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resources$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-resources.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect-event.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-ref.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$store$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/store-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$split$2d$clients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/split-clients.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$types$2f$events$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/types/events.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$notification$2d$manager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/notification-manager.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-client-stack-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/proxied-assistant-state.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
const RootClientResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ element, emit, clientRef })=>{
    const { methods, state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withAssistantTapContextProvider"])({
        clientRef,
        emit
    }, ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientResource"])(element));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            state,
            methods
        }), [
        methods,
        state
    ]);
});
const RootClientAccessorResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ element, notifications, clientRef, name })=>{
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$store$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StoreResource"])(RootClientResource({
        element,
        emit: notifications.emit,
        clientRef
    })));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        return store.subscribe(notifications.notifySubscribers);
    }, [
        store,
        notifications
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        const clientFunction = ()=>store.getValue().methods;
        Object.defineProperties(clientFunction, {
            source: {
                value: "root",
                writable: false
            },
            query: {
                value: {},
                writable: false
            },
            name: {
                value: name,
                configurable: true
            }
        });
        return clientFunction;
    }, [
        store,
        name
    ]);
});
const NoOpRootClientsAccessorsResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            clients: [],
            subscribe: undefined,
            on: undefined
        }), []);
});
const RootClientsAccessorsResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ clients: inputClients, clientRef })=>{
    const notifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$notification$2d$manager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NotificationManager"])());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>clientRef.parent.subscribe(notifications.notifySubscribers), [
        clientRef,
        notifications
    ]);
    const results = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resources$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapResources"])(()=>Object.keys(inputClients).map((key)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withKey"])(key, RootClientAccessorResource({
                element: inputClients[key],
                notifications,
                clientRef,
                name: key
            }))), [
        inputClients,
        notifications,
        clientRef
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        return {
            clients: results,
            subscribe: notifications.subscribe,
            on: function(selector, callback) {
                if (!this) {
                    throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
                }
                const { scope, event } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$types$2f$events$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeEventSelector"])(selector);
                if (scope !== "*") {
                    const source = this[scope].source;
                    if (source === null) {
                        throw new Error(`Scope "${scope}" is not available. Use { scope: "*", event: "${event}" } to listen globally.`);
                    }
                }
                const localUnsub = notifications.on(event, (payload, clientStack)=>{
                    if (scope === "*") {
                        callback(payload);
                        return;
                    }
                    const scopeClient = this[scope]();
                    const index = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getClientIndex"])(scopeClient);
                    if (scopeClient === clientStack[index]) {
                        callback(payload);
                    }
                });
                if (scope !== "*" && clientRef.parent[scope].source === null) return localUnsub;
                const parentUnsub = clientRef.parent.on(selector, callback);
                return ()=>{
                    localUnsub();
                    parentUnsub();
                };
            }
        };
    }, [
        results,
        notifications,
        clientRef
    ]);
});
const getMeta = (props, clientRef, memo)=>{
    if ("source" in props && "query" in props) return props;
    if (memo.dep === props) return memo.meta;
    const meta = props.getMeta(clientRef.current);
    memo.meta = meta;
    memo.dep = props;
    return meta;
};
const DerivedClientAccessorResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ element, clientRef, name })=>{
    const get = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffectEvent"])(()=>element.props);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        const clientFunction = ()=>get().get(clientRef.current);
        const metaMemo = {};
        Object.defineProperties(clientFunction, {
            source: {
                get: ()=>getMeta(get(), clientRef, metaMemo).source
            },
            query: {
                get: ()=>getMeta(get(), clientRef, metaMemo).query
            },
            name: {
                value: name,
                configurable: true
            }
        });
        return clientFunction;
    }, [
        clientRef,
        name
    ]);
});
const DerivedClientsAccessorsResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ clients, clientRef })=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resources$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapResources"])(()=>Object.keys(clients).map((key)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withKey"])(key, DerivedClientAccessorResource({
                element: clients[key],
                clientRef,
                name: key
            }))), [
        clients,
        clientRef
    ]);
});
const AssistantClientResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ parent, clients })=>{
    const { rootClients, derivedClients } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$split$2d$clients$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapSplitClients"])(clients, parent);
    const clientRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapRef"])({
        parent: parent,
        current: null
    }).current;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        // if (clientRef.current && clientRef.current !== client)
        //   throw new Error("clientRef.current !== client");
        clientRef.current = client;
    });
    const rootFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapResource"])(Object.keys(rootClients).length > 0 ? RootClientsAccessorsResource({
        clients: rootClients,
        clientRef
    }) : NoOpRootClientsAccessorsResource());
    const derivedFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])(DerivedClientsAccessorsResource({
        clients: derivedClients,
        clientRef
    }));
    const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        // Swap DefaultAssistantClient -> createRootAssistantClient at root to change error message
        const proto = parent === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultAssistantClient"] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createRootAssistantClient"])() : parent;
        const client = Object.create(proto);
        Object.assign(client, {
            subscribe: rootFields.subscribe ?? parent.subscribe,
            on: rootFields.on ?? parent.on,
            [__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROXIED_ASSISTANT_STATE_SYMBOL"]]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createProxiedAssistantState"])(client)
        });
        for (const field of rootFields.clients){
            client[field.name] = field;
        }
        for (const field of derivedFields){
            client[field.name] = field;
        }
        return client;
    }, [
        parent,
        rootFields,
        derivedFields
    ]);
    if (clientRef.current === null) {
        clientRef.current = client;
    }
    return client;
});
function useAui(clients, { parent } = {
    parent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAssistantContextValue"])()
}) {
    if (clients) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$react$2f$use$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useResource"])(AssistantClientResource({
            parent: parent ?? __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultAssistantClient"],
            clients
        }));
    }
    if (parent === null) throw new Error("received null parent, this usage is not allowed");
    return parent;
}
}),
"[project]/packages/store/src/tap-client-lookup.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapClientLookup",
    ()=>tapClientLookup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resources$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-resources.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$wrapper$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/wrapper-resource.ts [app-ssr] (ecmascript)");
;
;
;
const ClientResourceWithKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$wrapper$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wrapperResource"])((el)=>{
    if (el.key === undefined) {
        throw new Error("tapClientResource: Element has no key");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClientResource"])(el));
});
function tapClientLookup(getElements, getElementsDeps) {
    const resources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resources$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapResources"])(()=>getElements().map((el)=>ClientResourceWithKey(el)), // biome-ignore lint/correctness/useExhaustiveDependencies: getElementsDeps is passed through from caller
    getElementsDeps);
    const keys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>Object.keys(resources), [
        resources
    ]);
    // For arrays, track element key -> index mapping
    const keyToIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        return resources.reduce((acc, resource, index)=>{
            acc[resource.key] = index;
            return acc;
        }, {});
    }, [
        resources
    ]);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        return resources.map((r)=>r.state);
    }, [
        resources
    ]);
    return {
        state,
        get: (lookup)=>{
            if ("index" in lookup) {
                if (lookup.index < 0 || lookup.index >= keys.length) {
                    throw new Error(`tapClientLookup: Index ${lookup.index} out of bounds (length: ${keys.length})`);
                }
                return resources[lookup.index].methods;
            }
            const index = keyToIndex[lookup.key];
            if (index === undefined) {
                throw new Error(`tapClientLookup: Key "${lookup.key}" not found`);
            }
            return resources[index].methods;
        }
    };
}
}),
"[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapSubscribable",
    ()=>tapSubscribable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
;
const tapSubscribable = (subscribable)=>{
    const [, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(subscribable.getState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        setState(subscribable.getState());
        return subscribable.subscribe(()=>{
            setState(subscribable.getState());
        });
    }, [
        subscribable
    ]);
    return subscribable.getState();
};
}),
"[project]/packages/react/src/legacy-runtime/client/thread-list-item-runtime-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemClient",
    ()=>ThreadListItemClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-ssr] (ecmascript)");
;
;
;
const ThreadListItemClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime })=>{
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    const emit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapAssistantEmit"])();
    // Bind thread list item events to event manager
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        const unsubscribers = [];
        // Subscribe to thread list item events
        const threadListItemEvents = [
            "switchedTo",
            "switchedAway"
        ];
        for (const event of threadListItemEvents){
            const unsubscribe = runtime.unstable_on(event, ()=>{
                emit(`threadListItem.${event}`, {
                    threadId: runtime.getState().id
                });
            });
            unsubscribers.push(unsubscribe);
        }
        return ()=>{
            for (const unsub of unsubscribers)unsub();
        };
    }, [
        runtime,
        emit
    ]);
    return {
        state,
        methods: {
            getState: ()=>state,
            switchTo: runtime.switchTo,
            rename: runtime.rename,
            archive: runtime.archive,
            unarchive: runtime.unarchive,
            delete: runtime.delete,
            generateTitle: runtime.generateTitle,
            initialize: runtime.initialize,
            detach: runtime.detach,
            __internal_getRuntime: ()=>runtime
        }
    };
});
}),
"[project]/packages/react/src/legacy-runtime/client/attachment-runtime-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentRuntimeClient",
    ()=>AttachmentRuntimeClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-ssr] (ecmascript)");
;
;
const AttachmentRuntimeClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime })=>{
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    return {
        state,
        methods: {
            getState: ()=>state,
            remove: runtime.remove,
            __internal_getRuntime: ()=>runtime
        }
    };
});
}),
"[project]/packages/react/src/legacy-runtime/client/composer-runtime-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerClient",
    ()=>ComposerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-lookup.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$attachment$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/attachment-runtime-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-ssr] (ecmascript)");
;
;
;
;
const ComposerAttachmentClientByIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime, index })=>{
    const attachmentRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>runtime.getAttachmentByIndex(index), [
        runtime,
        index
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$attachment$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AttachmentRuntimeClient"])({
        runtime: attachmentRuntime
    }));
});
const ComposerClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ threadIdRef, messageIdRef, runtime })=>{
    const runtimeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    const emit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapAssistantEmit"])();
    // Bind composer events to event manager
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        const unsubscribers = [];
        // Subscribe to composer events
        const composerEvents = [
            "send",
            "attachmentAdd"
        ];
        for (const event of composerEvents){
            const unsubscribe = runtime.unstable_on(event, ()=>{
                emit(`composer.${event}`, {
                    threadId: threadIdRef.current,
                    ...messageIdRef && {
                        messageId: messageIdRef.current
                    }
                });
            });
            unsubscribers.push(unsubscribe);
        }
        return ()=>{
            for (const unsub of unsubscribers)unsub();
        };
    }, [
        runtime,
        emit,
        threadIdRef,
        messageIdRef
    ]);
    const attachments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>runtimeState.attachments.map((attachment, idx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withKey"])(attachment.id, ComposerAttachmentClientByIndex({
                runtime,
                index: idx
            }))), [
        runtimeState.attachments,
        runtime
    ]);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        return {
            text: runtimeState.text,
            role: runtimeState.role,
            attachments: attachments.state,
            runConfig: runtimeState.runConfig,
            isEditing: runtimeState.isEditing,
            canCancel: runtimeState.canCancel,
            attachmentAccept: runtimeState.attachmentAccept,
            isEmpty: runtimeState.isEmpty,
            type: runtimeState.type ?? "thread",
            dictation: runtimeState.dictation
        };
    }, [
        runtimeState,
        attachments.state
    ]);
    return {
        state,
        methods: {
            getState: ()=>state,
            setText: runtime.setText,
            setRole: runtime.setRole,
            setRunConfig: runtime.setRunConfig,
            addAttachment: runtime.addAttachment,
            reset: runtime.reset,
            clearAttachments: runtime.clearAttachments,
            send: runtime.send,
            cancel: runtime.cancel,
            beginEdit: runtime.beginEdit ?? (()=>{
                throw new Error("beginEdit is not supported in this runtime");
            }),
            startDictation: runtime.startDictation,
            stopDictation: runtime.stopDictation,
            attachment: (selector)=>{
                if ("id" in selector) {
                    return attachments.get({
                        key: selector.id
                    });
                } else {
                    return attachments.get(selector);
                }
            },
            __internal_getRuntime: ()=>runtime
        }
    };
});
}),
"[project]/packages/react/src/legacy-runtime/client/message-part-runtime-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartClient",
    ()=>MessagePartClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-ssr] (ecmascript)");
;
;
const MessagePartClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime })=>{
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    return {
        state,
        methods: {
            getState: ()=>state,
            addToolResult: (result)=>runtime.addToolResult(result),
            resumeToolCall: (payload)=>runtime.resumeToolCall(payload),
            __internal_getRuntime: ()=>runtime
        }
    };
});
}),
"[project]/packages/react/src/legacy-runtime/client/message-runtime-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageClient",
    ()=>MessageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-lookup.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$composer$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/composer-runtime-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$message$2d$part$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/message-part-runtime-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$attachment$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/attachment-runtime-client.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const MessageAttachmentClientByIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime, index })=>{
    const attachmentRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>runtime.getAttachmentByIndex(index), [
        runtime,
        index
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$attachment$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AttachmentRuntimeClient"])({
        runtime: attachmentRuntime
    }));
});
const MessagePartByIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime, index })=>{
    const partRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>runtime.getMessagePartByIndex(index), [
        runtime,
        index
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$message$2d$part$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartClient"])({
        runtime: partRuntime
    }));
});
const MessageClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime, threadIdRef })=>{
    const runtimeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    const [isCopiedState, setIsCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(false);
    const [isHoveringState, setIsHovering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(false);
    const messageIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            get current () {
                return runtime.getState().id;
            }
        }), [
        runtime
    ]);
    const composer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$composer$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerClient"])({
        runtime: runtime.composer,
        threadIdRef,
        messageIdRef
    }));
    const parts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>runtimeState.content.map((part, idx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withKey"])("toolCallId" in part && part.toolCallId != null ? `toolCallId-${part.toolCallId}` : `index-${idx}`, MessagePartByIndex({
                runtime,
                index: idx
            }))), [
        runtimeState.content,
        runtime
    ]);
    const attachments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>(runtimeState.attachments ?? []).map((attachment, idx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withKey"])(attachment.id, MessageAttachmentClientByIndex({
                runtime,
                index: idx
            }))), [
        runtimeState.attachments,
        runtime
    ]);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        return {
            ...runtimeState,
            parts: parts.state,
            composer: composer.state,
            isCopied: isCopiedState,
            isHovering: isHoveringState
        };
    }, [
        runtimeState,
        parts.state,
        composer.state,
        isCopiedState,
        isHoveringState
    ]);
    return {
        state,
        methods: {
            getState: ()=>state,
            composer: composer.methods,
            reload: (config)=>runtime.reload(config),
            speak: ()=>runtime.speak(),
            stopSpeaking: ()=>runtime.stopSpeaking(),
            submitFeedback: (feedback)=>runtime.submitFeedback(feedback),
            switchToBranch: (options)=>runtime.switchToBranch(options),
            getCopyText: ()=>runtime.unstable_getCopyText(),
            part: (selector)=>{
                if ("index" in selector) {
                    return parts.get({
                        index: selector.index
                    });
                } else {
                    return parts.get({
                        key: `toolCallId-${selector.toolCallId}`
                    });
                }
            },
            attachment: (selector)=>{
                if ("id" in selector) {
                    return attachments.get({
                        key: selector.id
                    });
                } else {
                    return attachments.get(selector);
                }
            },
            setIsCopied,
            setIsHovering,
            __internal_getRuntime: ()=>runtime
        }
    };
});
}),
"[project]/packages/react/src/legacy-runtime/client/thread-runtime-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadClient",
    ()=>ThreadClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-lookup.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$composer$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/composer-runtime-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$message$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/message-runtime-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const MessageClientById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime, id, threadIdRef })=>{
    const messageRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>runtime.getMessageById(id), [
        runtime,
        id
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$message$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessageClient"])({
        runtime: messageRuntime,
        threadIdRef
    }));
});
const ThreadClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime })=>{
    const runtimeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    const emit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapAssistantEmit"])();
    // Bind thread events to event manager
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        const unsubscribers = [];
        // Subscribe to thread events
        const threadEvents = [
            "runStart",
            "runEnd",
            "initialize",
            "modelContextUpdate"
        ];
        for (const event of threadEvents){
            const unsubscribe = runtime.unstable_on(event, ()=>{
                const threadId = runtime.getState()?.threadId || "unknown";
                emit(`thread.${event}`, {
                    threadId
                });
            });
            unsubscribers.push(unsubscribe);
        }
        return ()=>{
            for (const unsub of unsubscribers)unsub();
        };
    }, [
        runtime,
        emit
    ]);
    const threadIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            get current () {
                return runtime.getState().threadId;
            }
        }), [
        runtime
    ]);
    const composer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$composer$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerClient"])({
        runtime: runtime.composer,
        threadIdRef
    }));
    const messages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>runtimeState.messages.map((m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withKey"])(m.id, MessageClientById({
                runtime,
                id: m.id,
                threadIdRef
            }))), [
        runtimeState.messages,
        runtime,
        threadIdRef
    ]);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        return {
            isEmpty: messages.state.length === 0 && !runtimeState.isLoading,
            isDisabled: runtimeState.isDisabled,
            isLoading: runtimeState.isLoading,
            isRunning: runtimeState.isRunning,
            capabilities: runtimeState.capabilities,
            state: runtimeState.state,
            suggestions: runtimeState.suggestions,
            extras: runtimeState.extras,
            speech: runtimeState.speech,
            composer: composer.state,
            messages: messages.state
        };
    }, [
        runtimeState,
        messages,
        composer.state
    ]);
    return {
        state,
        methods: {
            getState: ()=>state,
            composer: composer.methods,
            append: runtime.append,
            startRun: runtime.startRun,
            unstable_resumeRun: runtime.unstable_resumeRun,
            cancelRun: runtime.cancelRun,
            getModelContext: runtime.getModelContext,
            export: runtime.export,
            import: runtime.import,
            reset: runtime.reset,
            stopSpeaking: runtime.stopSpeaking,
            startVoice: async ()=>{
                throw new Error("startVoice is not supported in this runtime");
            },
            stopVoice: async ()=>{
                throw new Error("stopVoice is not supported in this runtime");
            },
            message: (selector)=>{
                if ("id" in selector) {
                    return messages.get({
                        key: selector.id
                    });
                } else {
                    return messages.get(selector);
                }
            },
            __internal_getRuntime: ()=>runtime
        }
    };
});
}),
"[project]/packages/react/src/legacy-runtime/client/thread-list-runtime-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListClient",
    ()=>ThreadListClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-lookup.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$item$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/thread-list-item-runtime-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/thread-runtime-client.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const ThreadListItemClientById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime, id })=>{
    const threadListItemRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>runtime.getItemById(id), [
        runtime,
        id
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$item$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemClient"])({
        runtime: threadListItemRuntime
    }));
});
const ThreadListClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ runtime, __internal_assistantRuntime })=>{
    const runtimeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    const main = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadClient"])({
        runtime: runtime.main
    }));
    const threadItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>Object.keys(runtimeState.threadItems).map((id)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withKey"])(id, ThreadListItemClientById({
                runtime,
                id
            }))), [
        runtimeState.threadItems,
        runtime
    ]);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        return {
            mainThreadId: runtimeState.mainThreadId,
            newThreadId: runtimeState.newThreadId ?? null,
            isLoading: runtimeState.isLoading,
            threadIds: runtimeState.threadIds,
            archivedThreadIds: runtimeState.archivedThreadIds,
            threadItems: threadItems.state,
            main: main.state
        };
    }, [
        runtimeState,
        threadItems.state,
        main.state
    ]);
    return {
        state,
        methods: {
            getState: ()=>state,
            thread: ()=>main.methods,
            item: (threadIdOrOptions)=>{
                if (threadIdOrOptions === "main") {
                    return threadItems.get({
                        key: state.mainThreadId
                    });
                }
                if ("id" in threadIdOrOptions) {
                    return threadItems.get({
                        key: threadIdOrOptions.id
                    });
                }
                const { index, archived = false } = threadIdOrOptions;
                const id = archived ? state.archivedThreadIds[index] : state.threadIds[index];
                return threadItems.get({
                    key: id
                });
            },
            switchToThread: async (threadId)=>{
                await runtime.switchToThread(threadId);
            },
            switchToNewThread: async ()=>{
                await runtime.switchToNewThread();
            },
            __internal_getAssistantRuntime: ()=>__internal_assistantRuntime
        }
    };
});
}),
"[project]/packages/react/src/model-context/model-context-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeModelContexts",
    ()=>mergeModelContexts
]);
const mergeModelContexts = (configSet)=>{
    const configs = Array.from(configSet).map((c)=>c.getModelContext()).sort((a, b)=>(b.priority ?? 0) - (a.priority ?? 0));
    return configs.reduce((acc, config)=>{
        if (config.system) {
            if (acc.system) {
                // TODO should the separator be configurable?
                acc.system += `\n\n${config.system}`;
            } else {
                acc.system = config.system;
            }
        }
        if (config.tools) {
            for (const [name, tool] of Object.entries(config.tools)){
                const existing = acc.tools?.[name];
                if (existing && existing !== tool) {
                    throw new Error(`You tried to define a tool with the name ${name}, but it already exists.`);
                }
                if (!acc.tools) acc.tools = {};
                acc.tools[name] = tool;
            }
        }
        if (config.config) {
            acc.config = {
                ...acc.config,
                ...config.config
            };
        }
        if (config.callSettings) {
            acc.callSettings = {
                ...acc.callSettings,
                ...config.callSettings
            };
        }
        return acc;
    }, {});
};
}),
"[project]/packages/react/src/utils/composite-context-provider.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompositeContextProvider",
    ()=>CompositeContextProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$model$2d$context$2f$model$2d$context$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/model-context/model-context-types.ts [app-ssr] (ecmascript)");
;
class CompositeContextProvider {
    _providers = new Set();
    getModelContext() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$model$2d$context$2f$model$2d$context$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mergeModelContexts"])(this._providers);
    }
    registerModelContextProvider(provider) {
        this._providers.add(provider);
        const unsubscribe = provider.subscribe?.(()=>{
            this.notifySubscribers();
        });
        this.notifySubscribers();
        return ()=>{
            this._providers.delete(provider);
            unsubscribe?.();
            this.notifySubscribers();
        };
    }
    _subscribers = new Set();
    notifySubscribers() {
        for (const callback of this._subscribers)callback();
    }
    subscribe(callback) {
        this._subscribers.add(callback);
        return ()=>this._subscribers.delete(callback);
    }
}
}),
"[project]/packages/react/src/client/model-context-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModelContext",
    ()=>ModelContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$composite$2d$context$2d$provider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/composite-context-provider.ts [app-ssr] (ecmascript)");
;
;
const version = 1;
const ModelContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(()=>{
    const [state] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(()=>({
            version: version + 1
        }));
    const composite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$composite$2d$context$2d$provider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompositeContextProvider"](), []);
    return {
        state,
        methods: {
            getState: ()=>state,
            getModelContext: ()=>composite.getModelContext(),
            subscribe: (callback)=>composite.subscribe(callback),
            register: (provider)=>composite.registerModelContextProvider(provider)
        }
    };
});
}),
"[project]/packages/react/src/client/tools.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tools",
    ()=>Tools
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-callback.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/attach-default-peers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$model$2d$context$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/client/model-context-client.ts [app-ssr] (ecmascript)");
;
;
;
const Tools = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ toolkit })=>{
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(()=>({
            tools: {}
        }));
    const clientRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapAssistantClientRef"])();
    const setToolUI = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapCallback"])((toolName, render)=>{
        setState((prev)=>{
            return {
                ...prev,
                tools: {
                    ...prev.tools,
                    [toolName]: [
                        ...prev.tools[toolName] ?? [],
                        render
                    ]
                }
            };
        });
        return ()=>{
            setState((prev)=>{
                return {
                    ...prev,
                    tools: {
                        ...prev.tools,
                        [toolName]: prev.tools[toolName]?.filter((r)=>r !== render) ?? []
                    }
                };
            });
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        if (!toolkit) return;
        const unsubscribes = [];
        // Register tool UIs (exclude symbols)
        for (const [toolName, tool] of Object.entries(toolkit)){
            if (tool.render) {
                unsubscribes.push(setToolUI(toolName, tool.render));
            }
        }
        // Register tools with model context (exclude symbols)
        const toolsWithoutRender = Object.entries(toolkit).reduce((acc, [name, tool])=>{
            const { render, ...rest } = tool;
            acc[name] = rest;
            return acc;
        }, {});
        const modelContextProvider = {
            getModelContext: ()=>({
                    tools: toolsWithoutRender
                })
        };
        unsubscribes.push(clientRef.current.modelContext().register(modelContextProvider));
        return ()=>{
            unsubscribes.forEach((fn)=>fn());
        };
    }, [
        toolkit,
        setToolUI,
        clientRef
    ]);
    return {
        state,
        methods: {
            getState: ()=>state,
            setToolUI
        }
    };
});
(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["attachDefaultPeers"])(Tools, {
    modelContext: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$model$2d$context$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ModelContext"])()
});
}),
"[project]/packages/react/src/client/suggestions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Suggestions",
    ()=>Suggestions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-lookup.ts [app-ssr] (ecmascript)");
;
;
const SuggestionClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])((state)=>{
    return {
        state,
        methods: {
            getState: ()=>state
        }
    };
});
const SuggestionsResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])((suggestions)=>{
    const [state] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapState"])(()=>{
        const normalizedSuggestions = (suggestions ?? []).map((s)=>{
            if (typeof s === "string") {
                return {
                    title: s,
                    label: "",
                    prompt: s
                };
            }
            return {
                title: s.title,
                label: s.label,
                prompt: s.prompt
            };
        });
        return {
            suggestions: normalizedSuggestions
        };
    });
    const suggestionClients = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>state.suggestions.map((suggestion, index)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withKey"])(index, SuggestionClient(suggestion))), [
        state.suggestions
    ]);
    return {
        state,
        methods: {
            getState: ()=>state,
            suggestion: ({ index })=>{
                return suggestionClients.get({
                    index
                });
            }
        }
    };
});
const Suggestions = SuggestionsResource;
}),
"[project]/packages/react/src/legacy-runtime/runtime-adapter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RuntimeAdapter",
    ()=>RuntimeAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/thread-list-runtime-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/attach-default-peers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$model$2d$context$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/client/model-context-client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$tools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/client/tools.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$suggestions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/client/suggestions.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const RuntimeAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])((runtime)=>{
    const clientRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapAssistantClientRef"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        return runtime.registerModelContextProvider(clientRef.current.modelContext());
    }, [
        runtime,
        clientRef
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListClient"])({
        runtime: runtime.threads,
        __internal_assistantRuntime: runtime
    }));
});
(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["attachDefaultPeers"])(RuntimeAdapter, {
    modelContext: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$model$2d$context$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ModelContext"])(),
    tools: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$tools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Tools"])({}),
    suggestions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$suggestions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suggestions"])(),
    threadListItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"])({
        source: "threads",
        query: {
            type: "main"
        },
        get: (aui)=>aui.threads().item("main")
    }),
    thread: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"])({
        source: "threads",
        query: {
            type: "main"
        },
        get: (aui)=>aui.threads().thread("main")
    }),
    composer: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"])({
        source: "thread",
        query: {},
        get: (aui)=>aui.threads().thread("main").composer
    })
});
}),
"[project]/packages/react/src/context/stores/thread-viewport.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeThreadViewportStore",
    ()=>makeThreadViewportStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.11_@types+react@19.2.10_immer@11.1.3_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
"use client";
;
const createSizeRegistry = (onChange)=>{
    const entries = new Map();
    const recalculate = ()=>{
        let total = 0;
        for (const height of entries.values()){
            total += height;
        }
        onChange(total);
    };
    return {
        register: ()=>{
            const id = Symbol();
            entries.set(id, 0);
            return {
                setHeight: (height)=>{
                    if (entries.get(id) !== height) {
                        entries.set(id, height);
                        recalculate();
                    }
                },
                unregister: ()=>{
                    entries.delete(id);
                    recalculate();
                }
            };
        }
    };
};
const makeThreadViewportStore = (options = {})=>{
    const scrollToBottomListeners = new Set();
    const viewportRegistry = createSizeRegistry((total)=>{
        store.setState({
            height: {
                ...store.getState().height,
                viewport: total
            }
        });
    });
    const insetRegistry = createSizeRegistry((total)=>{
        store.setState({
            height: {
                ...store.getState().height,
                inset: total
            }
        });
    });
    const userMessageRegistry = createSizeRegistry((total)=>{
        store.setState({
            height: {
                ...store.getState().height,
                userMessage: total
            }
        });
    });
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(()=>({
            isAtBottom: true,
            scrollToBottom: ({ behavior = "auto" } = {})=>{
                for (const listener of scrollToBottomListeners){
                    listener({
                        behavior
                    });
                }
            },
            onScrollToBottom: (callback)=>{
                scrollToBottomListeners.add(callback);
                return ()=>{
                    scrollToBottomListeners.delete(callback);
                };
            },
            turnAnchor: options.turnAnchor ?? "bottom",
            height: {
                viewport: 0,
                inset: 0,
                userMessage: 0
            },
            registerViewport: viewportRegistry.register,
            registerContentInset: insetRegistry.register,
            registerUserMessageHeight: userMessageRegistry.register
        }));
    return store;
};
}),
"[project]/packages/react/src/context/react/utils/create-context-hook.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createContextHook",
    ()=>createContextHook
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function createContextHook(context, providerName) {
    function useContextHook(options) {
        const contextValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(context);
        if (!options?.optional && !contextValue) {
            throw new Error(`This component must be used within ${providerName}.`);
        }
        return contextValue;
    }
    return useContextHook;
}
}),
"[project]/packages/react/src/context/react/utils/create-context-store-hook.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createContextStoreHook",
    ()=>createContextStoreHook
]);
function createContextStoreHook(contextHook, contextKey) {
    function useStoreStoreHook(options) {
        const context = contextHook(options);
        if (!context) return null;
        return context[contextKey];
    }
    function useStoreHook(param) {
        let optional = false;
        let selector;
        if (typeof param === "function") {
            selector = param;
        } else if (param && typeof param === "object") {
            optional = !!param.optional;
            selector = param.selector;
        }
        const store = useStoreStoreHook({
            optional
        });
        if (!store) return null;
        return selector ? store(selector) : store();
    }
    // Return an object with keys based on contextKey
    return {
        [contextKey]: useStoreHook,
        [`${contextKey}Store`]: useStoreStoreHook
    };
}
}),
"[project]/packages/react/src/context/react/thread-viewport-context.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadViewportContext",
    ()=>ThreadViewportContext,
    "useThreadViewport",
    ()=>useThreadViewport,
    "useThreadViewportStore",
    ()=>useThreadViewportStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$hook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/utils/create-context-hook.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$store$2d$hook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/utils/create-context-store-hook.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const ThreadViewportContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const useThreadViewportContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$hook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContextHook"])(ThreadViewportContext, "ThreadPrimitive.Viewport");
const { useThreadViewport, useThreadViewportStore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$store$2d$hook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContextStoreHook"])(useThreadViewportContext, "useThreadViewport");
}),
"[project]/packages/react/src/context/readonly-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "writableStore",
    ()=>writableStore
]);
const writableStore = (store)=>{
    return store;
};
}),
"[project]/packages/react/src/context/providers/thread-viewport-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveViewportProvider",
    ()=>ThreadPrimitiveViewportProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$stores$2f$thread$2d$viewport$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/stores/thread-viewport.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/readonly-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const useThreadViewportStoreValue = (options)=>{
    const outerViewport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewportStore"])({
        optional: true
    });
    const [store] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$stores$2f$thread$2d$viewport$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeThreadViewportStore"])(options));
    // Forward scrollToBottom from outer viewport to inner viewport
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return outerViewport?.getState().onScrollToBottom(()=>{
            store.getState().scrollToBottom();
        });
    }, [
        outerViewport,
        store
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!outerViewport) return;
        return store.subscribe((state)=>{
            if (outerViewport.getState().isAtBottom !== state.isAtBottom) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writableStore"])(outerViewport).setState({
                    isAtBottom: state.isAtBottom
                });
            }
        });
    }, [
        store,
        outerViewport
    ]);
    // Sync options to store when they change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const nextState = {
            turnAnchor: options.turnAnchor ?? "bottom"
        };
        const currentState = store.getState();
        if (currentState.turnAnchor !== nextState.turnAnchor) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writableStore"])(store).setState(nextState);
        }
    }, [
        store,
        options.turnAnchor
    ]);
    return store;
};
const ThreadPrimitiveViewportProvider = ({ children, options = {} })=>{
    const useThreadViewport = useThreadViewportStoreValue(options);
    const [context] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        return {
            useThreadViewport
        };
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadViewportContext"].Provider, {
        value: context,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/thread-viewport-provider.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/packages/react/src/legacy-runtime/assistant-runtime-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssistantRuntimeProvider",
    ()=>AssistantRuntimeProvider,
    "AssistantRuntimeProviderImpl",
    ()=>AssistantRuntimeProviderImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-adapter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/thread-viewport-provider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const getRenderComponent = (runtime)=>{
    return runtime._core?.RenderComponent;
};
const AssistantRuntimeProviderImpl = ({ children, aui: parent = null, runtime })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])({
        threads: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RuntimeAdapter"])(runtime)
    }, {
        parent: parent
    });
    // useEffect(() => {
    //   if (process.env["NODE_ENV"] === "production") return;
    //   return DevToolsProviderApi.register(aui);
    // }, [aui]);
    const RenderComponent = getRenderComponent(runtime);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: [
            RenderComponent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RenderComponent, {}, void 0, false, {
                fileName: "[project]/packages/react/src/legacy-runtime/assistant-runtime-provider.tsx",
                lineNumber: 43,
                columnNumber: 27
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportProvider"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/packages/react/src/legacy-runtime/assistant-runtime-provider.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/packages/react/src/legacy-runtime/assistant-runtime-provider.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const AssistantRuntimeProvider = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(AssistantRuntimeProviderImpl);
}),
"[project]/packages/react/src/primitives/attachment/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
}),
"[project]/packages/react/src/primitives/attachment/attachment-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentPrimitiveRoot",
    ()=>AttachmentPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const AttachmentPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/attachment/attachment-root.tsx",
        lineNumber: 35,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
AttachmentPrimitiveRoot.displayName = "AttachmentPrimitive.Root";
}),
"[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuiState",
    ()=>useAuiState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/proxied-assistant-state.tsx [app-ssr] (ecmascript)");
;
;
;
const useAuiState = (selector)=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const proxiedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProxiedAssistantState"])(aui);
    const slice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(aui.subscribe, ()=>selector(proxiedState), ()=>selector(proxiedState));
    if (slice === proxiedState) {
        throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDebugValue"])(slice);
    return slice;
};
}),
"[project]/packages/react/src/primitives/attachment/attachment-thumb.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentPrimitiveThumb",
    ()=>AttachmentPrimitiveThumb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AttachmentPrimitiveThumb = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const ext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ attachment })=>{
        const parts = attachment.name.split(".");
        return parts.length > 1 ? parts.pop() : "";
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref: ref,
        children: [
            ".",
            ext
        ]
    }, void 0, true, {
        fileName: "[project]/packages/react/src/primitives/attachment/attachment-thumb.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
AttachmentPrimitiveThumb.displayName = "AttachmentPrimitive.Thumb";
}),
"[project]/packages/react/src/primitives/attachment/attachment-name.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentPrimitiveName",
    ()=>AttachmentPrimitiveName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
;
const AttachmentPrimitiveName = ()=>{
    const name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ attachment })=>attachment.name);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: name
    }, void 0, false);
};
AttachmentPrimitiveName.displayName = "AttachmentPrimitive.Name";
}),
"[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createActionButton",
    ()=>createActionButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
;
;
;
;
const createActionButton = (displayName, useActionButton, forwardProps = [])=>{
    const ActionButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, forwardedRef)=>{
        const forwardedProps = {};
        const primitiveProps = {};
        Object.keys(props).forEach((key)=>{
            if (forwardProps.includes(key)) {
                forwardedProps[key] = props[key];
            } else {
                primitiveProps[key] = props[key];
            }
        });
        const callback = useActionButton(forwardedProps) ?? undefined;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
            type: "button",
            ...primitiveProps,
            ref: forwardedRef,
            disabled: primitiveProps.disabled || !callback,
            onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(primitiveProps.onClick, callback)
        }, void 0, false, {
            fileName: "[project]/packages/react/src/utils/create-action-button.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    });
    ActionButton.displayName = displayName;
    return ActionButton;
};
}),
"[project]/packages/react/src/primitives/attachment/attachment-remove.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentPrimitiveRemove",
    ()=>AttachmentPrimitiveRemove
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const useAttachmentRemove = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const handleRemoveAttachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.attachment().remove();
    }, [
        aui
    ]);
    return handleRemoveAttachment;
};
const AttachmentPrimitiveRemove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("AttachmentPrimitive.Remove", useAttachmentRemove);
}),
"[project]/packages/react/src/primitives/attachment/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Name",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$name$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AttachmentPrimitiveName"],
    "Remove",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$remove$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AttachmentPrimitiveRemove"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AttachmentPrimitiveRoot"],
    "unstable_Thumb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$thumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AttachmentPrimitiveThumb"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/attachment-root.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$thumb$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/attachment-thumb.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$name$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/attachment-name.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$remove$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/attachment-remove.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/attachment/index.ts [app-ssr] (ecmascript) <export * as AttachmentPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/composer/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/packages/react/src/primitives/composer/composer-send.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveSend",
    ()=>ComposerPrimitiveSend,
    "useComposerSend",
    ()=>useComposerSend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const useComposerSend = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])((s)=>s.thread.isRunning || !s.composer.isEditing || s.composer.isEmpty);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.composer().send();
    }, [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
const ComposerPrimitiveSend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.Send", useComposerSend);
}),
"[project]/packages/react/src/primitives/composer/composer-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveRoot",
    ()=>ComposerPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$send$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-send.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const ComposerPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ onSubmit, ...rest }, forwardedRef)=>{
    const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$send$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposerSend"])();
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!send) return;
        send();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].form, {
        ...rest,
        ref: forwardedRef,
        onSubmit: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onSubmit, handleSubmit)
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/composer/composer-root.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ComposerPrimitiveRoot.displayName = "ComposerPrimitive.Root";
}),
"[project]/packages/react/src/utils/hooks/use-on-scroll-to-bottom.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOnScrollToBottom",
    ()=>useOnScrollToBottom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const useOnScrollToBottom = (callback)=>{
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallbackRef"])(callback);
    const onScrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewport"])((vp)=>vp.onScrollToBottom);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return onScrollToBottom(callbackRef);
    }, [
        onScrollToBottom,
        callbackRef
    ]);
};
}),
"[project]/packages/react/src/primitives/composer/composer-input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveInput",
    ()=>ComposerPrimitiveInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$textarea$2d$autosize$40$8$2e$5$2e$9_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f$react$2d$textarea$2d$autosize$2f$dist$2f$react$2d$textarea$2d$autosize$2e$development$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-textarea-autosize@8.5.9_@types+react@19.2.10_react@19.2.4/node_modules/react-textarea-autosize/dist/react-textarea-autosize.development.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-escape-keydown@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-on-scroll-to-bottom.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/scheduler.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
const ComposerPrimitiveInput = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ autoFocus = false, asChild, disabled: disabledProp, onChange, onKeyDown, onPaste, submitOnEnter = true, cancelOnEscape = true, unstable_focusOnRunStart = true, unstable_focusOnScrollToBottom = true, unstable_focusOnThreadSwitched = true, addAttachmentOnPaste = true, ...rest }, forwardedRef)=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ composer })=>{
        if (!composer.isEditing) return "";
        return composer.text;
    });
    const Component = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$textarea$2d$autosize$40$8$2e$5$2e$9_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f$react$2d$textarea$2d$autosize$2f$dist$2f$react$2d$textarea$2d$autosize$2e$development$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
    const isDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ thread, composer })=>thread.isDisabled || composer.dictation?.inputDisabled) || disabledProp;
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, textareaRef);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEscapeKeydown"])((e)=>{
        if (!cancelOnEscape) return;
        // Only handle ESC if it originated from within this input
        if (!textareaRef.current?.contains(e.target)) return;
        const composer = aui.composer();
        if (composer.getState().canCancel) {
            composer.cancel();
            e.preventDefault();
        }
    });
    const handleKeyPress = (e)=>{
        if (isDisabled || !submitOnEnter) return;
        // ignore IME composition events
        if (e.nativeEvent.isComposing) return;
        if (e.key === "Enter" && e.shiftKey === false) {
            const isRunning = aui.thread().getState().isRunning;
            if (!isRunning) {
                e.preventDefault();
                textareaRef.current?.closest("form")?.requestSubmit();
            }
        }
    };
    const handlePaste = async (e)=>{
        if (!addAttachmentOnPaste) return;
        const threadCapabilities = aui.thread().getState().capabilities;
        const files = Array.from(e.clipboardData?.files || []);
        if (threadCapabilities.attachments && files.length > 0) {
            try {
                e.preventDefault();
                await Promise.all(files.map((file)=>aui.composer().addAttachment(file)));
            } catch (error) {
                console.error("Error adding attachment:", error);
            }
        }
    };
    const autoFocusEnabled = autoFocus && !isDisabled;
    const focus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const textarea = textareaRef.current;
        if (!textarea || !autoFocusEnabled) return;
        textarea.focus({
            preventScroll: true
        });
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }, [
        autoFocusEnabled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>focus(), [
        focus
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOnScrollToBottom"])(()=>{
        if (aui.composer().getState().type === "thread" && unstable_focusOnScrollToBottom) {
            focus();
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (aui.composer().getState().type !== "thread" || !unstable_focusOnRunStart) return undefined;
        return aui.on("thread.runStart", focus);
    }, [
        unstable_focusOnRunStart,
        focus,
        aui
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (aui.composer().getState().type !== "thread" || !unstable_focusOnThreadSwitched) return undefined;
        return aui.on("threadListItem.switchedTo", focus);
    }, [
        unstable_focusOnThreadSwitched,
        focus,
        aui
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        name: "input",
        value: value,
        ...rest,
        ref: ref,
        disabled: isDisabled,
        onChange: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onChange, (e)=>{
            if (!aui.composer().getState().isEditing) return;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["flushResourcesSync"])(()=>{
                aui.composer().setText(e.target.value);
            });
        }),
        onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onKeyDown, handleKeyPress),
        onPaste: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onPaste, handlePaste)
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/composer/composer-input.tsx",
        lineNumber: 206,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
ComposerPrimitiveInput.displayName = "ComposerPrimitive.Input";
}),
"[project]/packages/react/src/primitives/composer/composer-cancel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveCancel",
    ()=>ComposerPrimitiveCancel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const useComposerCancel = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ composer })=>!composer.canCancel);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.composer().cancel();
    }, [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
const ComposerPrimitiveCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.Cancel", useComposerCancel);
}),
"[project]/packages/react/src/primitives/composer/composer-add-attachment.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveAddAttachment",
    ()=>ComposerPrimitiveAddAttachment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const useComposerAddAttachment = ({ multiple = true } = {})=>{
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ composer })=>!composer.isEditing);
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = multiple;
        input.hidden = true;
        const attachmentAccept = aui.composer().getState().attachmentAccept;
        if (attachmentAccept !== "*") {
            input.accept = attachmentAccept;
        }
        document.body.appendChild(input);
        input.onchange = (e)=>{
            const fileList = e.target.files;
            if (!fileList) return;
            for (const file of fileList){
                aui.composer().addAttachment(file);
            }
            document.body.removeChild(input);
        };
        input.oncancel = ()=>{
            if (!input.files || input.files.length === 0) {
                document.body.removeChild(input);
            }
        };
        input.click();
    }, [
        aui,
        multiple
    ]);
    if (disabled) return null;
    return callback;
};
const ComposerPrimitiveAddAttachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.AddAttachment", useComposerAddAttachment, [
    "multiple"
]);
}),
"[project]/packages/react/src/context/providers/attachment-by-index-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerAttachmentByIndexProvider",
    ()=>ComposerAttachmentByIndexProvider,
    "MessageAttachmentByIndexProvider",
    ()=>MessageAttachmentByIndexProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-ssr] (ecmascript)");
"use client";
;
;
const MessageAttachmentByIndexProvider = ({ index, children })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])({
        attachment: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"])({
            source: "message",
            query: {
                type: "index",
                index
            },
            get: (aui)=>aui.message().attachment({
                    index
                })
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/attachment-by-index-provider.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const ComposerAttachmentByIndexProvider = ({ index, children })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])({
        attachment: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"])({
            source: "composer",
            query: {
                type: "index",
                index
            },
            get: (aui)=>aui.composer().attachment({
                    index
                })
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/attachment-by-index-provider.tsx",
        lineNumber: 35,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/packages/react/src/primitives/composer/composer-attachments.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveAttachmentByIndex",
    ()=>ComposerPrimitiveAttachmentByIndex,
    "ComposerPrimitiveAttachments",
    ()=>ComposerPrimitiveAttachments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$attachment$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/attachment-by-index-provider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const getComponent = (components, attachment)=>{
    const type = attachment.type;
    switch(type){
        case "image":
            return components?.Image ?? components?.Attachment;
        case "document":
            return components?.Document ?? components?.Attachment;
        case "file":
            return components?.File ?? components?.Attachment;
        default:
            const _exhaustiveCheck = type;
            throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
    }
};
const AttachmentComponent = ({ components })=>{
    const attachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ attachment })=>attachment);
    if (!attachment) return null;
    const Component = getComponent(components, attachment);
    if (!Component) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {}, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/composer/composer-attachments.tsx",
        lineNumber: 47,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const ComposerPrimitiveAttachmentByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$attachment$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerAttachmentByIndexProvider"], {
        index: index,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AttachmentComponent, {
            components: components
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/composer/composer-attachments.tsx",
            lineNumber: 79,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/composer/composer-attachments.tsx",
        lineNumber: 78,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
}, (prev, next)=>prev.index === next.index && prev.components?.Image === next.components?.Image && prev.components?.Document === next.components?.Document && prev.components?.File === next.components?.File && prev.components?.Attachment === next.components?.Attachment);
ComposerPrimitiveAttachmentByIndex.displayName = "ComposerPrimitive.AttachmentByIndex";
const ComposerPrimitiveAttachments = ({ components })=>{
    const attachmentsCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])((s)=>s.composer.attachments.length);
    const attachmentElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return Array.from({
            length: attachmentsCount
        }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ComposerPrimitiveAttachmentByIndex, {
                index: index,
                components: components
            }, index, false, {
                fileName: "[project]/packages/react/src/primitives/composer/composer-attachments.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)));
    }, [
        attachmentsCount,
        components
    ]);
    return attachmentElements;
};
ComposerPrimitiveAttachments.displayName = "ComposerPrimitive.Attachments";
}),
"[project]/packages/react/src/primitives/composer/composer-attachment-dropzone.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveAttachmentDropzone",
    ()=>ComposerPrimitiveAttachmentDropzone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ComposerPrimitiveAttachmentDropzone = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ disabled, asChild = false, children, ...rest }, ref)=>{
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const handleDragEnterCapture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (disabled) return;
        e.preventDefault();
        setIsDragging(true);
    }, [
        disabled
    ]);
    const handleDragOverCapture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (disabled) return;
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
    }, [
        disabled,
        isDragging
    ]);
    const handleDragLeaveCapture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (disabled) return;
        e.preventDefault();
        const next = e.relatedTarget;
        if (next && e.currentTarget.contains(next)) {
            return;
        }
        setIsDragging(false);
    }, [
        disabled
    ]);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (e)=>{
        if (disabled) return;
        e.preventDefault();
        setIsDragging(false);
        for (const file of e.dataTransfer.files){
            try {
                await aui.composer().addAttachment(file);
            } catch (error) {
                console.error("Failed to add attachment:", error);
            }
        }
    }, [
        disabled,
        aui
    ]);
    const dragProps = {
        onDragEnterCapture: handleDragEnterCapture,
        onDragOverCapture: handleDragOverCapture,
        onDragLeaveCapture: handleDragLeaveCapture,
        onDropCapture: handleDrop
    };
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : "div";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        ...isDragging ? {
            "data-dragging": "true"
        } : null,
        ref: ref,
        ...dragProps,
        ...rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/composer/composer-attachment-dropzone.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ComposerPrimitiveAttachmentDropzone.displayName = "ComposerPrimitive.AttachmentDropzone";
}),
"[project]/packages/react/src/primitives/composer/composer-dictate.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveDictate",
    ()=>ComposerPrimitiveDictate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const useComposerDictate = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ thread, composer })=>composer.dictation != null || !thread.capabilities.dictation || !composer.isEditing);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.composer().startDictation();
    }, [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
const ComposerPrimitiveDictate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.Dictate", useComposerDictate);
}),
"[project]/packages/react/src/primitives/composer/composer-stop-dictation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveStopDictation",
    ()=>ComposerPrimitiveStopDictation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const useComposerStopDictation = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const isDictating = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ composer })=>composer.dictation != null);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.composer().stopDictation();
    }, [
        aui
    ]);
    if (!isDictating) return null;
    return callback;
};
const ComposerPrimitiveStopDictation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.StopDictation", useComposerStopDictation);
}),
"[project]/packages/react/src/primitives/composer/composer-dictation-transcript.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveDictationTranscript",
    ()=>ComposerPrimitiveDictationTranscript
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ComposerPrimitiveDictationTranscript = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ children, ...props }, forwardRef)=>{
    const transcript = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ composer })=>composer.dictation?.transcript);
    if (!transcript) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].span, {
        ...props,
        ref: forwardRef,
        children: children ?? transcript
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/composer/composer-dictation-transcript.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ComposerPrimitiveDictationTranscript.displayName = "ComposerPrimitive.DictationTranscript";
}),
"[project]/packages/react/src/primitives/composer/composer-if.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveIf",
    ()=>ComposerPrimitiveIf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
const useComposerIf = (props)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ composer })=>{
        if (props.editing === true && !composer.isEditing) return false;
        if (props.editing === false && composer.isEditing) return false;
        const isDictating = composer.dictation != null;
        if (props.dictation === true && !isDictating) return false;
        if (props.dictation === false && isDictating) return false;
        return true;
    });
};
const ComposerPrimitiveIf = ({ children, ...query })=>{
    const result = useComposerIf(query);
    return result ? children : null;
};
ComposerPrimitiveIf.displayName = "ComposerPrimitive.If";
}),
"[project]/packages/react/src/primitives/composer/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddAttachment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$add$2d$attachment$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveAddAttachment"],
    "AttachmentByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$attachments$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveAttachmentByIndex"],
    "AttachmentDropzone",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$attachment$2d$dropzone$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveAttachmentDropzone"],
    "Attachments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$attachments$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveAttachments"],
    "Cancel",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$cancel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveCancel"],
    "Dictate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$dictate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveDictate"],
    "DictationTranscript",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$dictation$2d$transcript$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveDictationTranscript"],
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveIf"],
    "Input",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveInput"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveRoot"],
    "Send",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$send$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveSend"],
    "StopDictation",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$stop$2d$dictation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ComposerPrimitiveStopDictation"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-root.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$send$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-send.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$cancel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-cancel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$add$2d$attachment$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-add-attachment.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$attachments$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-attachments.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$attachment$2d$dropzone$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-attachment-dropzone.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$dictate$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-dictate.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$stop$2d$dictation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-stop-dictation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$dictation$2d$transcript$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-dictation-transcript.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-if.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/composer/index.ts [app-ssr] (ecmascript) <export * as ComposerPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/message/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
;
;
;
}),
"[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useManagedRef",
    ()=>useManagedRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const useManagedRef = (callback)=>{
    const cleanupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>{
        // Call the previous cleanup function
        if (cleanupRef.current) {
            cleanupRef.current();
        }
        // Call the new callback and store its cleanup function
        if (el) {
            cleanupRef.current = callback(el);
        }
    }, [
        callback
    ]);
    return ref;
};
}),
"[project]/packages/react/src/utils/hooks/use-size-handle.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSizeHandle",
    ()=>useSizeHandle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-ssr] (ecmascript)");
"use client";
;
;
const useSizeHandle = (register, getHeight)=>{
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>{
        if (!register) return;
        const sizeHandle = register();
        const updateHeight = ()=>{
            const height = getHeight ? getHeight(el) : el.offsetHeight;
            sizeHandle.setHeight(height);
        };
        const ro = new ResizeObserver(updateHeight);
        ro.observe(el);
        updateHeight();
        return ()=>{
            ro.disconnect();
            sizeHandle.unregister();
        };
    }, [
        register,
        getHeight
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useManagedRef"])(callbackRef);
};
}),
"[project]/packages/react/src/primitives/thread/thread-viewport-slack.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveViewportSlack",
    ()=>ThreadPrimitiveViewportSlack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const SlackNestingContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(false);
const parseCssLength = (value, element)=>{
    const match = value.match(/^([\d.]+)(em|px|rem)$/);
    if (!match) return 0;
    const num = parseFloat(match[1]);
    const unit = match[2];
    if (unit === "px") return num;
    if (unit === "em") {
        const fontSize = parseFloat(getComputedStyle(element).fontSize) || 16;
        return num * fontSize;
    }
    if (unit === "rem") {
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        return num * rootFontSize;
    }
    return 0;
};
const ThreadPrimitiveViewportSlack = ({ children, fillClampThreshold = "10em", fillClampOffset = "6em" })=>{
    const shouldApplySlack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(// only add slack to the last assistant message following a user message (valid turn)
    ({ thread, message })=>message.isLast && message.role === "assistant" && message.index >= 1 && thread.messages.at(message.index - 1)?.role === "user");
    const threadViewportStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewportStore"])({
        optional: true
    });
    const isNested = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SlackNestingContext);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>{
        if (!threadViewportStore || isNested) return;
        const updateMinHeight = ()=>{
            const state = threadViewportStore.getState();
            if (state.turnAnchor === "top" && shouldApplySlack) {
                const { viewport, inset, userMessage } = state.height;
                const threshold = parseCssLength(fillClampThreshold, el);
                const offset = parseCssLength(fillClampOffset, el);
                const clampAdjustment = userMessage <= threshold ? userMessage : offset;
                const minHeight = Math.max(0, viewport - inset - clampAdjustment);
                el.style.minHeight = `${minHeight}px`;
                el.style.flexShrink = "0";
                el.style.transition = "min-height 0s";
            } else {
                el.style.minHeight = "";
                el.style.flexShrink = "";
                el.style.transition = "";
            }
        };
        updateMinHeight();
        return threadViewportStore.subscribe(updateMinHeight);
    }, [
        threadViewportStore,
        shouldApplySlack,
        isNested,
        fillClampThreshold,
        fillClampOffset
    ]);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useManagedRef"])(callback);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SlackNestingContext.Provider, {
        value: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"], {
            ref: ref,
            children: children
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/thread/thread-viewport-slack.tsx",
            lineNumber: 111,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-viewport-slack.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
ThreadPrimitiveViewportSlack.displayName = "ThreadPrimitive.ViewportSlack";
}),
"[project]/packages/react/src/primitives/message/message-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveRoot",
    ()=>MessagePrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-size-handle.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$slack$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-viewport-slack.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
const useIsHoveringRef = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(()=>aui.message());
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>{
        const handleMouseEnter = ()=>{
            message.setIsHovering(true);
        };
        const handleMouseLeave = ()=>{
            message.setIsHovering(false);
        };
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
        if (el.matches(":hover")) {
            // TODO this is needed for SSR to work, figure out why
            queueMicrotask(()=>message.setIsHovering(true));
        }
        return ()=>{
            el.removeEventListener("mouseenter", handleMouseEnter);
            el.removeEventListener("mouseleave", handleMouseLeave);
            message.setIsHovering(false);
        };
    }, [
        message
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useManagedRef"])(callbackRef);
};
/**
 * Hook that registers the anchor user message as a content inset.
 * Only registers if: user message, at index messages.length-2, and last message is assistant.
 */ const useMessageViewportRef = ()=>{
    const turnAnchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewport"])((s)=>s.turnAnchor);
    const registerUserHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewport"])((s)=>s.registerUserMessageHeight);
    // inset rules:
    // - the previous user message before the last assistant message registers its full height
    const shouldRegisterAsInset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ thread, message })=>turnAnchor === "top" && message.role === "user" && message.index === thread.messages.length - 2 && thread.messages.at(-1)?.role === "assistant");
    const getHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>el.offsetHeight, []);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSizeHandle"])(shouldRegisterAsInset ? registerUserHeight : null, getHeight);
};
const MessagePrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, forwardRef)=>{
    const isHoveringRef = useIsHoveringRef();
    const anchorUserMessageRef = useMessageViewportRef();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardRef, isHoveringRef, anchorUserMessageRef);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$slack$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportSlack"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
            ...props,
            ref: ref
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-root.tsx",
            lineNumber: 122,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-root.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
MessagePrimitiveRoot.displayName = "MessagePrimitive.Root";
}),
"[project]/packages/react/src/context/providers/part-by-index-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PartByIndexProvider",
    ()=>PartByIndexProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-ssr] (ecmascript)");
"use client";
;
;
const PartByIndexProvider = ({ index, children })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])({
        part: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"])({
            source: "message",
            query: {
                type: "index",
                index
            },
            get: (aui)=>aui.message().part({
                    index
                })
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/part-by-index-provider.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/packages/react/src/context/providers/text-message-part-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextMessagePartProvider",
    ()=>TextMessagePartProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const TextMessagePartClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resource"])(({ text, isRunning })=>{
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            type: "text",
            text,
            status: isRunning ? {
                type: "running"
            } : {
                type: "complete"
            }
        }), [
        text,
        isRunning
    ]);
    return {
        state,
        methods: {
            getState: ()=>state,
            addToolResult: ()=>{
                throw new Error("Not supported");
            },
            resumeToolCall: ()=>{
                throw new Error("Not supported");
            }
        }
    };
});
const TextMessagePartProvider = ({ text, isRunning = false, children })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])({
        part: TextMessagePartClient({
            text,
            isRunning
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/text-message-part-provider.tsx",
        lineNumber: 50,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/packages/react/src/primitives/message-part/use-message-part-text.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMessagePartText",
    ()=>useMessagePartText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
const useMessagePartText = ()=>{
    const text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ part })=>{
        if (part.type !== "text" && part.type !== "reasoning") throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
        return part;
    });
    return text;
};
}),
"[project]/packages/react/src/utils/smooth/smooth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SmoothContextProvider",
    ()=>SmoothContextProvider,
    "useSmoothStatus",
    ()=>useSmoothStatus,
    "useSmoothStatusStore",
    ()=>useSmoothStatusStore,
    "withSmoothContextProvider",
    ()=>withSmoothContextProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.11_@types+react@19.2.10_immer@11.1.3_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$store$2d$hook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/utils/create-context-store-hook.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const SmoothContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const makeSmoothContext = (initialState)=>{
    const useSmoothStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(()=>initialState);
    return {
        useSmoothStatus
    };
};
const SmoothContextProvider = ({ children })=>{
    const outer = useSmoothContext({
        optional: true
    });
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const [context] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>makeSmoothContext(aui.part().getState().status));
    // do not wrap if there is an outer SmoothContextProvider
    if (outer) return children;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SmoothContext.Provider, {
        value: context,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/utils/smooth/smooth-context.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const withSmoothContextProvider = (Component)=>{
    const Wrapped = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SmoothContextProvider, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                ...props,
                ref: ref
            }, void 0, false, {
                fileName: "[project]/packages/react/src/utils/smooth/smooth-context.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/packages/react/src/utils/smooth/smooth-context.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    });
    Wrapped.displayName = Component.displayName;
    return Wrapped;
};
function useSmoothContext(options) {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(SmoothContext);
    if (!options?.optional && !context) throw new Error("This component must be used within a SmoothContextProvider.");
    return context;
}
const { useSmoothStatus, useSmoothStatusStore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$store$2d$hook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContextStoreHook"])(useSmoothContext, "useSmoothStatus");
}),
"[project]/packages/react/src/utils/smooth/use-smooth.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSmooth",
    ()=>useSmooth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$smooth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/smooth/smooth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/readonly-store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
class TextStreamAnimator {
    currentText;
    setText;
    animationFrameId;
    lastUpdateTime;
    targetText;
    constructor(currentText, setText){
        this.currentText = currentText;
        this.setText = setText;
        this.animationFrameId = null;
        this.lastUpdateTime = Date.now();
        this.targetText = "";
        this.animate = ()=>{
            const currentTime = Date.now();
            const deltaTime = currentTime - this.lastUpdateTime;
            let timeToConsume = deltaTime;
            const remainingChars = this.targetText.length - this.currentText.length;
            const baseTimePerChar = Math.min(5, 250 / remainingChars);
            let charsToAdd = 0;
            while(timeToConsume >= baseTimePerChar && charsToAdd < remainingChars){
                charsToAdd++;
                timeToConsume -= baseTimePerChar;
            }
            if (charsToAdd !== remainingChars) {
                this.animationFrameId = requestAnimationFrame(this.animate);
            } else {
                this.animationFrameId = null;
            }
            if (charsToAdd === 0) return;
            this.currentText = this.targetText.slice(0, this.currentText.length + charsToAdd);
            this.lastUpdateTime = currentTime - timeToConsume;
            this.setText(this.currentText);
        };
    }
    start() {
        if (this.animationFrameId !== null) return;
        this.lastUpdateTime = Date.now();
        this.animate();
    }
    stop() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    animate;
}
const SMOOTH_STATUS = Object.freeze({
    type: "running"
});
const useSmooth = (state, smooth = false)=>{
    const { text } = state;
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.id);
    const idRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(id);
    const [displayedText, setDisplayedText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(text);
    const smoothStatusStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$smooth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSmoothStatusStore"])({
        optional: true
    });
    const setText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallbackRef"])((text)=>{
        setDisplayedText(text);
        if (smoothStatusStore) {
            const target = displayedText !== text || state.status.type === "running" ? SMOOTH_STATUS : state.status;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writableStore"])(smoothStatusStore).setState(target, true);
        }
    });
    // TODO this is hacky
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (smoothStatusStore) {
            const target = smooth && (displayedText !== text || state.status.type === "running") ? SMOOTH_STATUS : state.status;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writableStore"])(smoothStatusStore).setState(target, true);
        }
    }, [
        smoothStatusStore,
        smooth,
        text,
        displayedText,
        state.status
    ]);
    const [animatorRef] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new TextStreamAnimator(text, setText));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!smooth) {
            animatorRef.stop();
            return;
        }
        if (idRef.current !== id || !text.startsWith(animatorRef.targetText)) {
            idRef.current = id;
            setText(text);
            animatorRef.currentText = text;
            animatorRef.targetText = text;
            animatorRef.stop();
            return;
        }
        animatorRef.targetText = text;
        animatorRef.start();
    }, [
        setText,
        animatorRef,
        id,
        smooth,
        text
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            animatorRef.stop();
        };
    }, [
        animatorRef
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>smooth ? {
            type: "text",
            text: displayedText,
            status: text === displayedText ? state.status : SMOOTH_STATUS
        } : state, [
        smooth,
        displayedText,
        state,
        text
    ]);
};
}),
"[project]/packages/react/src/primitives/message-part/message-part-text.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartPrimitiveText",
    ()=>MessagePartPrimitiveText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$text$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/use-message-part-text.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$use$2d$smooth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/smooth/use-smooth.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const MessagePartPrimitiveText = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ smooth = true, component: Component = "span", ...rest }, forwardedRef)=>{
    const { text, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$use$2d$smooth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSmooth"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$text$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMessagePartText"])(), smooth);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        "data-status": status.type,
        ...rest,
        ref: forwardedRef,
        children: text
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message-part/message-part-text.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
MessagePartPrimitiveText.displayName = "MessagePartPrimitive.Text";
}),
"[project]/packages/react/src/primitives/message-part/use-message-part-image.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMessagePartImage",
    ()=>useMessagePartImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
const useMessagePartImage = ()=>{
    const image = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ part })=>{
        if (part.type !== "image") throw new Error("MessagePartImage can only be used inside image message parts.");
        return part;
    });
    return image;
};
}),
"[project]/packages/react/src/primitives/message-part/message-part-image.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartPrimitiveImage",
    ()=>MessagePartPrimitiveImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$image$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/use-message-part-image.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const MessagePartPrimitiveImage = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, forwardedRef)=>{
    const { image } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$image$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMessagePartImage"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].img, {
        src: image,
        ...props,
        ref: forwardedRef
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message-part/message-part-image.tsx",
        lineNumber: 36,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
MessagePartPrimitiveImage.displayName = "MessagePartPrimitive.Image";
}),
"[project]/packages/react/src/primitives/message-part/message-part-in-progress.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartPrimitiveInProgress",
    ()=>MessagePartPrimitiveInProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
const MessagePartPrimitiveInProgress = ({ children })=>{
    const isInProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ part })=>part.status.type === "running");
    return isInProgress ? children : null;
};
MessagePartPrimitiveInProgress.displayName = "MessagePartPrimitive.InProgress";
}),
"[project]/packages/react/src/primitives/message/message-parts.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitivePartByIndex",
    ()=>MessagePrimitivePartByIndex,
    "MessagePrimitiveParts",
    ()=>MessagePrimitiveParts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$part$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/part-by-index-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$text$2d$message$2d$part$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/text-message-part-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$text$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-text.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$image$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-image.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$in$2d$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-in-progress.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.11_@types+react@19.2.10_immer@11.1.3_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/react/shallow.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
/**
 * Creates a group state manager for a specific part type.
 * Returns functions to start, end, and finalize groups.
 */ const createGroupState = (groupType)=>{
    let start = -1;
    return {
        startGroup: (index)=>{
            if (start === -1) {
                start = index;
            }
        },
        endGroup: (endIndex, ranges)=>{
            if (start !== -1) {
                ranges.push({
                    type: groupType,
                    startIndex: start,
                    endIndex
                });
                start = -1;
            }
        },
        finalize: (endIndex, ranges)=>{
            if (start !== -1) {
                ranges.push({
                    type: groupType,
                    startIndex: start,
                    endIndex
                });
            }
        }
    };
};
/**
 * Groups consecutive tool-call and reasoning message parts into ranges.
 * Always groups tool calls and reasoning parts, even if there's only one.
 */ const groupMessageParts = (messageTypes)=>{
    const ranges = [];
    const toolGroup = createGroupState("toolGroup");
    const reasoningGroup = createGroupState("reasoningGroup");
    for(let i = 0; i < messageTypes.length; i++){
        const type = messageTypes[i];
        if (type === "tool-call") {
            reasoningGroup.endGroup(i - 1, ranges);
            toolGroup.startGroup(i);
        } else if (type === "reasoning") {
            toolGroup.endGroup(i - 1, ranges);
            reasoningGroup.startGroup(i);
        } else {
            toolGroup.endGroup(i - 1, ranges);
            reasoningGroup.endGroup(i - 1, ranges);
            ranges.push({
                type: "single",
                index: i
            });
        }
    }
    toolGroup.finalize(messageTypes.length - 1, ranges);
    reasoningGroup.finalize(messageTypes.length - 1, ranges);
    return ranges;
};
const useMessagePartsGroups = ()=>{
    const messageTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShallow"])((s)=>s.message.parts.map((c)=>c.type)));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (messageTypes.length === 0) {
            return [];
        }
        return groupMessageParts(messageTypes);
    }, [
        messageTypes
    ]);
};
const ToolUIDisplay = ({ Fallback, ...props })=>{
    const Render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ tools })=>{
        const Render = tools.tools[props.toolName] ?? Fallback;
        if (Array.isArray(Render)) return Render[0] ?? Fallback;
        return Render;
    });
    if (!Render) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Render, {
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
        lineNumber: 271,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const defaultComponents = {
    Text: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            style: {
                whiteSpace: "pre-line"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$text$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveText"], {}, void 0, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                    lineNumber: 277,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$in$2d$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveInProgress"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: "revert"
                        },
                        children: " \u25CF"
                    }, void 0, false, {
                        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                    lineNumber: 278,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
            lineNumber: 276,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Reasoning: ()=>null,
    Source: ()=>null,
    Image: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$image$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveImage"], {}, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
            lineNumber: 285,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
    File: ()=>null,
    Unstable_Audio: ()=>null,
    ToolGroup: ({ children })=>children,
    ReasoningGroup: ({ children })=>children
};
const MessagePartComponent = ({ components: { Text = defaultComponents.Text, Reasoning = defaultComponents.Reasoning, Image = defaultComponents.Image, Source = defaultComponents.Source, File = defaultComponents.File, Unstable_Audio: Audio = defaultComponents.Unstable_Audio, tools = {} } = {} })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const part = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ part })=>part);
    const type = part.type;
    if (type === "tool-call") {
        const addResult = aui.part().addToolResult;
        const resume = aui.part().resumeToolCall;
        if ("Override" in tools) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(tools.Override, {
            ...part,
            addResult: addResult,
            resume: resume
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
            lineNumber: 315,
            columnNumber: 14
        }, ("TURBOPACK compile-time value", void 0));
        const Tool = tools.by_name?.[part.toolName] ?? tools.Fallback;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolUIDisplay, {
            ...part,
            Fallback: Tool,
            addResult: addResult,
            resume: resume
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
            lineNumber: 318,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (part.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
    switch(type){
        case "text":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 332,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "reasoning":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Reasoning, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 335,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "source":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Source, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 338,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "image":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Image, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 341,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "file":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(File, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 344,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "audio":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Audio, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 347,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "data":
            return null;
        default:
            const unhandledType = type;
            throw new Error(`Unknown message part type: ${unhandledType}`);
    }
};
const MessagePrimitivePartByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$part$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PartByIndexProvider"], {
        index: index,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePartComponent, {
            components: components
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
            lineNumber: 387,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
        lineNumber: 386,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
}, (prev, next)=>prev.index === next.index && prev.components?.Text === next.components?.Text && prev.components?.Reasoning === next.components?.Reasoning && prev.components?.Source === next.components?.Source && prev.components?.Image === next.components?.Image && prev.components?.File === next.components?.File && prev.components?.Unstable_Audio === next.components?.Unstable_Audio && prev.components?.tools === next.components?.tools && prev.components?.ToolGroup === next.components?.ToolGroup && prev.components?.ReasoningGroup === next.components?.ReasoningGroup);
MessagePrimitivePartByIndex.displayName = "MessagePrimitive.PartByIndex";
const EmptyPartFallback = ({ status, component: Component })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$text$2d$message$2d$part$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextMessagePartProvider"], {
        text: "",
        isRunning: status.type === "running",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
            type: "text",
            text: "",
            status: status
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
            lineNumber: 412,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
        lineNumber: 411,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const COMPLETE_STATUS = Object.freeze({
    type: "complete"
});
const EmptyPartsImpl = ({ components })=>{
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])((s)=>s.message.status ?? COMPLETE_STATUS);
    if (components?.Empty) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(components.Empty, {
        status: status
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
        lineNumber: 426,
        columnNumber: 33
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyPartFallback, {
        status: status,
        component: components?.Text ?? defaultComponents.Text
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
        lineNumber: 429,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const EmptyParts = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(EmptyPartsImpl, (prev, next)=>prev.components?.Empty === next.components?.Empty && prev.components?.Text === next.components?.Text);
const ConditionalEmptyImpl = ({ components, enabled })=>{
    const shouldShowEmpty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>{
        if (!enabled) return false;
        if (message.parts.length === 0) return false;
        const lastPart = message.parts[message.parts.length - 1];
        return lastPart?.type !== "text" && lastPart?.type !== "reasoning";
    });
    if (!shouldShowEmpty) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyParts, {
        components: components
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
        lineNumber: 456,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const ConditionalEmpty = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(ConditionalEmptyImpl, (prev, next)=>prev.enabled === next.enabled && prev.components?.Empty === next.components?.Empty && prev.components?.Text === next.components?.Text);
const MessagePrimitiveParts = ({ components, unstable_showEmptyOnNonTextEnd = true })=>{
    const contentLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.parts.length);
    const messageRanges = useMessagePartsGroups();
    const partsElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (contentLength === 0) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyParts, {
                components: components
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 500,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        }
        return messageRanges.map((range)=>{
            if (range.type === "single") {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePrimitivePartByIndex, {
                    index: range.index,
                    components: components
                }, range.index, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                    lineNumber: 506,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            } else if (range.type === "toolGroup") {
                const ToolGroupComponent = components?.ToolGroup ?? defaultComponents.ToolGroup;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolGroupComponent, {
                    startIndex: range.startIndex,
                    endIndex: range.endIndex,
                    children: Array.from({
                        length: range.endIndex - range.startIndex + 1
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePrimitivePartByIndex, {
                            index: range.startIndex + i,
                            components: components
                        }, i, false, {
                            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                            lineNumber: 524,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)))
                }, `tool-${range.startIndex}`, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                    lineNumber: 516,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            } else {
                // reasoningGroup
                const ReasoningGroupComponent = components?.ReasoningGroup ?? defaultComponents.ReasoningGroup;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReasoningGroupComponent, {
                    startIndex: range.startIndex,
                    endIndex: range.endIndex,
                    children: Array.from({
                        length: range.endIndex - range.startIndex + 1
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePrimitivePartByIndex, {
                            index: range.startIndex + i,
                            components: components
                        }, i, false, {
                            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                            lineNumber: 546,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)))
                }, `reasoning-${range.startIndex}`, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                    lineNumber: 538,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            }
        });
    }, [
        messageRanges,
        components,
        contentLength
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            partsElements,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConditionalEmpty, {
                components: components,
                enabled: unstable_showEmptyOnNonTextEnd
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 562,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
MessagePrimitiveParts.displayName = "MessagePrimitive.Parts";
}),
"[project]/packages/react/src/primitives/message/message-if.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveIf",
    ()=>MessagePrimitiveIf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
const useMessageIf = (props)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>{
        const { role, attachments, parts, branchCount, isLast, speech, isCopied, isHovering } = message;
        if (props.hasBranches === true && branchCount < 2) return false;
        if (props.user && role !== "user") return false;
        if (props.assistant && role !== "assistant") return false;
        if (props.system && role !== "system") return false;
        if (props.lastOrHover === true && !isHovering && !isLast) return false;
        if (props.last !== undefined && props.last !== isLast) return false;
        if (props.copied === true && !isCopied) return false;
        if (props.copied === false && isCopied) return false;
        if (props.speaking === true && speech == null) return false;
        if (props.speaking === false && speech != null) return false;
        if (props.hasAttachments === true && (role !== "user" || !attachments?.length)) return false;
        if (props.hasAttachments === false && role === "user" && !!attachments?.length) return false;
        if (props.hasContent === true && parts.length === 0) return false;
        if (props.hasContent === false && parts.length > 0) return false;
        if (props.submittedFeedback !== undefined && (message.metadata.submittedFeedback?.type ?? null) !== props.submittedFeedback) return false;
        return true;
    });
};
const MessagePrimitiveIf = ({ children, ...query })=>{
    const result = useMessageIf(query);
    return result ? children : null;
};
MessagePrimitiveIf.displayName = "MessagePrimitive.If";
}),
"[project]/packages/react/src/primitives/message/message-attachments.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveAttachmentByIndex",
    ()=>MessagePrimitiveAttachmentByIndex,
    "MessagePrimitiveAttachments",
    ()=>MessagePrimitiveAttachments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$attachment$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/attachment-by-index-provider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const getComponent = (components, attachment)=>{
    const type = attachment.type;
    switch(type){
        case "image":
            return components?.Image ?? components?.Attachment;
        case "document":
            return components?.Document ?? components?.Attachment;
        case "file":
            return components?.File ?? components?.Attachment;
        default:
            const _exhaustiveCheck = type;
            throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
    }
};
const AttachmentComponent = ({ components })=>{
    const attachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ attachment })=>attachment);
    if (!attachment) return null;
    const Component = getComponent(components, attachment);
    if (!Component) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {}, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-attachments.tsx",
        lineNumber: 47,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const MessagePrimitiveAttachmentByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$attachment$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessageAttachmentByIndexProvider"], {
        index: index,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AttachmentComponent, {
            components: components
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-attachments.tsx",
            lineNumber: 79,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-attachments.tsx",
        lineNumber: 78,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
}, (prev, next)=>prev.index === next.index && prev.components?.Image === next.components?.Image && prev.components?.Document === next.components?.Document && prev.components?.File === next.components?.File && prev.components?.Attachment === next.components?.Attachment);
MessagePrimitiveAttachmentByIndex.displayName = "MessagePrimitive.AttachmentByIndex";
const MessagePrimitiveAttachments = ({ components })=>{
    const attachmentsCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>{
        if (message.role !== "user") return 0;
        return message.attachments.length;
    });
    const attachmentElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return Array.from({
            length: attachmentsCount
        }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePrimitiveAttachmentByIndex, {
                index: index,
                components: components
            }, index, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-attachments.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)));
    }, [
        attachmentsCount,
        components
    ]);
    return attachmentElements;
};
MessagePrimitiveAttachments.displayName = "MessagePrimitive.Attachments";
}),
"[project]/packages/react/src/primitives/message/message-error.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveError",
    ()=>MessagePrimitiveError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
const MessagePrimitiveError = ({ children })=>{
    const hasError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.status?.type === "incomplete" && message.status.reason === "error");
    return hasError ? children : null;
};
MessagePrimitiveError.displayName = "MessagePrimitive.Error";
}),
"[project]/packages/react/src/primitives/message/message-parts-grouped.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveUnstable_PartsGrouped",
    ()=>MessagePrimitiveUnstable_PartsGrouped,
    "MessagePrimitiveUnstable_PartsGroupedByParentId",
    ()=>MessagePrimitiveUnstable_PartsGroupedByParentId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$part$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/part-by-index-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$text$2d$message$2d$part$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/text-message-part-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$text$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-text.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$image$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-image.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$in$2d$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-in-progress.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
/**
 * Groups message parts by their parent ID.
 * Parts without a parent ID appear in their chronological position as individual groups.
 * Parts with the same parent ID are grouped together at the position of their first occurrence.
 */ const groupMessagePartsByParentId = (parts)=>{
    // Map maintains insertion order, so groups appear in order of first occurrence
    const groupMap = new Map();
    // Process each part in order
    for(let i = 0; i < parts.length; i++){
        const part = parts[i];
        const parentId = part?.parentId;
        // For parts without parentId, assign a unique group ID to maintain their position
        const groupId = parentId ?? `__ungrouped_${i}`;
        // Get or create the indices array for this group
        const indices = groupMap.get(groupId) ?? [];
        indices.push(i);
        groupMap.set(groupId, indices);
    }
    // Convert map to array of groups
    const groups = [];
    for (const [groupId, indices] of groupMap){
        // Extract parentId (undefined for ungrouped parts)
        const groupKey = groupId.startsWith("__ungrouped_") ? undefined : groupId;
        groups.push({
            groupKey,
            indices
        });
    }
    return groups;
};
const useMessagePartsGrouped = (groupingFunction)=>{
    const parts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.parts);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (parts.length === 0) {
            return [];
        }
        return groupingFunction(parts);
    }, [
        parts,
        groupingFunction
    ]);
};
const ToolUIDisplay = ({ Fallback, ...props })=>{
    const Render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ tools })=>{
        const Render = tools.tools[props.toolName] ?? Fallback;
        if (Array.isArray(Render)) return Render[0] ?? Fallback;
        return Render;
    });
    if (!Render) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Render, {
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
        lineNumber: 228,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const defaultComponents = {
    Text: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            style: {
                whiteSpace: "pre-line"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$text$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveText"], {}, void 0, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                    lineNumber: 234,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$in$2d$progress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveInProgress"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: "revert"
                        },
                        children: " \u25CF"
                    }, void 0, false, {
                        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                        lineNumber: 236,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                    lineNumber: 235,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
            lineNumber: 233,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)),
    Reasoning: ()=>null,
    Source: ()=>null,
    Image: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$image$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartPrimitiveImage"], {}, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
            lineNumber: 242,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
    File: ()=>null,
    Unstable_Audio: ()=>null,
    Group: ({ children })=>children
};
const MessagePartComponent = ({ components: { Text = defaultComponents.Text, Reasoning = defaultComponents.Reasoning, Image = defaultComponents.Image, Source = defaultComponents.Source, File = defaultComponents.File, Unstable_Audio: Audio = defaultComponents.Unstable_Audio, tools = {} } = {} })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const part = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ part })=>part);
    const type = part.type;
    if (type === "tool-call") {
        const addResult = aui.part().addToolResult;
        const resume = aui.part().resumeToolCall;
        if ("Override" in tools) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(tools.Override, {
            ...part,
            addResult: addResult,
            resume: resume
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
            lineNumber: 271,
            columnNumber: 14
        }, ("TURBOPACK compile-time value", void 0));
        const Tool = tools.by_name?.[part.toolName] ?? tools.Fallback;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolUIDisplay, {
            ...part,
            Fallback: Tool,
            addResult: addResult,
            resume: resume
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
            lineNumber: 274,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (part.status?.type === "requires-action") throw new Error("Encountered unexpected requires-action status");
    switch(type){
        case "text":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 288,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "reasoning":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Reasoning, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 291,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "source":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Source, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 294,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "image":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Image, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 297,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "file":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(File, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 300,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "audio":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Audio, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 303,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "data":
            return null;
        default:
            const unhandledType = type;
            throw new Error(`Unknown message part type: ${unhandledType}`);
    }
};
const MessagePartImpl = ({ partIndex, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$part$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PartByIndexProvider"], {
        index: partIndex,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePartComponent, {
            components: components
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
            lineNumber: 322,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
        lineNumber: 321,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const MessagePart = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(MessagePartImpl, (prev, next)=>prev.partIndex === next.partIndex && prev.components?.Text === next.components?.Text && prev.components?.Reasoning === next.components?.Reasoning && prev.components?.Source === next.components?.Source && prev.components?.Image === next.components?.Image && prev.components?.File === next.components?.File && prev.components?.Unstable_Audio === next.components?.Unstable_Audio && prev.components?.tools === next.components?.tools && prev.components?.Group === next.components?.Group);
const EmptyPartFallback = ({ status, component: Component })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$text$2d$message$2d$part$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TextMessagePartProvider"], {
        text: "",
        isRunning: status.type === "running",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
            type: "text",
            text: "",
            status: status
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
            lineNumber: 347,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
        lineNumber: 346,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const COMPLETE_STATUS = Object.freeze({
    type: "complete"
});
const EmptyPartsImpl = ({ components })=>{
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])((s)=>s.message.status ?? COMPLETE_STATUS);
    if (components?.Empty) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(components.Empty, {
        status: status
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
        lineNumber: 361,
        columnNumber: 33
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyPartFallback, {
        status: status,
        component: components?.Text ?? defaultComponents.Text
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
        lineNumber: 364,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const EmptyParts = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(EmptyPartsImpl, (prev, next)=>prev.components?.Empty === next.components?.Empty && prev.components?.Text === next.components?.Text);
const MessagePrimitiveUnstable_PartsGrouped = ({ groupingFunction, components })=>{
    const contentLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.parts.length);
    const messageGroups = useMessagePartsGrouped(groupingFunction);
    const partsElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (contentLength === 0) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyParts, {
                components: components
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 434,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        }
        return messageGroups.map((group, groupIndex)=>{
            const GroupComponent = components?.Group ?? defaultComponents.Group;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GroupComponent, {
                groupKey: group.groupKey,
                indices: group.indices,
                children: group.indices.map((partIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePart, {
                        partIndex: partIndex,
                        components: components
                    }, partIndex, false, {
                        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                        lineNumber: 447,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, `group-${groupIndex}-${group.groupKey ?? "ungrouped"}`, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 441,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        });
    }, [
        messageGroups,
        components,
        contentLength
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: partsElements
    }, void 0, false);
};
MessagePrimitiveUnstable_PartsGrouped.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const MessagePrimitiveUnstable_PartsGroupedByParentId = ({ components, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePrimitiveUnstable_PartsGrouped, {
        ...props,
        components: components,
        groupingFunction: groupMessagePartsByParentId
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
        lineNumber: 474,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
MessagePrimitiveUnstable_PartsGroupedByParentId.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
}),
"[project]/packages/react/src/primitives/message/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$attachments$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveAttachmentByIndex"],
    "Attachments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$attachments$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveAttachments"],
    "Content",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveParts"],
    "Error",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$error$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveError"],
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveIf"],
    "PartByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitivePartByIndex"],
    "Parts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveParts"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveRoot"],
    "Unstable_PartsGrouped",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2d$grouped$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveUnstable_PartsGrouped"],
    "Unstable_PartsGroupedByParentId",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2d$grouped$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveUnstable_PartsGroupedByParentId"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-root.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-parts.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-if.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$attachments$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-attachments.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$error$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-error.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2d$grouped$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-parts-grouped.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/message/index.ts [app-ssr] (ecmascript) <export * as MessagePrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript) <export useAuiState as useAssistantState>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAssistantState",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript) <export useAui as useAssistantApi>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAssistantApi",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/internal.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/packages/react/src/legacy-runtime/runtime-cores/remote-thread-list/base-subscribable.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseSubscribable",
    ()=>BaseSubscribable
]);
class BaseSubscribable {
    _subscribers = new Set();
    subscribe(callback) {
        this._subscribers.add(callback);
        return ()=>this._subscribers.delete(callback);
    }
    waitForUpdate() {
        return new Promise((resolve)=>{
            const unsubscribe = this.subscribe(()=>{
                unsubscribe();
                resolve();
            });
        });
    }
    _notifySubscribers() {
        const errors = [];
        for (const callback of this._subscribers){
            try {
                callback();
            } catch (error) {
                errors.push(error);
            }
        }
        if (errors.length > 0) {
            if (errors.length === 1) {
                throw errors[0];
            } else {
                for (const error of errors){
                    console.error(error);
                }
                throw new AggregateError(errors);
            }
        }
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime-cores/composer/base-composer-runtime-core.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseComposerRuntimeCore",
    ()=>BaseComposerRuntimeCore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$remote$2d$thread$2d$list$2f$base$2d$subscribable$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/remote-thread-list/base-subscribable.tsx [app-ssr] (ecmascript)");
;
const isAttachmentComplete = (a)=>a.status.type === "complete";
class BaseComposerRuntimeCore extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$remote$2d$thread$2d$list$2f$base$2d$subscribable$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseSubscribable"] {
    isEditing = true;
    get attachmentAccept() {
        return this.getAttachmentAdapter()?.accept ?? "*";
    }
    _attachments = [];
    get attachments() {
        return this._attachments;
    }
    setAttachments(value) {
        this._attachments = value;
        this._notifySubscribers();
    }
    get isEmpty() {
        return !this.text.trim() && !this.attachments.length;
    }
    _text = "";
    get text() {
        return this._text;
    }
    _role = "user";
    get role() {
        return this._role;
    }
    _runConfig = {};
    get runConfig() {
        return this._runConfig;
    }
    setText(value) {
        if (this._text === value) return;
        this._text = value;
        // When dictation is active and the user manually edits the composer text,
        // treat the new text as the updated base so speech results are appended
        // instead of overwriting manual edits.
        if (this._dictation) {
            this._dictationBaseText = value;
            this._currentInterimText = "";
            const { status, inputDisabled } = this._dictation;
            this._dictation = inputDisabled ? {
                status,
                inputDisabled
            } : {
                status
            };
        }
        this._notifySubscribers();
    }
    setRole(role) {
        if (this._role === role) return;
        this._role = role;
        this._notifySubscribers();
    }
    setRunConfig(runConfig) {
        if (this._runConfig === runConfig) return;
        this._runConfig = runConfig;
        this._notifySubscribers();
    }
    _emptyTextAndAttachments() {
        this._attachments = [];
        this._text = "";
        this._notifySubscribers();
    }
    async _onClearAttachments() {
        const adapter = this.getAttachmentAdapter();
        if (adapter) {
            await Promise.all(this._attachments.map((a)=>adapter.remove(a)));
        }
    }
    async reset() {
        if (this._attachments.length === 0 && this._text === "" && this._role === "user" && Object.keys(this._runConfig).length === 0) {
            return;
        }
        this._role = "user";
        this._runConfig = {};
        const task = this._onClearAttachments();
        this._emptyTextAndAttachments();
        await task;
    }
    async clearAttachments() {
        const task = this._onClearAttachments();
        this.setAttachments([]);
        await task;
    }
    async send() {
        if (this._dictationSession) {
            this._dictationSession.cancel();
            this._cleanupDictation();
        }
        const adapter = this.getAttachmentAdapter();
        const attachments = adapter && this.attachments.length > 0 ? Promise.all(this.attachments.map(async (a)=>{
            if (isAttachmentComplete(a)) return a;
            const result = await adapter.send(a);
            return result;
        })) : [];
        const text = this.text;
        this._emptyTextAndAttachments();
        const message = {
            createdAt: new Date(),
            role: this.role,
            content: text ? [
                {
                    type: "text",
                    text
                }
            ] : [],
            attachments: await attachments,
            runConfig: this.runConfig,
            metadata: {
                custom: {}
            }
        };
        this.handleSend(message);
        this._notifyEventSubscribers("send");
    }
    cancel() {
        this.handleCancel();
    }
    async addAttachment(file) {
        const adapter = this.getAttachmentAdapter();
        if (!adapter) throw new Error("Attachments are not supported");
        const upsertAttachment = (a)=>{
            const idx = this._attachments.findIndex((attachment)=>attachment.id === a.id);
            if (idx !== -1) this._attachments = [
                ...this._attachments.slice(0, idx),
                a,
                ...this._attachments.slice(idx + 1)
            ];
            else {
                this._attachments = [
                    ...this._attachments,
                    a
                ];
            }
            this._notifySubscribers();
        };
        const promiseOrGenerator = adapter.add({
            file
        });
        if (Symbol.asyncIterator in promiseOrGenerator) {
            for await (const r of promiseOrGenerator){
                upsertAttachment(r);
            }
        } else {
            upsertAttachment(await promiseOrGenerator);
        }
        this._notifyEventSubscribers("attachmentAdd");
        this._notifySubscribers();
    }
    async removeAttachment(attachmentId) {
        const adapter = this.getAttachmentAdapter();
        if (!adapter) throw new Error("Attachments are not supported");
        const index = this._attachments.findIndex((a)=>a.id === attachmentId);
        if (index === -1) throw new Error("Attachment not found");
        const attachment = this._attachments[index];
        await adapter.remove(attachment);
        // this._attachments.toSpliced(index, 1); - not yet widely supported
        this._attachments = [
            ...this._attachments.slice(0, index),
            ...this._attachments.slice(index + 1)
        ];
        this._notifySubscribers();
    }
    _dictation;
    _dictationSession;
    _dictationUnsubscribes = [];
    _dictationBaseText = "";
    _currentInterimText = "";
    _dictationSessionIdCounter = 0;
    _activeDictationSessionId;
    _isCleaningDictation = false;
    get dictation() {
        return this._dictation;
    }
    _isActiveSession(sessionId, session) {
        return this._activeDictationSessionId === sessionId && this._dictationSession === session;
    }
    startDictation() {
        const adapter = this.getDictationAdapter();
        if (!adapter) {
            throw new Error("Dictation adapter not configured");
        }
        if (this._dictationSession) {
            for (const unsub of this._dictationUnsubscribes){
                unsub();
            }
            this._dictationUnsubscribes = [];
            const oldSession = this._dictationSession;
            oldSession.stop().catch(()=>{});
            this._dictationSession = undefined;
        }
        const inputDisabled = adapter.disableInputDuringDictation ?? false;
        this._dictationBaseText = this._text;
        this._currentInterimText = "";
        const session = adapter.listen();
        this._dictationSession = session;
        const sessionId = ++this._dictationSessionIdCounter;
        this._activeDictationSessionId = sessionId;
        this._dictation = {
            status: session.status,
            inputDisabled
        };
        this._notifySubscribers();
        const unsubSpeech = session.onSpeech((result)=>{
            if (!this._isActiveSession(sessionId, session)) return;
            const isFinal = result.isFinal !== false;
            const needsSeparator = this._dictationBaseText && !this._dictationBaseText.endsWith(" ") && result.transcript;
            const separator = needsSeparator ? " " : "";
            if (isFinal) {
                this._dictationBaseText = this._dictationBaseText + separator + result.transcript;
                this._currentInterimText = "";
                this._text = this._dictationBaseText;
                if (this._dictation) {
                    const { transcript: _, ...rest } = this._dictation;
                    this._dictation = rest;
                }
                this._notifySubscribers();
            } else {
                this._currentInterimText = separator + result.transcript;
                this._text = this._dictationBaseText + this._currentInterimText;
                if (this._dictation) {
                    this._dictation = {
                        ...this._dictation,
                        transcript: result.transcript
                    };
                }
                this._notifySubscribers();
            }
        });
        this._dictationUnsubscribes.push(unsubSpeech);
        const unsubStart = session.onSpeechStart(()=>{
            if (!this._isActiveSession(sessionId, session)) return;
            this._dictation = {
                status: {
                    type: "running"
                },
                inputDisabled,
                ...this._dictation?.transcript && {
                    transcript: this._dictation.transcript
                }
            };
            this._notifySubscribers();
        });
        this._dictationUnsubscribes.push(unsubStart);
        const unsubEnd = session.onSpeechEnd(()=>{
            this._cleanupDictation({
                sessionId
            });
        });
        this._dictationUnsubscribes.push(unsubEnd);
        const statusInterval = setInterval(()=>{
            if (!this._isActiveSession(sessionId, session)) return;
            if (session.status.type === "ended") {
                this._cleanupDictation({
                    sessionId
                });
            }
        }, 100);
        this._dictationUnsubscribes.push(()=>clearInterval(statusInterval));
    }
    stopDictation() {
        if (!this._dictationSession) return;
        const session = this._dictationSession;
        const sessionId = this._activeDictationSessionId;
        session.stop().finally(()=>{
            this._cleanupDictation({
                sessionId
            });
        });
    }
    _cleanupDictation(options) {
        const isStaleSession = options?.sessionId !== undefined && options.sessionId !== this._activeDictationSessionId;
        if (isStaleSession || this._isCleaningDictation) return;
        this._isCleaningDictation = true;
        try {
            for (const unsub of this._dictationUnsubscribes){
                unsub();
            }
            this._dictationUnsubscribes = [];
            this._dictationSession = undefined;
            this._activeDictationSessionId = undefined;
            this._dictation = undefined;
            this._dictationBaseText = "";
            this._currentInterimText = "";
            this._notifySubscribers();
        } finally{
            this._isCleaningDictation = false;
        }
    }
    _eventSubscribers = new Map();
    _notifyEventSubscribers(event) {
        const subscribers = this._eventSubscribers.get(event);
        if (!subscribers) return;
        for (const callback of subscribers)callback();
    }
    unstable_on(event, callback) {
        const subscribers = this._eventSubscribers.get(event);
        if (!subscribers) {
            this._eventSubscribers.set(event, new Set([
                callback
            ]));
        } else {
            subscribers.add(callback);
        }
        return ()=>{
            const subscribers = this._eventSubscribers.get(event);
            if (!subscribers) return;
            subscribers.delete(callback);
        };
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime-cores/composer/default-thread-composer-runtime-core.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DefaultThreadComposerRuntimeCore",
    ()=>DefaultThreadComposerRuntimeCore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$composer$2f$base$2d$composer$2d$runtime$2d$core$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/composer/base-composer-runtime-core.tsx [app-ssr] (ecmascript)");
;
class DefaultThreadComposerRuntimeCore extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$composer$2f$base$2d$composer$2d$runtime$2d$core$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseComposerRuntimeCore"] {
    runtime;
    _canCancel;
    get canCancel() {
        return this._canCancel;
    }
    get attachments() {
        return super.attachments;
    }
    getAttachmentAdapter() {
        return this.runtime.adapters?.attachments;
    }
    getDictationAdapter() {
        return this.runtime.adapters?.dictation;
    }
    constructor(runtime){
        super(), this.runtime = runtime, this._canCancel = false;
        this.connect();
    }
    connect() {
        return this.runtime.subscribe(()=>{
            if (this.canCancel !== this.runtime.capabilities.cancel) {
                this._canCancel = this.runtime.capabilities.cancel;
                this._notifySubscribers();
            }
        });
    }
    async handleSend(message) {
        this.runtime.append({
            ...message,
            parentId: this.runtime.messages.at(-1)?.id ?? null,
            sourceId: null
        });
    }
    async handleCancel() {
        this.runtime.cancelRun();
    }
}
}),
"[project]/packages/react/src/utils/id-utils.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateErrorMessageId",
    ()=>generateErrorMessageId,
    "generateId",
    ()=>generateId,
    "generateOptimisticId",
    ()=>generateOptimisticId,
    "isErrorMessageId",
    ()=>isErrorMessageId,
    "isOptimisticId",
    ()=>isOptimisticId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$non$2d$secure$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/nanoid@5.1.6/node_modules/nanoid/non-secure/index.js [app-ssr] (ecmascript)");
;
const generateId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$nanoid$40$5$2e$1$2e$6$2f$node_modules$2f$nanoid$2f$non$2d$secure$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["customAlphabet"])("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);
const optimisticPrefix = "__optimistic__";
const generateOptimisticId = ()=>`${optimisticPrefix}${generateId()}`;
const isOptimisticId = (id)=>id.startsWith(optimisticPrefix);
const errorPrefix = "__error__";
const generateErrorMessageId = ()=>`${errorPrefix}${generateId()}`;
const isErrorMessageId = (id)=>id.startsWith(errorPrefix);
}),
"[project]/packages/react/src/legacy-runtime/runtime-cores/external-store/auto-status.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAutoStatus",
    ()=>getAutoStatus,
    "isAutoStatus",
    ()=>isAutoStatus
]);
const symbolAutoStatus = Symbol("autoStatus");
const AUTO_STATUS_RUNNING = Object.freeze(Object.assign({
    type: "running"
}, {
    [symbolAutoStatus]: true
}));
const AUTO_STATUS_COMPLETE = Object.freeze(Object.assign({
    type: "complete",
    reason: "unknown"
}, {
    [symbolAutoStatus]: true
}));
const AUTO_STATUS_PENDING = Object.freeze(Object.assign({
    type: "requires-action",
    reason: "tool-calls"
}, {
    [symbolAutoStatus]: true
}));
const AUTO_STATUS_INTERRUPT = Object.freeze(Object.assign({
    type: "requires-action",
    reason: "interrupt"
}, {
    [symbolAutoStatus]: true
}));
const isAutoStatus = (status)=>status[symbolAutoStatus] === true;
const getAutoStatus = (isLast, isRunning, hasInterruptedToolCalls, hasPendingToolCalls, error)=>{
    if (isLast && error) {
        return Object.assign({
            type: "incomplete",
            reason: "error",
            error: error
        }, {
            [symbolAutoStatus]: true
        });
    }
    return isLast && isRunning ? AUTO_STATUS_RUNNING : hasInterruptedToolCalls ? AUTO_STATUS_INTERRUPT : hasPendingToolCalls ? AUTO_STATUS_PENDING : AUTO_STATUS_COMPLETE;
};
}),
"[project]/packages/react/src/legacy-runtime/runtime-cores/external-store/thread-message-like.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fromThreadMessageLike",
    ()=>fromThreadMessageLike
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$utils$2f$json$2f$parse$2d$partial$2d$json$2d$object$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/assistant-stream@0.3.0/node_modules/assistant-stream/dist/utils/json/parse-partial-json-object.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$id$2d$utils$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/id-utils.tsx [app-ssr] (ecmascript)");
;
;
const fromThreadMessageLike = (like, fallbackId, fallbackStatus)=>{
    const { role, id, createdAt, attachments, status, metadata } = like;
    const common = {
        id: id ?? fallbackId,
        createdAt: createdAt ?? new Date()
    };
    const content = typeof like.content === "string" ? [
        {
            type: "text",
            text: like.content
        }
    ] : like.content;
    const sanitizeImageContent = ({ image, ...rest })=>{
        const match = image.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.*)$/);
        if (match) {
            return {
                ...rest,
                image
            };
        }
        console.warn(`Invalid image data format detected`);
        return null;
    };
    if (role !== "user" && attachments?.length) throw new Error("attachments are only supported for user messages");
    if (role !== "assistant" && status) throw new Error("status is only supported for assistant messages");
    if (role !== "assistant" && metadata?.steps) throw new Error("metadata.steps is only supported for assistant messages");
    switch(role){
        case "assistant":
            return {
                ...common,
                role,
                content: content.map((part)=>{
                    const type = part.type;
                    switch(type){
                        case "text":
                        case "reasoning":
                            if (part.text.trim().length === 0) return null;
                            return part;
                        case "file":
                        case "source":
                            return part;
                        case "image":
                            return sanitizeImageContent(part);
                        case "data":
                            return part;
                        case "tool-call":
                            {
                                const { parentId, messages, ...basePart } = part;
                                const commonProps = {
                                    ...basePart,
                                    toolCallId: part.toolCallId ?? `tool-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$id$2d$utils$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])()}`,
                                    ...parentId !== undefined && {
                                        parentId
                                    },
                                    ...messages !== undefined && {
                                        messages
                                    }
                                };
                                if (part.args) {
                                    return {
                                        ...commonProps,
                                        args: part.args,
                                        argsText: part.argsText ?? JSON.stringify(part.args)
                                    };
                                }
                                return {
                                    ...commonProps,
                                    args: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$utils$2f$json$2f$parse$2d$partial$2d$json$2d$object$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePartialJsonObject"])(part.argsText ?? "") ?? {},
                                    argsText: part.argsText ?? ""
                                };
                            }
                        default:
                            {
                                const unhandledType = type;
                                throw new Error(`Unsupported assistant message part type: ${unhandledType}`);
                            }
                    }
                }).filter((c)=>!!c),
                status: status ?? fallbackStatus,
                metadata: {
                    unstable_state: metadata?.unstable_state ?? null,
                    unstable_annotations: metadata?.unstable_annotations ?? [],
                    unstable_data: metadata?.unstable_data ?? [],
                    custom: metadata?.custom ?? {},
                    steps: metadata?.steps ?? [],
                    ...metadata?.submittedFeedback && {
                        submittedFeedback: metadata.submittedFeedback
                    }
                }
            };
        case "user":
            return {
                ...common,
                role,
                content: content.map((part)=>{
                    const type = part.type;
                    switch(type){
                        case "text":
                        case "image":
                        case "audio":
                        case "file":
                            return part;
                        default:
                            {
                                const unhandledType = type;
                                throw new Error(`Unsupported user message part type: ${unhandledType}`);
                            }
                    }
                }),
                attachments: attachments ?? [],
                metadata: {
                    custom: metadata?.custom ?? {}
                }
            };
        case "system":
            if (content.length !== 1 || content[0].type !== "text") throw new Error("System messages must have exactly one text message part.");
            return {
                ...common,
                role,
                content: content,
                metadata: {
                    custom: metadata?.custom ?? {}
                }
            };
        default:
            {
                const unsupportedRole = role;
                throw new Error(`Unknown message role: ${unsupportedRole}`);
            }
    }
};
}),
"[project]/packages/react/src/legacy-runtime/runtime-cores/utils/message-repository.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExportedMessageRepository",
    ()=>ExportedMessageRepository,
    "MessageRepository",
    ()=>MessageRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$id$2d$utils$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/id-utils.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$auto$2d$status$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/external-store/auto-status.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$thread$2d$message$2d$like$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/external-store/thread-message-like.tsx [app-ssr] (ecmascript)");
;
;
;
const ExportedMessageRepository = {
    /**
   * Converts an array of messages to an ExportedMessageRepository format.
   * Creates parent-child relationships based on the order of messages in the array.
   *
   * @param messages - Array of message-like objects to convert
   * @returns ExportedMessageRepository with parent-child relationships established
   */ fromArray: (messages)=>{
        const conv = messages.map((m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$thread$2d$message$2d$like$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromThreadMessageLike"])(m, (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$id$2d$utils$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$auto$2d$status$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAutoStatus"])(false, false, false, false, undefined)));
        return {
            messages: conv.map((m, idx)=>({
                    parentId: idx > 0 ? conv[idx - 1].id : null,
                    message: m
                }))
        };
    }
};
/**
 * Recursively finds the head (leaf) message in a branch.
 *
 * @param message - The starting message or parent node
 * @returns The leaf message of the branch, or null if not found
 */ const findHead = (message)=>{
    if (message.next) return findHead(message.next);
    if ("current" in message) return message;
    return null;
};
/**
 * A utility class for caching computed values and invalidating the cache when needed.
 */ class CachedValue {
    func;
    _value;
    /**
   * @param func - The function that computes the cached value
   */ constructor(func){
        this.func = func;
        this._value = null;
    }
    /**
   * Gets the cached value, computing it if necessary.
   */ get value() {
        if (this._value === null) {
            this._value = this.func();
        }
        return this._value;
    }
    /**
   * Invalidates the cache, forcing recomputation on next access.
   */ dirty() {
        this._value = null;
    }
}
class MessageRepository {
    /** Map of message IDs to repository message objects */ messages = new Map();
    /** Reference to the current head (most recent) message in the active branch */ head = null;
    /** Root node of the tree structure */ root = {
        children: [],
        next: null
    };
    /**
   * Recursively updates the level of a message and all its descendants.
   *
   * @param message - The message to update
   * @param newLevel - The new level for the message
   */ updateLevels(message, newLevel) {
        message.level = newLevel;
        for (const childId of message.children){
            const childMessage = this.messages.get(childId);
            if (childMessage) {
                this.updateLevels(childMessage, newLevel + 1);
            }
        }
    }
    /**
   * Performs link/unlink operations between messages in the tree.
   *
   * @param newParent - The new parent message, or null
   * @param child - The child message to operate on
   * @param operation - The type of operation to perform:
   *   - "cut": Remove the child from its current parent
   *   - "link": Add the child to a new parent
   *   - "relink": Both cut and link operations
   */ performOp(newParent, child, operation) {
        const parentOrRoot = child.prev ?? this.root;
        const newParentOrRoot = newParent ?? this.root;
        if (operation === "relink" && parentOrRoot === newParentOrRoot) return;
        // cut
        if (operation !== "link") {
            // remove from parentOrRoot.children
            parentOrRoot.children = parentOrRoot.children.filter((m)=>m !== child.current.id);
            // update parentOrRoot.next
            if (parentOrRoot.next === child) {
                const fallbackId = parentOrRoot.children.at(-1);
                const fallback = fallbackId ? this.messages.get(fallbackId) : null;
                if (fallback === undefined) {
                    throw new Error("MessageRepository(performOp/cut): Fallback sibling message not found. This is likely an internal bug in assistant-ui.");
                }
                parentOrRoot.next = fallback;
            }
        }
        // link
        if (operation !== "cut") {
            // ensure the child is not part of parent tree
            for(let current = newParent; current; current = current.prev){
                if (current.current.id === child.current.id) {
                    throw new Error("MessageRepository(performOp/link): A message with the same id already exists in the parent tree. This error occurs if the same message id is found multiple times. This is likely an internal bug in assistant-ui.");
                }
            }
            // add to parentOrRoot.children
            newParentOrRoot.children = [
                ...newParentOrRoot.children,
                child.current.id
            ];
            // update parentOrRoot.next
            if (findHead(child) === this.head || newParentOrRoot.next === null) {
                newParentOrRoot.next = child;
            }
            child.prev = newParent;
            // update levels when linking/relinking to a new parent
            const newLevel = newParent ? newParent.level + 1 : 0;
            this.updateLevels(child, newLevel);
        }
    }
    /** Cached array of messages in the current active branch, from root to head */ _messages = new CachedValue(()=>{
        const messages = new Array((this.head?.level ?? -1) + 1);
        for(let current = this.head; current; current = current.prev){
            messages[current.level] = current.current;
        }
        return messages;
    });
    /**
   * Gets the ID of the current head message.
   * @returns The ID of the head message, or null if no messages exist
   */ get headId() {
        return this.head?.current.id ?? null;
    }
    /**
   * Gets all messages in the current active branch, from root to head.
   * @param headId - Optional ID of the head message to get messages for. If not provided, uses the current head.
   * @returns Array of messages in the specified branch
   */ getMessages(headId) {
        if (headId === undefined || headId === this.head?.current.id) {
            return this._messages.value;
        }
        const headMessage = this.messages.get(headId);
        if (!headMessage) {
            throw new Error("MessageRepository(getMessages): Head message not found. This is likely an internal bug in assistant-ui.");
        }
        const messages = new Array(headMessage.level + 1);
        for(let current = headMessage; current; current = current.prev){
            messages[current.level] = current.current;
        }
        return messages;
    }
    /**
   * Adds a new message or updates an existing one in the repository.
   * If the message ID already exists, the message is updated and potentially relinked to a new parent.
   * If the message is new, it's added as a child of the specified parent.
   *
   * @param parentId - ID of the parent message, or null for root messages
   * @param message - The message to add or update
   * @throws Error if the parent message is not found
   */ addOrUpdateMessage(parentId, message) {
        const existingItem = this.messages.get(message.id);
        const prev = parentId ? this.messages.get(parentId) : null;
        if (prev === undefined) throw new Error("MessageRepository(addOrUpdateMessage): Parent message not found. This is likely an internal bug in assistant-ui.");
        // update existing message
        if (existingItem) {
            existingItem.current = message;
            this.performOp(prev, existingItem, "relink");
            this._messages.dirty();
            return;
        }
        // create a new message
        const newItem = {
            prev,
            current: message,
            next: null,
            children: [],
            level: prev ? prev.level + 1 : 0
        };
        this.messages.set(message.id, newItem);
        this.performOp(prev, newItem, "link");
        if (this.head === prev) {
            this.head = newItem;
        }
        this._messages.dirty();
    }
    /**
   * Gets a message and its parent ID by message ID.
   *
   * @param messageId - ID of the message to retrieve
   * @returns Object containing the message and its parent ID
   * @throws Error if the message is not found
   */ getMessage(messageId) {
        const message = this.messages.get(messageId);
        if (!message) throw new Error("MessageRepository(updateMessage): Message not found. This is likely an internal bug in assistant-ui.");
        return {
            parentId: message.prev?.current.id ?? null,
            message: message.current,
            index: message.level
        };
    }
    /**
   * Adds an optimistic message to the repository.
   * An optimistic message is a temporary placeholder that will be replaced by a real message later.
   *
   * @param parentId - ID of the parent message, or null for root messages
   * @param message - The core message to convert to an optimistic message
   * @returns The generated optimistic ID
   */ appendOptimisticMessage(parentId, message) {
        let optimisticId;
        do {
            optimisticId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$id$2d$utils$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateOptimisticId"])();
        }while (this.messages.has(optimisticId))
        this.addOrUpdateMessage(parentId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$thread$2d$message$2d$like$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromThreadMessageLike"])(message, optimisticId, {
            type: "running"
        }));
        return optimisticId;
    }
    /**
   * Deletes a message from the repository and relinks its children.
   *
   * @param messageId - ID of the message to delete
   * @param replacementId - Optional ID of the message to become the new parent of the children,
   *                       undefined means use the deleted message's parent,
   *                       null means use the root
   * @throws Error if the message or replacement is not found
   */ deleteMessage(messageId, replacementId) {
        const message = this.messages.get(messageId);
        if (!message) throw new Error("MessageRepository(deleteMessage): Message not found. This is likely an internal bug in assistant-ui.");
        const replacement = replacementId === undefined ? message.prev // if no replacementId is provided, use the parent
         : replacementId === null ? null : this.messages.get(replacementId);
        if (replacement === undefined) throw new Error("MessageRepository(deleteMessage): Replacement not found. This is likely an internal bug in assistant-ui.");
        for (const child of message.children){
            const childMessage = this.messages.get(child);
            if (!childMessage) throw new Error("MessageRepository(deleteMessage): Child message not found. This is likely an internal bug in assistant-ui.");
            this.performOp(replacement, childMessage, "relink");
        }
        this.performOp(null, message, "cut");
        this.messages.delete(messageId);
        if (this.head === message) {
            this.head = findHead(replacement ?? this.root);
        }
        this._messages.dirty();
    }
    /**
   * Gets all branch IDs (sibling messages) at the level of a specified message.
   *
   * @param messageId - ID of the message to find branches for
   * @returns Array of message IDs representing branches
   * @throws Error if the message is not found
   */ getBranches(messageId) {
        const message = this.messages.get(messageId);
        if (!message) throw new Error("MessageRepository(getBranches): Message not found. This is likely an internal bug in assistant-ui.");
        const { children } = message.prev ?? this.root;
        return children;
    }
    /**
   * Switches the active branch to the one containing the specified message.
   *
   * @param messageId - ID of the message in the branch to switch to
   * @throws Error if the branch is not found
   */ switchToBranch(messageId) {
        const message = this.messages.get(messageId);
        if (!message) throw new Error("MessageRepository(switchToBranch): Branch not found. This is likely an internal bug in assistant-ui.");
        const prevOrRoot = message.prev ?? this.root;
        prevOrRoot.next = message;
        this.head = findHead(message);
        this._messages.dirty();
    }
    /**
   * Resets the head to a specific message or null.
   *
   * @param messageId - ID of the message to set as head, or null to clear the head
   * @throws Error if the message is not found
   */ resetHead(messageId) {
        if (messageId === null) {
            this.clear();
            return;
        }
        const message = this.messages.get(messageId);
        if (!message) throw new Error("MessageRepository(resetHead): Branch not found. This is likely an internal bug in assistant-ui.");
        if (message.children.length > 0) {
            const deleteDescendants = (msg)=>{
                for (const childId of msg.children){
                    const childMessage = this.messages.get(childId);
                    if (childMessage) {
                        deleteDescendants(childMessage);
                        this.messages.delete(childId);
                    }
                }
            };
            deleteDescendants(message);
            message.children = [];
            message.next = null;
        }
        this.head = message;
        for(let current = message; current; current = current.prev){
            if (current.prev) {
                current.prev.next = current;
            }
        }
        this._messages.dirty();
    }
    /**
   * Clears all messages from the repository.
   */ clear() {
        this.messages.clear();
        this.head = null;
        this.root = {
            children: [],
            next: null
        };
        this._messages.dirty();
    }
    /**
   * Exports the repository state for persistence.
   *
   * @returns Exportable repository state
   */ export() {
        const exportItems = [];
        // hint: we are relying on the insertion order of the messages
        // this is important for the import function to properly link the messages
        for (const [, message] of this.messages){
            exportItems.push({
                message: message.current,
                parentId: message.prev?.current.id ?? null
            });
        }
        return {
            headId: this.head?.current.id ?? null,
            messages: exportItems
        };
    }
    /**
   * Imports repository state from an exported repository.
   *
   * @param repository - The exported repository state to import
   */ import({ headId, messages }) {
        for (const { message, parentId } of messages){
            this.addOrUpdateMessage(parentId, message);
        }
        // switch to the saved head id if it is not the most recent message
        this.resetHead(headId ?? messages.at(-1)?.message.id ?? null);
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime-cores/core/base-assistant-runtime-core.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseAssistantRuntimeCore",
    ()=>BaseAssistantRuntimeCore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$composite$2d$context$2d$provider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/composite-context-provider.ts [app-ssr] (ecmascript)");
;
class BaseAssistantRuntimeCore {
    _contextProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$composite$2d$context$2d$provider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompositeContextProvider"]();
    registerModelContextProvider(provider) {
        return this._contextProvider.registerModelContextProvider(provider);
    }
    getModelContextProvider() {
        return this._contextProvider;
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/subscribable/base-subject.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseSubject",
    ()=>BaseSubject
]);
class BaseSubject {
    _subscriptions = new Set();
    _connection;
    get isConnected() {
        return !!this._connection;
    }
    notifySubscribers() {
        for (const callback of this._subscriptions)callback();
    }
    _updateConnection() {
        if (this._subscriptions.size > 0) {
            if (this._connection) return;
            this._connection = this._connect();
        } else {
            this._connection?.();
            this._connection = undefined;
        }
    }
    subscribe(callback) {
        this._subscriptions.add(callback);
        this._updateConnection();
        return ()=>{
            this._subscriptions.delete(callback);
            this._updateConnection();
        };
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/subscribable/skip-update.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SKIP_UPDATE",
    ()=>SKIP_UPDATE
]);
const SKIP_UPDATE = Symbol("skip-update");
}),
"[project]/packages/react/src/legacy-runtime/runtime/subscribable/lazy-memoize-subject.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LazyMemoizeSubject",
    ()=>LazyMemoizeSubject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$base$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/base-subject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/skip-update.ts [app-ssr] (ecmascript)");
;
;
class LazyMemoizeSubject extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$base$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseSubject"] {
    binding;
    get path() {
        return this.binding.path;
    }
    constructor(binding){
        super(), this.binding = binding, this._previousStateDirty = true, this.getState = ()=>{
            if (!this.isConnected || this._previousStateDirty) {
                const newState = this.binding.getState();
                if (newState !== __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"]) {
                    this._previousState = newState;
                }
                this._previousStateDirty = false;
            }
            if (this._previousState === undefined) throw new Error("Entry not available in the store");
            return this._previousState;
        };
    }
    _previousStateDirty;
    _previousState;
    getState;
    _connect() {
        const callback = ()=>{
            this._previousStateDirty = true;
            this.notifySubscribers();
        };
        return this.binding.subscribe(callback);
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/thread-list-item-runtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemRuntimeImpl",
    ()=>ThreadListItemRuntimeImpl
]);
class ThreadListItemRuntimeImpl {
    _core;
    _threadListBinding;
    get path() {
        return this._core.path;
    }
    constructor(_core, _threadListBinding){
        this._core = _core;
        this._threadListBinding = _threadListBinding;
        this.__internal_bindMethods();
    }
    __internal_bindMethods() {
        this.switchTo = this.switchTo.bind(this);
        this.rename = this.rename.bind(this);
        this.archive = this.archive.bind(this);
        this.unarchive = this.unarchive.bind(this);
        this.delete = this.delete.bind(this);
        this.initialize = this.initialize.bind(this);
        this.generateTitle = this.generateTitle.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unstable_on = this.unstable_on.bind(this);
        this.getState = this.getState.bind(this);
        this.detach = this.detach.bind(this);
    }
    getState() {
        return this._core.getState();
    }
    switchTo() {
        const state = this._core.getState();
        return this._threadListBinding.switchToThread(state.id);
    }
    rename(newTitle) {
        const state = this._core.getState();
        return this._threadListBinding.rename(state.id, newTitle);
    }
    archive() {
        const state = this._core.getState();
        return this._threadListBinding.archive(state.id);
    }
    unarchive() {
        const state = this._core.getState();
        return this._threadListBinding.unarchive(state.id);
    }
    delete() {
        const state = this._core.getState();
        return this._threadListBinding.delete(state.id);
    }
    initialize() {
        const state = this._core.getState();
        return this._threadListBinding.initialize(state.id);
    }
    generateTitle() {
        const state = this._core.getState();
        return this._threadListBinding.generateTitle(state.id);
    }
    unstable_on(event, callback) {
        // if the runtime is bound to a specific thread, trigger if isMain is toggled
        // if the runtime is bound to the main thread, trigger switchedTo if threadId changes
        let prevIsMain = this._core.getState().isMain;
        let prevThreadId = this._core.getState().id;
        return this.subscribe(()=>{
            const currentState = this._core.getState();
            const newIsMain = currentState.isMain;
            const newThreadId = currentState.id;
            if (prevIsMain === newIsMain && prevThreadId === newThreadId) return;
            prevIsMain = newIsMain;
            prevThreadId = newThreadId;
            if (event === "switchedTo" && !newIsMain) return;
            if (event === "switchedAway" && newIsMain) return;
            callback();
        });
    }
    subscribe(callback) {
        return this._core.subscribe(callback);
    }
    detach() {
        const state = this._core.getState();
        this._threadListBinding.detach(state.id);
    }
    /** @internal */ __internal_getRuntime() {
        return this;
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/subscribable/shallow-equal.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shallowEqual",
    ()=>shallowEqual
]);
function shallowEqual(objA, objB) {
    if (objA === undefined && objB === undefined) return true;
    if (objA === undefined) return false;
    if (objB === undefined) return false;
    for (const key of Object.keys(objA)){
        const valueA = objA[key];
        const valueB = objB[key];
        if (!Object.is(valueA, valueB)) return false;
    }
    return true;
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/subscribable/shallow-memoize-subject.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShallowMemoizeSubject",
    ()=>ShallowMemoizeSubject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$equal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/shallow-equal.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$base$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/base-subject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/skip-update.ts [app-ssr] (ecmascript)");
;
;
;
class ShallowMemoizeSubject extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$base$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseSubject"] {
    binding;
    get path() {
        return this.binding.path;
    }
    constructor(binding){
        super(), this.binding = binding, this.getState = ()=>{
            if (!this.isConnected) this._syncState();
            return this._previousState;
        };
        const state = binding.getState();
        if (state === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"]) throw new Error("Entry not available in the store");
        this._previousState = state;
    }
    _previousState;
    getState;
    _syncState() {
        const state = this.binding.getState();
        if (state === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"]) return false;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$equal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shallowEqual"])(state, this._previousState)) return false;
        this._previousState = state;
        return true;
    }
    _connect() {
        const callback = ()=>{
            if (this._syncState()) {
                this.notifySubscribers();
            }
        };
        return this.binding.subscribe(callback);
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime-cores/external-store/get-external-store-message.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getExternalStoreMessage",
    ()=>getExternalStoreMessage,
    "getExternalStoreMessages",
    ()=>getExternalStoreMessages,
    "symbolInnerMessage",
    ()=>symbolInnerMessage
]);
const symbolInnerMessage = Symbol("innerMessage");
const symbolInnerMessages = Symbol("innerMessages");
const getExternalStoreMessage = (input)=>{
    const withInnerMessages = input;
    return withInnerMessages[symbolInnerMessage];
};
const EMPTY_ARRAY = [];
const getExternalStoreMessages = (input)=>{
    // TODO temp until 0.12.0 (migrate useExternalStoreRuntime to always set an array)
    const container = "messages" in input ? input.messages : input;
    const value = container[symbolInnerMessages] || container[symbolInnerMessage];
    if (!value) return EMPTY_ARRAY;
    if (Array.isArray(value)) {
        return value;
    }
    container[symbolInnerMessages] = [
        value
    ];
    return container[symbolInnerMessages];
};
}),
"[project]/packages/react/src/utils/get-thread-message-text.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getThreadMessageText",
    ()=>getThreadMessageText
]);
const getThreadMessageText = (message)=>{
    const textParts = message.content.filter((part)=>part.type === "text");
    return textParts.map((part)=>part.text).join("\n\n");
};
}),
"[project]/packages/react/src/legacy-runtime/runtime/attachment-runtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentRuntimeImpl",
    ()=>AttachmentRuntimeImpl,
    "EditComposerAttachmentRuntimeImpl",
    ()=>EditComposerAttachmentRuntimeImpl,
    "MessageAttachmentRuntimeImpl",
    ()=>MessageAttachmentRuntimeImpl,
    "ThreadComposerAttachmentRuntimeImpl",
    ()=>ThreadComposerAttachmentRuntimeImpl
]);
class AttachmentRuntimeImpl {
    _core;
    get path() {
        return this._core.path;
    }
    constructor(_core){
        this._core = _core;
        this.__internal_bindMethods();
    }
    __internal_bindMethods() {
        this.getState = this.getState.bind(this);
        this.remove = this.remove.bind(this);
        this.subscribe = this.subscribe.bind(this);
    }
    getState() {
        return this._core.getState();
    }
    subscribe(callback) {
        return this._core.subscribe(callback);
    }
}
class ComposerAttachmentRuntime extends AttachmentRuntimeImpl {
    _composerApi;
    constructor(core, _composerApi){
        super(core), this._composerApi = _composerApi;
    }
    remove() {
        const core = this._composerApi.getState();
        if (!core) throw new Error("Composer is not available");
        return core.removeAttachment(this.getState().id);
    }
}
class ThreadComposerAttachmentRuntimeImpl extends ComposerAttachmentRuntime {
    get source() {
        return "thread-composer";
    }
}
class EditComposerAttachmentRuntimeImpl extends ComposerAttachmentRuntime {
    get source() {
        return "edit-composer";
    }
}
class MessageAttachmentRuntimeImpl extends AttachmentRuntimeImpl {
    get source() {
        return "message";
    }
    constructor(core){
        super(core);
    }
    remove() {
        throw new Error("Message attachments cannot be removed");
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/subscribable/event-subscription-subject.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventSubscriptionSubject",
    ()=>EventSubscriptionSubject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$base$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/base-subject.ts [app-ssr] (ecmascript)");
;
class EventSubscriptionSubject extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$base$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseSubject"] {
    config;
    constructor(config){
        super(), this.config = config;
    }
    getState() {
        return this.config.binding.getState();
    }
    outerSubscribe(callback) {
        return this.config.binding.subscribe(callback);
    }
    _connect() {
        const callback = ()=>{
            this.notifySubscribers();
        };
        let lastState = this.config.binding.getState();
        let innerUnsubscribe = lastState?.unstable_on(this.config.event, callback);
        const onRuntimeUpdate = ()=>{
            const newState = this.config.binding.getState();
            if (newState === lastState) return;
            lastState = newState;
            innerUnsubscribe?.();
            innerUnsubscribe = this.config.binding.getState()?.unstable_on(this.config.event, callback);
        };
        const outerUnsubscribe = this.outerSubscribe(onRuntimeUpdate);
        return ()=>{
            outerUnsubscribe?.();
            innerUnsubscribe?.();
        };
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/composer-runtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerRuntimeImpl",
    ()=>ComposerRuntimeImpl,
    "EditComposerRuntimeImpl",
    ()=>EditComposerRuntimeImpl,
    "ThreadComposerRuntimeImpl",
    ()=>ThreadComposerRuntimeImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$lazy$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/lazy-memoize-subject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$attachment$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/attachment-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/shallow-memoize-subject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/skip-update.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$event$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/event-subscription-subject.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_OBJECT = Object.freeze({});
const getThreadComposerState = (runtime)=>{
    return Object.freeze({
        type: "thread",
        isEditing: runtime?.isEditing ?? false,
        canCancel: runtime?.canCancel ?? false,
        isEmpty: runtime?.isEmpty ?? true,
        attachments: runtime?.attachments ?? EMPTY_ARRAY,
        text: runtime?.text ?? "",
        role: runtime?.role ?? "user",
        runConfig: runtime?.runConfig ?? EMPTY_OBJECT,
        attachmentAccept: runtime?.attachmentAccept ?? "",
        dictation: runtime?.dictation,
        value: runtime?.text ?? ""
    });
};
const getEditComposerState = (runtime)=>{
    return Object.freeze({
        type: "edit",
        isEditing: runtime?.isEditing ?? false,
        canCancel: runtime?.canCancel ?? false,
        isEmpty: runtime?.isEmpty ?? true,
        text: runtime?.text ?? "",
        role: runtime?.role ?? "user",
        attachments: runtime?.attachments ?? EMPTY_ARRAY,
        runConfig: runtime?.runConfig ?? EMPTY_OBJECT,
        attachmentAccept: runtime?.attachmentAccept ?? "",
        dictation: runtime?.dictation,
        value: runtime?.text ?? ""
    });
};
class ComposerRuntimeImpl {
    _core;
    get path() {
        return this._core.path;
    }
    constructor(_core){
        this._core = _core;
        this._eventSubscriptionSubjects = new Map();
    }
    __internal_bindMethods() {
        this.setText = this.setText.bind(this);
        this.setRunConfig = this.setRunConfig.bind(this);
        this.getState = this.getState.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.addAttachment = this.addAttachment.bind(this);
        this.reset = this.reset.bind(this);
        this.clearAttachments = this.clearAttachments.bind(this);
        this.send = this.send.bind(this);
        this.cancel = this.cancel.bind(this);
        this.setRole = this.setRole.bind(this);
        this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this);
        this.startDictation = this.startDictation.bind(this);
        this.stopDictation = this.stopDictation.bind(this);
        this.unstable_on = this.unstable_on.bind(this);
    }
    setText(text) {
        const core = this._core.getState();
        if (!core) throw new Error("Composer is not available");
        core.setText(text);
    }
    setRunConfig(runConfig) {
        const core = this._core.getState();
        if (!core) throw new Error("Composer is not available");
        core.setRunConfig(runConfig);
    }
    addAttachment(file) {
        const core = this._core.getState();
        if (!core) throw new Error("Composer is not available");
        return core.addAttachment(file);
    }
    reset() {
        const core = this._core.getState();
        if (!core) throw new Error("Composer is not available");
        return core.reset();
    }
    clearAttachments() {
        const core = this._core.getState();
        if (!core) throw new Error("Composer is not available");
        return core.clearAttachments();
    }
    send() {
        const core = this._core.getState();
        if (!core) throw new Error("Composer is not available");
        core.send();
    }
    cancel() {
        const core = this._core.getState();
        if (!core) throw new Error("Composer is not available");
        core.cancel();
    }
    setRole(role) {
        const core = this._core.getState();
        if (!core) throw new Error("Composer is not available");
        core.setRole(role);
    }
    startDictation() {
        const core = this._core.getState();
        if (!core) throw new Error("Composer is not available");
        core.startDictation();
    }
    stopDictation() {
        const core = this._core.getState();
        if (!core) throw new Error("Composer is not available");
        core.stopDictation();
    }
    subscribe(callback) {
        return this._core.subscribe(callback);
    }
    _eventSubscriptionSubjects;
    unstable_on(event, callback) {
        let subject = this._eventSubscriptionSubjects.get(event);
        if (!subject) {
            subject = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$event$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EventSubscriptionSubject"]({
                event: event,
                binding: this._core
            });
            this._eventSubscriptionSubjects.set(event, subject);
        }
        return subject.subscribe(callback);
    }
}
class ThreadComposerRuntimeImpl extends ComposerRuntimeImpl {
    get path() {
        return this._core.path;
    }
    get type() {
        return "thread";
    }
    _getState;
    constructor(core){
        const stateBinding = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$lazy$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LazyMemoizeSubject"]({
            path: core.path,
            getState: ()=>getThreadComposerState(core.getState()),
            subscribe: (callback)=>core.subscribe(callback)
        });
        super({
            path: core.path,
            getState: ()=>core.getState(),
            subscribe: (callback)=>stateBinding.subscribe(callback)
        });
        this._getState = stateBinding.getState.bind(stateBinding);
        this.__internal_bindMethods();
    }
    getState() {
        return this._getState();
    }
    getAttachmentByIndex(idx) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$attachment$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadComposerAttachmentRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path: {
                ...this.path,
                attachmentSource: "thread-composer",
                attachmentSelector: {
                    type: "index",
                    index: idx
                },
                ref: `${this.path.ref}.attachments[${idx}]`
            },
            getState: ()=>{
                const attachments = this.getState().attachments;
                const attachment = attachments[idx];
                if (!attachment) return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"];
                return {
                    ...attachment,
                    source: "thread-composer"
                };
            },
            subscribe: (callback)=>this._core.subscribe(callback)
        }), this._core);
    }
}
class EditComposerRuntimeImpl extends ComposerRuntimeImpl {
    _beginEdit;
    get path() {
        return this._core.path;
    }
    get type() {
        return "edit";
    }
    _getState;
    constructor(core, _beginEdit){
        const stateBinding = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$lazy$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LazyMemoizeSubject"]({
            path: core.path,
            getState: ()=>getEditComposerState(core.getState()),
            subscribe: (callback)=>core.subscribe(callback)
        });
        super({
            path: core.path,
            getState: ()=>core.getState(),
            subscribe: (callback)=>stateBinding.subscribe(callback)
        }), this._beginEdit = _beginEdit;
        this._getState = stateBinding.getState.bind(stateBinding);
        this.__internal_bindMethods();
    }
    __internal_bindMethods() {
        super.__internal_bindMethods();
        this.beginEdit = this.beginEdit.bind(this);
    }
    getState() {
        return this._getState();
    }
    beginEdit() {
        this._beginEdit();
    }
    getAttachmentByIndex(idx) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$attachment$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EditComposerAttachmentRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path: {
                ...this.path,
                attachmentSource: "edit-composer",
                attachmentSelector: {
                    type: "index",
                    index: idx
                },
                ref: `${this.path.ref}.attachments[${idx}]`
            },
            getState: ()=>{
                const attachments = this.getState().attachments;
                const attachment = attachments[idx];
                if (!attachment) return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"];
                return {
                    ...attachment,
                    source: "edit-composer"
                };
            },
            subscribe: (callback)=>this._core.subscribe(callback)
        }), this._core);
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/message-part-runtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartRuntimeImpl",
    ()=>MessagePartRuntimeImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$core$2f$tool$2f$ToolResponse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/assistant-stream@0.3.0/node_modules/assistant-stream/dist/core/tool/ToolResponse.js [app-ssr] (ecmascript)");
;
class MessagePartRuntimeImpl {
    contentBinding;
    messageApi;
    threadApi;
    get path() {
        return this.contentBinding.path;
    }
    constructor(contentBinding, messageApi, threadApi){
        this.contentBinding = contentBinding;
        this.messageApi = messageApi;
        this.threadApi = threadApi;
        this.__internal_bindMethods();
    }
    __internal_bindMethods() {
        this.addToolResult = this.addToolResult.bind(this);
        this.resumeToolCall = this.resumeToolCall.bind(this);
        this.getState = this.getState.bind(this);
        this.subscribe = this.subscribe.bind(this);
    }
    getState() {
        return this.contentBinding.getState();
    }
    addToolResult(result) {
        const state = this.contentBinding.getState();
        if (!state) throw new Error("Message part is not available");
        if (state.type !== "tool-call") throw new Error("Tried to add tool result to non-tool message part");
        if (!this.messageApi) throw new Error("Message API is not available. This is likely a bug in assistant-ui.");
        if (!this.threadApi) throw new Error("Thread API is not available");
        const message = this.messageApi.getState();
        if (!message) throw new Error("Message is not available");
        const toolName = state.toolName;
        const toolCallId = state.toolCallId;
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$core$2f$tool$2f$ToolResponse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToolResponse"].toResponse(result);
        this.threadApi.getState().addToolResult({
            messageId: message.id,
            toolName,
            toolCallId,
            result: response.result,
            artifact: response.artifact,
            isError: response.isError
        });
    }
    resumeToolCall(payload) {
        const state = this.contentBinding.getState();
        if (!state) throw new Error("Message part is not available");
        if (state.type !== "tool-call") throw new Error("Tried to resume tool call on non-tool message part");
        if (!this.threadApi) throw new Error("Thread API is not available");
        const toolCallId = state.toolCallId;
        this.threadApi.getState().resumeToolCall({
            toolCallId,
            payload
        });
    }
    subscribe(callback) {
        return this.contentBinding.subscribe(callback);
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/subscribable/nested-subscription-subject.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NestedSubscriptionSubject",
    ()=>NestedSubscriptionSubject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$base$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/base-subject.ts [app-ssr] (ecmascript)");
;
class NestedSubscriptionSubject extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$base$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseSubject"] {
    binding;
    get path() {
        return this.binding.path;
    }
    constructor(binding){
        super(), this.binding = binding;
    }
    getState() {
        return this.binding.getState();
    }
    outerSubscribe(callback) {
        return this.binding.subscribe(callback);
    }
    _connect() {
        const callback = ()=>{
            this.notifySubscribers();
        };
        let lastState = this.binding.getState();
        let innerUnsubscribe = lastState?.subscribe(callback);
        const onRuntimeUpdate = ()=>{
            const newState = this.binding.getState();
            if (newState === lastState) return;
            lastState = newState;
            innerUnsubscribe?.();
            innerUnsubscribe = this.binding.getState()?.subscribe(callback);
            callback();
        };
        const outerUnsubscribe = this.outerSubscribe(onRuntimeUpdate);
        return ()=>{
            outerUnsubscribe?.();
            innerUnsubscribe?.();
        };
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/message-runtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageRuntimeImpl",
    ()=>MessageRuntimeImpl,
    "toMessagePartStatus",
    ()=>toMessagePartStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$get$2d$external$2d$store$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/external-store/get-external-store-message.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$get$2d$thread$2d$message$2d$text$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/get-thread-message-text.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$attachment$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/attachment-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$composer$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/composer-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$message$2d$part$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/message-part-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$nested$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/nested-subscription-subject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/skip-update.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/shallow-memoize-subject.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
const COMPLETE_STATUS = Object.freeze({
    type: "complete"
});
const toMessagePartStatus = (message, partIndex, part)=>{
    if (message.role !== "assistant") return COMPLETE_STATUS;
    if (part.type === "tool-call") {
        if (!part.result) {
            return message.status;
        } else {
            return COMPLETE_STATUS;
        }
    }
    const isLastPart = partIndex === Math.max(0, message.content.length - 1);
    if (message.status.type === "requires-action") return COMPLETE_STATUS;
    return isLastPart ? message.status : COMPLETE_STATUS;
};
const getMessagePartState = (message, partIndex)=>{
    const part = message.content[partIndex];
    if (!part) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"];
    }
    // if the message part is the same, don't update
    const status = toMessagePartStatus(message, partIndex, part);
    return Object.freeze({
        ...part,
        ...{
            [__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$get$2d$external$2d$store$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["symbolInnerMessage"]]: part[__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$get$2d$external$2d$store$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["symbolInnerMessage"]]
        },
        status
    });
};
class MessageRuntimeImpl {
    _core;
    _threadBinding;
    get path() {
        return this._core.path;
    }
    constructor(_core, _threadBinding){
        this._core = _core;
        this._threadBinding = _threadBinding;
        this._getEditComposerRuntimeCore = ()=>{
            return this._threadBinding.getState().getEditComposer(this._core.getState().id);
        };
        this.composer = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$composer$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EditComposerRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$nested$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NestedSubscriptionSubject"]({
            path: {
                ...this.path,
                ref: `${this.path.ref}${this.path.ref}.composer`,
                composerSource: "edit"
            },
            getState: this._getEditComposerRuntimeCore,
            subscribe: (callback)=>this._threadBinding.subscribe(callback)
        }), ()=>this._threadBinding.getState().beginEdit(this._core.getState().id));
        this.__internal_bindMethods();
    }
    __internal_bindMethods() {
        this.reload = this.reload.bind(this);
        this.getState = this.getState.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.getMessagePartByIndex = this.getMessagePartByIndex.bind(this);
        this.getMessagePartByToolCallId = this.getMessagePartByToolCallId.bind(this);
        this.getAttachmentByIndex = this.getAttachmentByIndex.bind(this);
        this.unstable_getCopyText = this.unstable_getCopyText.bind(this);
        this.speak = this.speak.bind(this);
        this.stopSpeaking = this.stopSpeaking.bind(this);
        this.submitFeedback = this.submitFeedback.bind(this);
        this.switchToBranch = this.switchToBranch.bind(this);
    }
    composer;
    _getEditComposerRuntimeCore;
    getState() {
        return this._core.getState();
    }
    reload(reloadConfig = {}) {
        const editComposerRuntimeCore = this._getEditComposerRuntimeCore();
        const composerRuntimeCore = editComposerRuntimeCore ?? this._threadBinding.getState().composer;
        const composer = editComposerRuntimeCore ?? composerRuntimeCore;
        const { runConfig = composer.runConfig } = reloadConfig;
        const state = this._core.getState();
        if (state.role !== "assistant") throw new Error("Can only reload assistant messages");
        this._threadBinding.getState().startRun({
            parentId: state.parentId,
            sourceId: state.id,
            runConfig
        });
    }
    speak() {
        const state = this._core.getState();
        return this._threadBinding.getState().speak(state.id);
    }
    stopSpeaking() {
        const state = this._core.getState();
        const thread = this._threadBinding.getState();
        if (thread.speech?.messageId === state.id) {
            this._threadBinding.getState().stopSpeaking();
        } else {
            throw new Error("Message is not being spoken");
        }
    }
    submitFeedback({ type }) {
        const state = this._core.getState();
        this._threadBinding.getState().submitFeedback({
            messageId: state.id,
            type
        });
    }
    switchToBranch({ position, branchId }) {
        const state = this._core.getState();
        if (branchId && position) {
            throw new Error("May not specify both branchId and position");
        } else if (!branchId && !position) {
            throw new Error("Must specify either branchId or position");
        }
        const thread = this._threadBinding.getState();
        const branches = thread.getBranches(state.id);
        let targetBranch = branchId;
        if (position === "previous") {
            targetBranch = branches[state.branchNumber - 2];
        } else if (position === "next") {
            targetBranch = branches[state.branchNumber];
        }
        if (!targetBranch) throw new Error("Branch not found");
        this._threadBinding.getState().switchToBranch(targetBranch);
    }
    unstable_getCopyText() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$get$2d$thread$2d$message$2d$text$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getThreadMessageText"])(this.getState());
    }
    subscribe(callback) {
        return this._core.subscribe(callback);
    }
    getMessagePartByIndex(idx) {
        if (idx < 0) throw new Error("Message part index must be >= 0");
        return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$message$2d$part$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path: {
                ...this.path,
                ref: `${this.path.ref}${this.path.ref}.content[${idx}]`,
                messagePartSelector: {
                    type: "index",
                    index: idx
                }
            },
            getState: ()=>{
                return getMessagePartState(this.getState(), idx);
            },
            subscribe: (callback)=>this._core.subscribe(callback)
        }), this._core, this._threadBinding);
    }
    getMessagePartByToolCallId(toolCallId) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$message$2d$part$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePartRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path: {
                ...this.path,
                ref: this.path.ref + `${this.path.ref}.content[toolCallId=${JSON.stringify(toolCallId)}]`,
                messagePartSelector: {
                    type: "toolCallId",
                    toolCallId
                }
            },
            getState: ()=>{
                const state = this._core.getState();
                const idx = state.content.findIndex((part)=>part.type === "tool-call" && part.toolCallId === toolCallId);
                if (idx === -1) return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"];
                return getMessagePartState(state, idx);
            },
            subscribe: (callback)=>this._core.subscribe(callback)
        }), this._core, this._threadBinding);
    }
    getAttachmentByIndex(idx) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$attachment$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessageAttachmentRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path: {
                ...this.path,
                ref: `${this.path.ref}${this.path.ref}.attachments[${idx}]`,
                attachmentSource: "message",
                attachmentSelector: {
                    type: "index",
                    index: idx
                }
            },
            getState: ()=>{
                const attachments = this.getState().attachments;
                const attachment = attachments?.[idx];
                if (!attachment) return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"];
                return {
                    ...attachment,
                    source: "message"
                };
            },
            subscribe: (callback)=>this._core.subscribe(callback)
        }));
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/thread-runtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadRuntimeImpl",
    ()=>ThreadRuntimeImpl,
    "getThreadState",
    ()=>getThreadState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$message$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/message-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$nested$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/nested-subscription-subject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/shallow-memoize-subject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$composer$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/composer-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/skip-update.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$event$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/event-subscription-subject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$get$2d$external$2d$store$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/external-store/get-external-store-message.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const toResumeRunConfig = (message)=>{
    return {
        parentId: message.parentId ?? null,
        sourceId: message.sourceId ?? null,
        runConfig: message.runConfig ?? {},
        ...message.stream ? {
            stream: message.stream
        } : {}
    };
};
const toStartRunConfig = (message)=>{
    return {
        parentId: message.parentId ?? null,
        sourceId: message.sourceId ?? null,
        runConfig: message.runConfig ?? {}
    };
};
const toAppendMessage = (messages, message)=>{
    if (typeof message === "string") {
        return {
            createdAt: new Date(),
            parentId: messages.at(-1)?.id ?? null,
            sourceId: null,
            runConfig: {},
            role: "user",
            content: [
                {
                    type: "text",
                    text: message
                }
            ],
            attachments: [],
            metadata: {
                custom: {}
            }
        };
    }
    return {
        createdAt: message.createdAt ?? new Date(),
        parentId: message.parentId ?? messages.at(-1)?.id ?? null,
        sourceId: message.sourceId ?? null,
        role: message.role ?? "user",
        content: message.content,
        attachments: message.attachments ?? [],
        metadata: message.metadata ?? {
            custom: {}
        },
        runConfig: message.runConfig ?? {},
        startRun: message.startRun
    };
};
const getThreadState = (runtime, threadListItemState)=>{
    const lastMessage = runtime.messages.at(-1);
    return Object.freeze({
        threadId: threadListItemState.id,
        metadata: threadListItemState,
        capabilities: runtime.capabilities,
        isDisabled: runtime.isDisabled,
        isLoading: runtime.isLoading,
        isRunning: lastMessage?.role !== "assistant" ? false : lastMessage.status.type === "running",
        messages: runtime.messages,
        state: runtime.state,
        suggestions: runtime.suggestions,
        extras: runtime.extras,
        speech: runtime.speech
    });
};
class ThreadRuntimeImpl {
    get path() {
        return this._threadBinding.path;
    }
    get __internal_threadBinding() {
        return this._threadBinding;
    }
    _threadBinding;
    constructor(threadBinding, threadListItemBinding){
        const stateBinding = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path: threadBinding.path,
            getState: ()=>getThreadState(threadBinding.getState(), threadListItemBinding.getState()),
            subscribe: (callback)=>{
                const sub1 = threadBinding.subscribe(callback);
                const sub2 = threadListItemBinding.subscribe(callback);
                return ()=>{
                    sub1();
                    sub2();
                };
            }
        });
        this._threadBinding = {
            path: threadBinding.path,
            getState: ()=>threadBinding.getState(),
            getStateState: ()=>stateBinding.getState(),
            outerSubscribe: (callback)=>threadBinding.outerSubscribe(callback),
            subscribe: (callback)=>threadBinding.subscribe(callback)
        };
        this.composer = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$composer$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadComposerRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$nested$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NestedSubscriptionSubject"]({
            path: {
                ...this.path,
                ref: `${this.path.ref}${this.path.ref}.composer`,
                composerSource: "thread"
            },
            getState: ()=>this._threadBinding.getState().composer,
            subscribe: (callback)=>this._threadBinding.subscribe(callback)
        }));
        this.__internal_bindMethods();
    }
    __internal_bindMethods() {
        this.append = this.append.bind(this);
        this.unstable_resumeRun = this.unstable_resumeRun.bind(this);
        this.unstable_loadExternalState = this.unstable_loadExternalState.bind(this);
        this.startRun = this.startRun.bind(this);
        this.cancelRun = this.cancelRun.bind(this);
        this.stopSpeaking = this.stopSpeaking.bind(this);
        this.export = this.export.bind(this);
        this.import = this.import.bind(this);
        this.reset = this.reset.bind(this);
        this.getMessageByIndex = this.getMessageByIndex.bind(this);
        this.getMessageById = this.getMessageById.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unstable_on = this.unstable_on.bind(this);
        this.getModelContext = this.getModelContext.bind(this);
        this.getModelConfig = this.getModelConfig.bind(this);
        this.getState = this.getState.bind(this);
    }
    composer;
    getState() {
        return this._threadBinding.getStateState();
    }
    append(message) {
        this._threadBinding.getState().append(toAppendMessage(this._threadBinding.getState().messages, message));
    }
    subscribe(callback) {
        return this._threadBinding.subscribe(callback);
    }
    getModelContext() {
        return this._threadBinding.getState().getModelContext();
    }
    getModelConfig() {
        return this.getModelContext();
    }
    startRun(configOrParentId) {
        const config = configOrParentId === null || typeof configOrParentId === "string" ? {
            parentId: configOrParentId
        } : configOrParentId;
        return this._threadBinding.getState().startRun(toStartRunConfig(config));
    }
    unstable_resumeRun(config) {
        return this._threadBinding.getState().resumeRun(toResumeRunConfig(config));
    }
    unstable_loadExternalState(state) {
        this._threadBinding.getState().unstable_loadExternalState(state);
    }
    cancelRun() {
        this._threadBinding.getState().cancelRun();
    }
    stopSpeaking() {
        return this._threadBinding.getState().stopSpeaking();
    }
    export() {
        return this._threadBinding.getState().export();
    }
    import(data) {
        this._threadBinding.getState().import(data);
    }
    reset(initialMessages) {
        this._threadBinding.getState().reset(initialMessages);
    }
    getMessageByIndex(idx) {
        if (idx < 0) throw new Error("Message index must be >= 0");
        return this._getMessageRuntime({
            ...this.path,
            ref: `${this.path.ref}${this.path.ref}.messages[${idx}]`,
            messageSelector: {
                type: "index",
                index: idx
            }
        }, ()=>{
            const messages = this._threadBinding.getState().messages;
            const message = messages[idx];
            if (!message) return undefined;
            return {
                message,
                parentId: messages[idx - 1]?.id ?? null,
                index: idx
            };
        });
    }
    getMessageById(messageId) {
        return this._getMessageRuntime({
            ...this.path,
            ref: this.path.ref + `${this.path.ref}.messages[messageId=${JSON.stringify(messageId)}]`,
            messageSelector: {
                type: "messageId",
                messageId: messageId
            }
        }, ()=>this._threadBinding.getState().getMessageById(messageId));
    }
    _getMessageRuntime(path, callback) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$message$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessageRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path,
            getState: ()=>{
                const { message, parentId, index } = callback() ?? {};
                const { messages, speech: speechState } = this._threadBinding.getState();
                if (!message || parentId === undefined || index === undefined) return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"];
                const thread = this._threadBinding.getState();
                const branches = thread.getBranches(message.id);
                const submittedFeedback = message.metadata.submittedFeedback;
                return {
                    ...message,
                    ...{
                        [__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$get$2d$external$2d$store$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["symbolInnerMessage"]]: message[__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$get$2d$external$2d$store$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["symbolInnerMessage"]]
                    },
                    index,
                    isLast: messages.at(-1)?.id === message.id,
                    parentId,
                    branchNumber: branches.indexOf(message.id) + 1,
                    branchCount: branches.length,
                    speech: speechState?.messageId === message.id ? speechState : undefined,
                    submittedFeedback
                };
            },
            subscribe: (callback)=>this._threadBinding.subscribe(callback)
        }), this._threadBinding);
    }
    _eventSubscriptionSubjects = new Map();
    unstable_on(event, callback) {
        let subject = this._eventSubscriptionSubjects.get(event);
        if (!subject) {
            subject = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$event$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EventSubscriptionSubject"]({
                event: event,
                binding: this._threadBinding
            });
            this._eventSubscriptionSubjects.set(event, subject);
        }
        return subject.subscribe(callback);
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/thread-list-runtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListRuntimeImpl",
    ()=>ThreadListRuntimeImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$lazy$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/lazy-memoize-subject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$list$2d$item$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/thread-list-item-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/skip-update.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/shallow-memoize-subject.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/thread-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$nested$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/subscribable/nested-subscription-subject.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const getThreadListState = (threadList)=>{
    return {
        mainThreadId: threadList.mainThreadId,
        newThreadId: threadList.newThreadId,
        threadIds: threadList.threadIds,
        archivedThreadIds: threadList.archivedThreadIds,
        isLoading: threadList.isLoading,
        threadItems: threadList.threadItems
    };
};
const getThreadListItemState = (threadList, threadId)=>{
    if (threadId === undefined) return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"];
    const threadData = threadList.getItemById(threadId);
    if (!threadData) return __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$skip$2d$update$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIP_UPDATE"];
    return {
        id: threadData.id,
        remoteId: threadData.remoteId,
        externalId: threadData.externalId,
        title: threadData.title,
        status: threadData.status,
        isMain: threadData.id === threadList.mainThreadId
    };
};
class ThreadListRuntimeImpl {
    _core;
    _runtimeFactory;
    _getState;
    constructor(_core, _runtimeFactory = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadRuntimeImpl"]){
        this._core = _core;
        this._runtimeFactory = _runtimeFactory;
        const stateBinding = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$lazy$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LazyMemoizeSubject"]({
            path: {},
            getState: ()=>getThreadListState(_core),
            subscribe: (callback)=>_core.subscribe(callback)
        });
        this._getState = stateBinding.getState.bind(stateBinding);
        this._mainThreadListItemRuntime = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$list$2d$item$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path: {
                ref: `threadItems[main]`,
                threadSelector: {
                    type: "main"
                }
            },
            getState: ()=>{
                return getThreadListItemState(this._core, this._core.mainThreadId);
            },
            subscribe: (callback)=>this._core.subscribe(callback)
        }), this._core);
        this.main = new _runtimeFactory(new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$nested$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NestedSubscriptionSubject"]({
            path: {
                ref: "threads.main",
                threadSelector: {
                    type: "main"
                }
            },
            getState: ()=>_core.getMainThreadRuntimeCore(),
            subscribe: (callback)=>_core.subscribe(callback)
        }), this._mainThreadListItemRuntime);
        this.__internal_bindMethods();
    }
    __internal_bindMethods() {
        this.switchToThread = this.switchToThread.bind(this);
        this.switchToNewThread = this.switchToNewThread.bind(this);
        this.getState = this.getState.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.getById = this.getById.bind(this);
        this.getItemById = this.getItemById.bind(this);
        this.getItemByIndex = this.getItemByIndex.bind(this);
        this.getArchivedItemByIndex = this.getArchivedItemByIndex.bind(this);
    }
    switchToThread(threadId) {
        return this._core.switchToThread(threadId);
    }
    switchToNewThread() {
        return this._core.switchToNewThread();
    }
    getState() {
        return this._getState();
    }
    subscribe(callback) {
        return this._core.subscribe(callback);
    }
    _mainThreadListItemRuntime;
    main;
    get mainItem() {
        return this._mainThreadListItemRuntime;
    }
    getById(threadId) {
        return new this._runtimeFactory(new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$nested$2d$subscription$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NestedSubscriptionSubject"]({
            path: {
                ref: `threads[threadId=${JSON.stringify(threadId)}]`,
                threadSelector: {
                    type: "threadId",
                    threadId
                }
            },
            getState: ()=>this._core.getThreadRuntimeCore(threadId),
            subscribe: (callback)=>this._core.subscribe(callback)
        }), this.mainItem);
    }
    getItemByIndex(idx) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$list$2d$item$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path: {
                ref: `threadItems[${idx}]`,
                threadSelector: {
                    type: "index",
                    index: idx
                }
            },
            getState: ()=>{
                return getThreadListItemState(this._core, this._core.threadIds[idx]);
            },
            subscribe: (callback)=>this._core.subscribe(callback)
        }), this._core);
    }
    getArchivedItemByIndex(idx) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$list$2d$item$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path: {
                ref: `archivedThreadItems[${idx}]`,
                threadSelector: {
                    type: "archiveIndex",
                    index: idx
                }
            },
            getState: ()=>{
                return getThreadListItemState(this._core, this._core.archivedThreadIds[idx]);
            },
            subscribe: (callback)=>this._core.subscribe(callback)
        }), this._core);
    }
    getItemById(threadId) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$list$2d$item$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemRuntimeImpl"](new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$subscribable$2f$shallow$2d$memoize$2d$subject$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShallowMemoizeSubject"]({
            path: {
                ref: `threadItems[threadId=${threadId}]`,
                threadSelector: {
                    type: "threadId",
                    threadId
                }
            },
            getState: ()=>{
                return getThreadListItemState(this._core, threadId);
            },
            subscribe: (callback)=>this._core.subscribe(callback)
        }), this._core);
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime/assistant-runtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssistantRuntimeImpl",
    ()=>AssistantRuntimeImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$list$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/thread-list-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$utils$2f$message$2d$repository$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/utils/message-repository.tsx [app-ssr] (ecmascript)");
;
;
class AssistantRuntimeImpl {
    _core;
    threads;
    get threadList() {
        return this.threads;
    }
    _thread;
    constructor(_core){
        this._core = _core;
        this.threads = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$list$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListRuntimeImpl"](_core.threads);
        this._thread = this.threads.main;
        this.__internal_bindMethods();
    }
    __internal_bindMethods() {
        this.switchToNewThread = this.switchToNewThread.bind(this);
        this.switchToThread = this.switchToThread.bind(this);
        this.registerModelContextProvider = this.registerModelContextProvider.bind(this);
        this.registerModelConfigProvider = this.registerModelConfigProvider.bind(this);
        this.reset = this.reset.bind(this);
    }
    get thread() {
        return this._thread;
    }
    switchToNewThread() {
        return this._core.threads.switchToNewThread();
    }
    switchToThread(threadId) {
        return this._core.threads.switchToThread(threadId);
    }
    registerModelContextProvider(provider) {
        return this._core.registerModelContextProvider(provider);
    }
    registerModelConfigProvider(provider) {
        return this.registerModelContextProvider(provider);
    }
    reset({ initialMessages } = {}) {
        return this._core.threads.getMainThreadRuntimeCore().import(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$utils$2f$message$2d$repository$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExportedMessageRepository"].fromArray(initialMessages ?? []));
    }
}
}),
"[project]/packages/react/src/legacy-runtime/runtime-cores/local/local-runtime-options.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "splitLocalRuntimeOptions",
    ()=>splitLocalRuntimeOptions
]);
const splitLocalRuntimeOptions = (options)=>{
    const { cloud, initialMessages, maxSteps, adapters, unstable_humanToolNames, ...rest } = options;
    return {
        localRuntimeOptions: {
            cloud,
            initialMessages,
            maxSteps,
            adapters,
            unstable_humanToolNames
        },
        otherOptions: rest
    };
};
}),
"[project]/packages/react/src/legacy-runtime/runtime-cores/assistant-transport/use-tool-invocations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useToolInvocations",
    ()=>useToolInvocations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$core$2f$modules$2f$assistant$2d$stream$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/assistant-stream@0.3.0/node_modules/assistant-stream/dist/core/modules/assistant-stream.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$core$2f$tool$2f$ToolResponse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/assistant-stream@0.3.0/node_modules/assistant-stream/dist/core/tool/ToolResponse.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$core$2f$tool$2f$toolResultStream$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__toolResultStream__as__unstable_toolResultStream$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/assistant-stream@0.3.0/node_modules/assistant-stream/dist/core/tool/toolResultStream.js [app-ssr] (ecmascript) <export toolResultStream as unstable_toolResultStream>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$core$2f$utils$2f$stream$2f$AssistantMetaTransformStream$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/assistant-stream@0.3.0/node_modules/assistant-stream/dist/core/utils/stream/AssistantMetaTransformStream.js [app-ssr] (ecmascript)");
;
;
;
const isArgsTextComplete = (argsText)=>{
    try {
        JSON.parse(argsText);
        return true;
    } catch  {
        return false;
    }
};
function useToolInvocations({ state, getTools, onResult, setToolStatuses }) {
    const lastToolStates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const humanInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const acRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new AbortController());
    const executingCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const settledResolversRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const [controller] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        const [stream, controller] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$core$2f$modules$2f$assistant$2d$stream$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createAssistantStreamController"])();
        const transform = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$core$2f$tool$2f$toolResultStream$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__toolResultStream__as__unstable_toolResultStream$3e$__["unstable_toolResultStream"])(getTools, ()=>acRef.current?.signal ?? new AbortController().signal, (toolCallId, payload)=>{
            return new Promise((resolve, reject)=>{
                // Reject previous human input request if it exists
                const previous = humanInputRef.current.get(toolCallId);
                if (previous) {
                    previous.reject(new Error("Human input request was superseded by a new request"));
                }
                humanInputRef.current.set(toolCallId, {
                    resolve,
                    reject
                });
                setToolStatuses((prev)=>({
                        ...prev,
                        [toolCallId]: {
                            type: "interrupt",
                            payload: {
                                type: "human",
                                payload
                            }
                        }
                    }));
            });
        }, {
            onExecutionStart: (toolCallId)=>{
                executingCountRef.current++;
                setToolStatuses((prev)=>({
                        ...prev,
                        [toolCallId]: {
                            type: "executing"
                        }
                    }));
            },
            onExecutionEnd: (toolCallId)=>{
                executingCountRef.current--;
                setToolStatuses((prev)=>{
                    const next = {
                        ...prev
                    };
                    delete next[toolCallId];
                    return next;
                });
                // Resolve any waiting abort promises when all tools have settled
                if (executingCountRef.current === 0) {
                    settledResolversRef.current.forEach((resolve)=>resolve());
                    settledResolversRef.current = [];
                }
            }
        });
        stream.pipeThrough(transform).pipeThrough(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$core$2f$utils$2f$stream$2f$AssistantMetaTransformStream$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AssistantMetaTransformStream"]()).pipeTo(new WritableStream({
            write (chunk) {
                if (chunk.type === "result") {
                    // the tool call result was already set by the backend
                    if (lastToolStates.current[chunk.meta.toolCallId]?.hasResult) return;
                    onResult({
                        type: "add-tool-result",
                        toolCallId: chunk.meta.toolCallId,
                        toolName: chunk.meta.toolName,
                        result: chunk.result,
                        isError: chunk.isError,
                        ...chunk.artifact && {
                            artifact: chunk.artifact
                        }
                    });
                }
            }
        }));
        return controller;
    });
    const ignoredToolIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    const isInitialState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const processMessages = (messages)=>{
            messages.forEach((message)=>{
                message.content.forEach((content)=>{
                    if (content.type === "tool-call") {
                        if (isInitialState.current) {
                            ignoredToolIds.current.add(content.toolCallId);
                        } else {
                            if (ignoredToolIds.current.has(content.toolCallId)) {
                                return;
                            }
                            let lastState = lastToolStates.current[content.toolCallId];
                            if (!lastState) {
                                const toolCallController = controller.addToolCallPart({
                                    toolName: content.toolName,
                                    toolCallId: content.toolCallId
                                });
                                lastState = {
                                    argsText: "",
                                    hasResult: false,
                                    argsComplete: false,
                                    controller: toolCallController
                                };
                                lastToolStates.current[content.toolCallId] = lastState;
                            }
                            if (content.argsText !== lastState.argsText) {
                                if (lastState.argsComplete) {
                                    if ("TURBOPACK compile-time truthy", 1) {
                                        console.warn("argsText updated after controller was closed:", {
                                            previous: lastState.argsText,
                                            next: content.argsText
                                        });
                                    }
                                } else {
                                    if (!content.argsText.startsWith(lastState.argsText)) {
                                        // Check if this is key reordering (both are complete JSON)
                                        // This happens when transitioning from streaming to complete state
                                        // and the provider returns keys in a different order
                                        if (isArgsTextComplete(lastState.argsText) && isArgsTextComplete(content.argsText)) {
                                            lastState.controller.argsText.close();
                                            lastToolStates.current[content.toolCallId] = {
                                                argsText: content.argsText,
                                                hasResult: lastState.hasResult,
                                                argsComplete: true,
                                                controller: lastState.controller
                                            };
                                            return; // Continue to next content part
                                        }
                                        throw new Error(`Tool call argsText can only be appended, not updated: ${content.argsText} does not start with ${lastState.argsText}`);
                                    }
                                    const argsTextDelta = content.argsText.slice(lastState.argsText.length);
                                    lastState.controller.argsText.append(argsTextDelta);
                                    const shouldClose = isArgsTextComplete(content.argsText);
                                    if (shouldClose) {
                                        lastState.controller.argsText.close();
                                    }
                                    lastToolStates.current[content.toolCallId] = {
                                        argsText: content.argsText,
                                        hasResult: lastState.hasResult,
                                        argsComplete: shouldClose,
                                        controller: lastState.controller
                                    };
                                }
                            }
                            if (content.result !== undefined && !lastState.hasResult) {
                                lastState.controller.setResponse(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$assistant$2d$stream$40$0$2e$3$2e$0$2f$node_modules$2f$assistant$2d$stream$2f$dist$2f$core$2f$tool$2f$ToolResponse$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToolResponse"]({
                                    result: content.result,
                                    artifact: content.artifact,
                                    isError: content.isError
                                }));
                                lastState.controller.close();
                                lastToolStates.current[content.toolCallId] = {
                                    hasResult: true,
                                    argsComplete: true,
                                    argsText: lastState.argsText,
                                    controller: lastState.controller
                                };
                            }
                        }
                        // Recursively process nested messages
                        if (content.messages) {
                            processMessages(content.messages);
                        }
                    }
                });
            });
        };
        processMessages(state.messages);
        if (isInitialState.current) {
            isInitialState.current = false;
        }
    }, [
        state,
        controller
    ]);
    const abort = ()=>{
        humanInputRef.current.forEach(({ reject })=>{
            reject(new Error("Tool execution aborted"));
        });
        humanInputRef.current.clear();
        acRef.current.abort();
        acRef.current = new AbortController();
        // Return a promise that resolves when all executing tools have settled
        if (executingCountRef.current === 0) {
            return Promise.resolve();
        }
        return new Promise((resolve)=>{
            settledResolversRef.current.push(resolve);
        });
    };
    return {
        reset: ()=>{
            void abort();
            isInitialState.current = true;
        },
        abort,
        resume: (toolCallId, payload)=>{
            const handlers = humanInputRef.current.get(toolCallId);
            if (handlers) {
                humanInputRef.current.delete(toolCallId);
                setToolStatuses((prev)=>({
                        ...prev,
                        [toolCallId]: {
                            type: "executing"
                        }
                    }));
                handlers.resolve(payload);
            } else {
                throw new Error(`Tool call ${toolCallId} is not waiting for human input`);
            }
        }
    };
}
}),
"[project]/packages/react/src/utils/smooth/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
"use client";
;
;
}),
"[project]/packages/react/src/utils/smooth/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSmooth",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$use$2d$smooth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSmooth"],
    "useSmoothStatus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$smooth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSmoothStatus"],
    "withSmoothContextProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$smooth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withSmoothContextProvider"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/utils/smooth/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$use$2d$smooth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/smooth/use-smooth.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$smooth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/smooth/smooth-context.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/internal.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssistantRuntimeImpl",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$assistant$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AssistantRuntimeImpl"],
    "BaseAssistantRuntimeCore",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$core$2f$base$2d$assistant$2d$runtime$2d$core$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseAssistantRuntimeCore"],
    "CompositeContextProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$composite$2d$context$2d$provider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CompositeContextProvider"],
    "DefaultThreadComposerRuntimeCore",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$composer$2f$default$2d$thread$2d$composer$2d$runtime$2d$core$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultThreadComposerRuntimeCore"],
    "MessageRepository",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$utils$2f$message$2d$repository$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessageRepository"],
    "ThreadRuntimeImpl",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadRuntimeImpl"],
    "fromThreadMessageLike",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$thread$2d$message$2d$like$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fromThreadMessageLike"],
    "generateId",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$id$2d$utils$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateId"],
    "getAutoStatus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$auto$2d$status$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAutoStatus"],
    "splitLocalRuntimeOptions",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$local$2f$local$2d$runtime$2d$options$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["splitLocalRuntimeOptions"],
    "useSmooth",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSmooth"],
    "useSmoothStatus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSmoothStatus"],
    "useToolInvocations",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$assistant$2d$transport$2f$use$2d$tool$2d$invocations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToolInvocations"],
    "withSmoothContextProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withSmoothContextProvider"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$internal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/internal.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$composer$2f$default$2d$thread$2d$composer$2d$runtime$2d$core$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/composer/default-thread-composer-runtime-core.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$composite$2d$context$2d$provider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/composite-context-provider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$utils$2f$message$2d$repository$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/utils/message-repository.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$core$2f$base$2d$assistant$2d$runtime$2d$core$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/core/base-assistant-runtime-core.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$id$2d$utils$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/id-utils.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$assistant$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/assistant-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2f$thread$2d$runtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime/thread-runtime.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$thread$2d$message$2d$like$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/external-store/thread-message-like.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$external$2d$store$2f$auto$2d$status$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/external-store/auto-status.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$local$2f$local$2d$runtime$2d$options$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/local/local-runtime-options.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$cores$2f$assistant$2d$transport$2f$use$2d$tool$2d$invocations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-cores/assistant-transport/use-tool-invocations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/smooth/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/internal.ts [app-ssr] (ecmascript) <export * as INTERNAL>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INTERNAL",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$internal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$internal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/internal.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/react-markdown/src/memoization.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "areNodesEqual",
    ()=>areNodesEqual,
    "memoCompareNodes",
    ()=>memoCompareNodes,
    "memoizeMarkdownComponents",
    ()=>memoizeMarkdownComponents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const areChildrenEqual = (prev, next)=>{
    if (typeof prev === "string") return prev === next;
    return JSON.stringify(prev) === JSON.stringify(next);
};
const areNodesEqual = (prev, next)=>{
    if (!prev || !next) return false;
    const excludeMetadata = (props)=>{
        const { position, data, ...rest } = props || {};
        return rest;
    };
    return JSON.stringify(excludeMetadata(prev.properties)) === JSON.stringify(excludeMetadata(next.properties)) && areChildrenEqual(prev.children, next.children);
};
const memoCompareNodes = (prev, next)=>{
    return areNodesEqual(prev.node, next.node);
};
const memoizeMarkdownComponents = (components = {})=>{
    return Object.fromEntries(Object.entries(components ?? {}).map(([key, value])=>{
        if (!value) return [
            key,
            value
        ];
        const Component = value;
        const WithoutNode = ({ node, ...props })=>{
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                ...props
            }, void 0, false, {
                fileName: "[project]/packages/react-markdown/src/memoization.tsx",
                lineNumber: 52,
                columnNumber: 16
            }, ("TURBOPACK compile-time value", void 0));
        };
        return [
            key,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(WithoutNode, memoCompareNodes)
        ];
    }));
};
}),
"[project]/packages/react-markdown/src/overrides/PreOverride.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PreContext",
    ()=>PreContext,
    "PreOverride",
    ()=>PreOverride,
    "useIsMarkdownCodeBlock",
    ()=>useIsMarkdownCodeBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$memoization$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/memoization.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const PreContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const useIsMarkdownCodeBlock = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(PreContext) !== null;
};
const PreOverrideImpl = ({ children, ...rest })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PreContext.Provider, {
        value: rest,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react-markdown/src/overrides/PreOverride.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const PreOverride = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(PreOverrideImpl, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$memoization$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memoCompareNodes"]);
}),
"[project]/packages/react-markdown/src/overrides/defaultComponents.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DefaultCode",
    ()=>DefaultCode,
    "DefaultCodeBlockContent",
    ()=>DefaultCodeBlockContent,
    "DefaultCodeHeader",
    ()=>DefaultCodeHeader,
    "DefaultPre",
    ()=>DefaultPre
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const DefaultPre = ({ node, ...rest })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
        ...rest
    }, void 0, false, {
        fileName: "[project]/packages/react-markdown/src/overrides/defaultComponents.tsx",
        lineNumber: 6,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const DefaultCode = ({ node, ...rest })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
        ...rest
    }, void 0, false, {
        fileName: "[project]/packages/react-markdown/src/overrides/defaultComponents.tsx",
        lineNumber: 10,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const DefaultCodeBlockContent = ({ node, components: { Pre, Code }, code })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Pre, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Code, {
            node: node,
            children: code
        }, void 0, false, {
            fileName: "[project]/packages/react-markdown/src/overrides/defaultComponents.tsx",
            lineNumber: 19,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react-markdown/src/overrides/defaultComponents.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const DefaultCodeHeader = ()=>null;
}),
"[project]/packages/react-markdown/src/overrides/CodeBlock.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DefaultCodeBlock",
    ()=>DefaultCodeBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$defaultComponents$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/overrides/defaultComponents.tsx [app-ssr] (ecmascript)");
;
;
;
const DefaultCodeBlock = ({ node, components: { Pre, Code, SyntaxHighlighter, CodeHeader }, language, code })=>{
    const components = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            Pre,
            Code
        }), [
        Pre,
        Code
    ]);
    const SH = language ? SyntaxHighlighter : __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$defaultComponents$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultCodeBlockContent"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CodeHeader, {
                node: node,
                language: language,
                code: code
            }, void 0, false, {
                fileName: "[project]/packages/react-markdown/src/overrides/CodeBlock.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SH, {
                node: node,
                components: components,
                language: language ?? "unknown",
                code: code
            }, void 0, false, {
                fileName: "[project]/packages/react-markdown/src/overrides/CodeBlock.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
}),
"[project]/packages/react-markdown/src/overrides/withDefaults.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withDefaultProps",
    ()=>withDefaultProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$classnames$40$2$2e$5$2e$1$2f$node_modules$2f$classnames$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js [app-ssr] (ecmascript)");
;
const withDefaultProps = ({ className, ...defaultProps })=>({ className: classNameProp, ...props })=>{
        return {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$classnames$40$2$2e$5$2e$1$2f$node_modules$2f$classnames$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(className, classNameProp),
            ...defaultProps,
            ...props
        };
    };
}),
"[project]/packages/react-markdown/src/overrides/CodeOverride.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CodeOverride",
    ()=>CodeOverride
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$PreOverride$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/overrides/PreOverride.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$CodeBlock$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/overrides/CodeBlock.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$withDefaults$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/overrides/withDefaults.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$defaultComponents$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/overrides/defaultComponents.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$memoization$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/memoization.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
const CodeBlockOverride = ({ node, components: { Pre, Code, SyntaxHighlighter: FallbackSyntaxHighlighter, CodeHeader: FallbackCodeHeader }, componentsByLanguage = {}, children, ...codeProps })=>{
    const preProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$PreOverride$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PreContext"]);
    const getPreProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$withDefaults$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withDefaultProps"])(preProps);
    const WrappedPre = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallbackRef"])((props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Pre, {
            ...getPreProps(props)
        }, void 0, false, {
            fileName: "[project]/packages/react-markdown/src/overrides/CodeOverride.tsx",
            lineNumber: 36,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)));
    const getCodeProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$withDefaults$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["withDefaultProps"])(codeProps);
    const WrappedCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallbackRef"])((props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Code, {
            ...getCodeProps(props)
        }, void 0, false, {
            fileName: "[project]/packages/react-markdown/src/overrides/CodeOverride.tsx",
            lineNumber: 41,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)));
    const language = /language-(\w+)/.exec(codeProps.className || "")?.[1] ?? "";
    // if the code content is not string (due to rehype plugins), return a default code block
    if (typeof children !== "string") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$defaultComponents$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultCodeBlockContent"], {
            node: node,
            components: {
                Pre: WrappedPre,
                Code: WrappedCode
            },
            code: children
        }, void 0, false, {
            fileName: "[project]/packages/react-markdown/src/overrides/CodeOverride.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    const SyntaxHighlighter = componentsByLanguage[language]?.SyntaxHighlighter ?? FallbackSyntaxHighlighter;
    const CodeHeader = componentsByLanguage[language]?.CodeHeader ?? FallbackCodeHeader;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$CodeBlock$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultCodeBlock"], {
        node: node,
        components: {
            Pre: WrappedPre,
            Code: WrappedCode,
            SyntaxHighlighter,
            CodeHeader
        },
        language: language || "unknown",
        code: children
    }, void 0, false, {
        fileName: "[project]/packages/react-markdown/src/overrides/CodeOverride.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const CodeOverrideImpl = ({ node, components, componentsByLanguage, ...props })=>{
    const isCodeBlock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$PreOverride$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useIsMarkdownCodeBlock"])();
    if (!isCodeBlock) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(components.Code, {
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/react-markdown/src/overrides/CodeOverride.tsx",
        lineNumber: 104,
        columnNumber: 28
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CodeBlockOverride, {
        node: node,
        components: components,
        componentsByLanguage: componentsByLanguage,
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/react-markdown/src/overrides/CodeOverride.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const CodeOverride = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(CodeOverrideImpl, (prev, next)=>{
    const isEqual = prev.components === next.components && prev.componentsByLanguage === next.componentsByLanguage && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$memoization$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memoCompareNodes"])(prev, next);
    return isEqual;
});
}),
"[project]/packages/react-markdown/src/primitives/MarkdownText.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarkdownTextPrimitive",
    ()=>MarkdownTextPrimitive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$internal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__INTERNAL$3e$__ = __turbopack_context__.i("[project]/packages/react/src/internal.ts [app-ssr] (ecmascript) <export * as INTERNAL>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$text$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/use-message-part-text.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$markdown$40$10$2e$1$2e$0_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-markdown@10.1.0_@types+react@19.2.10_react@19.2.4/node_modules/react-markdown/lib/index.js [app-ssr] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$PreOverride$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/overrides/PreOverride.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$defaultComponents$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/overrides/defaultComponents.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$CodeOverride$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/overrides/CodeOverride.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$classnames$40$2$2e$5$2e$1$2f$node_modules$2f$classnames$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
const { useSmooth, useSmoothStatus, withSmoothContextProvider } = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$internal$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__INTERNAL$3e$__["INTERNAL"];
const MarkdownTextInner = ({ components: userComponents, componentsByLanguage, smooth = true, preprocess, ...rest })=>{
    const messagePartText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$text$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMessagePartText"])();
    const processedMessagePart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!preprocess) return messagePartText;
        return {
            ...messagePartText,
            text: preprocess(messagePartText.text)
        };
    }, [
        messagePartText,
        preprocess
    ]);
    const { text } = useSmooth(processedMessagePart, smooth);
    const { pre = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$defaultComponents$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultPre"], code = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$defaultComponents$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultCode"], SyntaxHighlighter = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$defaultComponents$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultCodeBlockContent"], CodeHeader = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$defaultComponents$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DefaultCodeHeader"] } = userComponents ?? {};
    const useCodeOverrideComponents = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return {
            Pre: pre,
            Code: code,
            SyntaxHighlighter,
            CodeHeader
        };
    }, [
        pre,
        code,
        SyntaxHighlighter,
        CodeHeader
    ]);
    const CodeComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallbackRef"])((props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$CodeOverride$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CodeOverride"], {
            components: useCodeOverrideComponents,
            componentsByLanguage: componentsByLanguage,
            ...props
        }, void 0, false, {
            fileName: "[project]/packages/react-markdown/src/primitives/MarkdownText.tsx",
            lineNumber: 102,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0)));
    const components = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const { pre, code, SyntaxHighlighter, CodeHeader, ...componentsRest } = userComponents ?? {};
        return {
            ...componentsRest,
            pre: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$overrides$2f$PreOverride$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PreOverride"],
            code: CodeComponent
        };
    }, [
        CodeComponent,
        userComponents
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$markdown$40$10$2e$1$2e$0_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
        components: components,
        ...rest,
        children: text
    }, void 0, false, {
        fileName: "[project]/packages/react-markdown/src/primitives/MarkdownText.tsx",
        lineNumber: 120,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const MarkdownTextPrimitiveImpl = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, containerProps, containerComponent: Container = "div", ...rest }, forwardedRef)=>{
    const status = useSmoothStatus();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Container, {
        "data-status": status.type,
        ...containerProps,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$classnames$40$2$2e$5$2e$1$2f$node_modules$2f$classnames$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(className, containerProps?.className),
        ref: forwardedRef,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MarkdownTextInner, {
            ...rest
        }, void 0, false, {
            fileName: "[project]/packages/react-markdown/src/primitives/MarkdownText.tsx",
            lineNumber: 148,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react-markdown/src/primitives/MarkdownText.tsx",
        lineNumber: 142,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
MarkdownTextPrimitiveImpl.displayName = "MarkdownTextPrimitive";
const MarkdownTextPrimitive = withSmoothContextProvider(MarkdownTextPrimitiveImpl);
}),
"[project]/packages/react-markdown/src/memoization.tsx [app-ssr] (ecmascript) <export memoizeMarkdownComponents as unstable_memoizeMarkdownComponents>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unstable_memoizeMarkdownComponents",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$memoization$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memoizeMarkdownComponents"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2d$markdown$2f$src$2f$memoization$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react-markdown/src/memoization.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/reasoning/use-scroll-lock.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useScrollLock",
    ()=>useScrollLock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
const useScrollLock = (animatedElementRef, animationDuration)=>{
    const scrollContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cleanupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            cleanupRef.current?.();
        };
    }, []);
    const lockScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        cleanupRef.current?.();
        (function findScrollableAncestor() {
            if (scrollContainerRef.current || !animatedElementRef.current) return;
            let el = animatedElementRef.current;
            while(el){
                const { overflowY } = getComputedStyle(el);
                if (overflowY === "scroll" || overflowY === "auto") {
                    scrollContainerRef.current = el;
                    break;
                }
                el = el.parentElement;
            }
        })();
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;
        const scrollPosition = scrollContainer.scrollTop;
        const scrollbarWidth = scrollContainer.style.scrollbarWidth;
        scrollContainer.style.scrollbarWidth = "none";
        const resetPosition = ()=>scrollContainer.scrollTop = scrollPosition;
        scrollContainer.addEventListener("scroll", resetPosition);
        const timeoutId = setTimeout(()=>{
            scrollContainer.removeEventListener("scroll", resetPosition);
            scrollContainer.style.scrollbarWidth = scrollbarWidth;
            cleanupRef.current = null;
        }, animationDuration);
        cleanupRef.current = ()=>{
            clearTimeout(timeoutId);
            scrollContainer.removeEventListener("scroll", resetPosition);
            scrollContainer.style.scrollbarWidth = scrollbarWidth;
        };
    }, [
        animationDuration,
        animatedElementRef
    ]);
    return lockScroll;
};
}),
"[project]/packages/react/src/primitives/action-bar-more/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
}),
"[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDropdownMenuScope",
    ()=>useDropdownMenuScope
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
;
const useDropdownMenuScope = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDropdownMenuScope"]();
}),
"[project]/packages/react/src/primitives/action-bar-more/action-bar-more-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitiveRoot",
    ()=>ActionBarMorePrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const ActionBarMorePrimitiveRoot = ({ __scopeActionBarMore, ...rest })=>{
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeActionBarMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        ...scope,
        ...rest
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar-more/action-bar-more-root.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
ActionBarMorePrimitiveRoot.displayName = "ActionBarMorePrimitive.Root";
}),
"[project]/packages/react/src/primitives/action-bar-more/action-bar-more-trigger.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitiveTrigger",
    ()=>ActionBarMorePrimitiveTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ActionBarMorePrimitiveTrigger = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ __scopeActionBarMore, ...rest }, ref)=>{
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeActionBarMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar-more/action-bar-more-trigger.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
ActionBarMorePrimitiveTrigger.displayName = "ActionBarMorePrimitive.Trigger";
}),
"[project]/packages/react/src/primitives/action-bar-more/action-bar-more-content.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitiveContent",
    ()=>ActionBarMorePrimitiveContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ActionBarMorePrimitiveContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ __scopeActionBarMore, portalProps, sideOffset = 4, ...props }, forwardedRef)=>{
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeActionBarMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        ...scope,
        ...portalProps,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
            ...scope,
            ...props,
            ref: forwardedRef,
            sideOffset: sideOffset
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/action-bar-more/action-bar-more-content.tsx",
            lineNumber: 35,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar-more/action-bar-more-content.tsx",
        lineNumber: 34,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
ActionBarMorePrimitiveContent.displayName = "ActionBarMorePrimitive.Content";
}),
"[project]/packages/react/src/primitives/action-bar-more/action-bar-more-item.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitiveItem",
    ()=>ActionBarMorePrimitiveItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ActionBarMorePrimitiveItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ __scopeActionBarMore, ...rest }, ref)=>{
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeActionBarMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Item"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar-more/action-bar-more-item.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
ActionBarMorePrimitiveItem.displayName = "ActionBarMorePrimitive.Item";
}),
"[project]/packages/react/src/primitives/action-bar-more/action-bar-more-separator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitiveSeparator",
    ()=>ActionBarMorePrimitiveSeparator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ActionBarMorePrimitiveSeparator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ __scopeActionBarMore, ...rest }, ref)=>{
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeActionBarMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar-more/action-bar-more-separator.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
ActionBarMorePrimitiveSeparator.displayName = "ActionBarMorePrimitive.Separator";
}),
"[project]/packages/react/src/primitives/action-bar-more/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Content",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$content$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarMorePrimitiveContent"],
    "Item",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$item$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarMorePrimitiveItem"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarMorePrimitiveRoot"],
    "Separator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarMorePrimitiveSeparator"],
    "Trigger",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$trigger$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarMorePrimitiveTrigger"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/action-bar-more-root.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$trigger$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/action-bar-more-trigger.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$content$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/action-bar-more-content.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$item$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/action-bar-more-item.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/action-bar-more-separator.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/action-bar-more/index.ts [app-ssr] (ecmascript) <export * as ActionBarMorePrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/action-bar/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
;
;
;
}),
"[project]/packages/react/src/primitives/action-bar/use-action-bar-float-status.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HideAndFloatStatus",
    ()=>HideAndFloatStatus,
    "useActionBarFloatStatus",
    ()=>useActionBarFloatStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
var HideAndFloatStatus = /*#__PURE__*/ function(HideAndFloatStatus) {
    HideAndFloatStatus["Hidden"] = "hidden";
    HideAndFloatStatus["Floating"] = "floating";
    HideAndFloatStatus["Normal"] = "normal";
    return HideAndFloatStatus;
}({});
const useActionBarFloatStatus = ({ hideWhenRunning, autohide, autohideFloat })=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ thread, message })=>{
        if (hideWhenRunning && thread.isRunning) return "hidden";
        const autohideEnabled = autohide === "always" || autohide === "not-last" && !message.isLast;
        // normal status
        if (!autohideEnabled) return "normal";
        // hidden status
        if (!message.isHovering) return "hidden";
        // floating status
        if (autohideFloat === "always" || autohideFloat === "single-branch" && message.branchCount <= 1) return "floating";
        return "normal";
    });
};
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveRoot",
    ()=>ActionBarPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$use$2d$action$2d$bar$2d$float$2d$status$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/use-action-bar-float-status.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ActionBarPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ hideWhenRunning, autohide, autohideFloat, ...rest }, ref)=>{
    const hideAndfloatStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$use$2d$action$2d$bar$2d$float$2d$status$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useActionBarFloatStatus"])({
        hideWhenRunning,
        autohide,
        autohideFloat
    });
    if (hideAndfloatStatus === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$use$2d$action$2d$bar$2d$float$2d$status$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HideAndFloatStatus"].Hidden) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...hideAndfloatStatus === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$use$2d$action$2d$bar$2d$float$2d$status$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HideAndFloatStatus"].Floating ? {
            "data-floating": "true"
        } : null,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-root.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ActionBarPrimitiveRoot.displayName = "ActionBarPrimitive.Root";
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-copy.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveCopy",
    ()=>ActionBarPrimitiveCopy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
/**
 * Hook that provides copy functionality for action bar buttons.
 *
 * This hook returns a callback function that copies message content to the clipboard,
 * or null if copying is not available. It handles both regular message content and
 * composer text when in editing mode.
 *
 * @param options Configuration options
 * @param options.copiedDuration Duration in milliseconds to show the copied state
 * @returns A copy callback function, or null if copying is disabled
 *
 * @example
 * ```tsx
 * function CustomCopyButton() {
 *   const copy = useActionBarPrimitiveCopy({ copiedDuration: 2000 });
 *
 *   return (
 *     <button onClick={copy} disabled={!copy}>
 *       {copy ? "Copy" : "Cannot Copy"}
 *     </button>
 *   );
 * }
 * ```
 */ const useActionBarPrimitiveCopy = ({ copiedDuration = 3000 } = {})=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const hasCopyableContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>{
        return (message.role !== "assistant" || message.status?.type !== "running") && message.parts.some((c)=>c.type === "text" && c.text.length > 0);
    });
    const isEditing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ composer })=>composer.isEditing);
    const composerValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ composer })=>composer.text);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const valueToCopy = isEditing ? composerValue : aui.message().getCopyText();
        if (!valueToCopy) return;
        navigator.clipboard.writeText(valueToCopy).then(()=>{
            aui.message().setIsCopied(true);
            setTimeout(()=>aui.message().setIsCopied(false), copiedDuration);
        });
    }, [
        aui,
        isEditing,
        composerValue,
        copiedDuration
    ]);
    if (!hasCopyableContent) return null;
    return callback;
};
const ActionBarPrimitiveCopy = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ copiedDuration, onClick, disabled, ...props }, forwardedRef)=>{
    const isCopied = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.isCopied);
    const callback = useActionBarPrimitiveCopy({
        copiedDuration
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isCopied ? {
            "data-copied": "true"
        } : {},
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-copy.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ActionBarPrimitiveCopy.displayName = "ActionBarPrimitive.Copy";
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-reload.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveReload",
    ()=>ActionBarPrimitiveReload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
/**
 * Hook that provides reload functionality for action bar buttons.
 *
 * This hook returns a callback function that reloads/regenerates the current assistant message,
 * or null if reloading is not available (e.g., thread is running, disabled, or message is not from assistant).
 *
 * @returns A reload callback function, or null if reloading is disabled
 *
 * @example
 * ```tsx
 * function CustomReloadButton() {
 *   const reload = useActionBarReload();
 *
 *   return (
 *     <button onClick={reload} disabled={!reload}>
 *       {reload ? "Reload Message" : "Cannot Reload"}
 *     </button>
 *   );
 * }
 * ```
 */ const useActionBarReload = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])((s)=>s.thread.isRunning || s.thread.isDisabled || s.message.role !== "assistant");
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.message().reload();
    }, [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
const ActionBarPrimitiveReload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ActionBarPrimitive.Reload", useActionBarReload);
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-edit.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveEdit",
    ()=>ActionBarPrimitiveEdit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
/**
 * Hook that provides edit functionality for action bar buttons.
 *
 * This hook returns a callback function that starts editing the current message,
 * or null if editing is not available (e.g., already in editing mode).
 *
 * @returns An edit callback function, or null if editing is disabled
 *
 * @example
 * ```tsx
 * function CustomEditButton() {
 *   const edit = useActionBarEdit();
 *
 *   return (
 *     <button onClick={edit} disabled={!edit}>
 *       {edit ? "Edit Message" : "Cannot Edit"}
 *     </button>
 *   );
 * }
 * ```
 */ const useActionBarEdit = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ composer })=>composer.isEditing);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.composer().beginEdit();
    }, [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
const ActionBarPrimitiveEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ActionBarPrimitive.Edit", useActionBarEdit);
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-speak.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveSpeak",
    ()=>ActionBarPrimitiveSpeak
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const useActionBarSpeak = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        aui.message().speak();
    }, [
        aui
    ]);
    const hasSpeakableContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>{
        return (message.role !== "assistant" || message.status?.type !== "running") && message.parts.some((c)=>c.type === "text" && c.text.length > 0);
    });
    if (!hasSpeakableContent) return null;
    return callback;
};
const ActionBarPrimitiveSpeak = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ActionBarPrimitive.Speak", useActionBarSpeak);
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-stop-speaking.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveStopSpeaking",
    ()=>ActionBarPrimitiveStopSpeaking
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-escape-keydown@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
const useActionBarStopSpeaking = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const isSpeaking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.speech != null);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.message().stopSpeaking();
    }, [
        aui
    ]);
    if (!isSpeaking) return null;
    return callback;
};
const ActionBarPrimitiveStopSpeaking = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const callback = useActionBarStopSpeaking();
    // TODO this stops working if the user is not hovering over an older message
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEscapeKeydown"])((e)=>{
        if (callback) {
            e.preventDefault();
            callback();
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        disabled: !callback,
        ...props,
        ref: ref,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onClick, ()=>{
            callback?.();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-stop-speaking.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ActionBarPrimitiveStopSpeaking.displayName = "ActionBarPrimitive.StopSpeaking";
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-feedback-positive.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveFeedbackPositive",
    ()=>ActionBarPrimitiveFeedbackPositive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const useActionBarFeedbackPositive = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.message().submitFeedback({
            type: "positive"
        });
    }, [
        aui
    ]);
    return callback;
};
const ActionBarPrimitiveFeedbackPositive = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ onClick, disabled, ...props }, forwardedRef)=>{
    const isSubmitted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])((s)=>s.message.metadata.submittedFeedback?.type === "positive");
    const callback = useActionBarFeedbackPositive();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isSubmitted ? {
            "data-submitted": "true"
        } : {},
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-feedback-positive.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ActionBarPrimitiveFeedbackPositive.displayName = "ActionBarPrimitive.FeedbackPositive";
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-feedback-negative.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveFeedbackNegative",
    ()=>ActionBarPrimitiveFeedbackNegative
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const useActionBarFeedbackNegative = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.message().submitFeedback({
            type: "negative"
        });
    }, [
        aui
    ]);
    return callback;
};
const ActionBarPrimitiveFeedbackNegative = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ onClick, disabled, ...props }, forwardedRef)=>{
    const isSubmitted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])((s)=>s.message.metadata.submittedFeedback?.type === "negative");
    const callback = useActionBarFeedbackNegative();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isSubmitted ? {
            "data-submitted": "true"
        } : {},
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-feedback-negative.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ActionBarPrimitiveFeedbackNegative.displayName = "ActionBarPrimitive.FeedbackNegative";
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-export-markdown.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveExportMarkdown",
    ()=>ActionBarPrimitiveExportMarkdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const useActionBarExportMarkdown = ({ filename, onExport } = {})=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const hasExportableContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>{
        return (message.role !== "assistant" || message.status?.type !== "running") && message.parts.some((c)=>c.type === "text" && c.text.length > 0);
    });
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const content = aui.message().getCopyText();
        if (!content) return;
        if (onExport) {
            await onExport(content);
            return;
        }
        const blob = new Blob([
            content
        ], {
            type: "text/markdown"
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename ?? `message-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
    }, [
        aui,
        filename,
        onExport
    ]);
    if (!hasExportableContent) return null;
    return callback;
};
const ActionBarPrimitiveExportMarkdown = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ filename, onExport, onClick, disabled, ...props }, forwardedRef)=>{
    const callback = useActionBarExportMarkdown({
        filename,
        onExport
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-export-markdown.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ActionBarPrimitiveExportMarkdown.displayName = "ActionBarPrimitive.ExportMarkdown";
}),
"[project]/packages/react/src/primitives/action-bar/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Copy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$copy$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveCopy"],
    "Edit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$edit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveEdit"],
    "ExportMarkdown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$export$2d$markdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveExportMarkdown"],
    "FeedbackNegative",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$feedback$2d$negative$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveFeedbackNegative"],
    "FeedbackPositive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$feedback$2d$positive$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveFeedbackPositive"],
    "Reload",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$reload$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveReload"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveRoot"],
    "Speak",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$speak$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveSpeak"],
    "StopSpeaking",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$stop$2d$speaking$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActionBarPrimitiveStopSpeaking"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-root.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$copy$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-copy.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$reload$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-reload.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$edit$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-edit.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$speak$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-speak.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$stop$2d$speaking$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-stop-speaking.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$feedback$2d$positive$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-feedback-positive.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$feedback$2d$negative$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-feedback-negative.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$export$2d$markdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-export-markdown.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/action-bar/index.ts [app-ssr] (ecmascript) <export * as ActionBarPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/store/src/aui-if.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuiIf",
    ()=>AuiIf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
const AuiIf = ({ children, condition })=>{
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(condition);
    return result ? children : null;
};
AuiIf.displayName = "AuiIf";
}),
"[project]/packages/store/src/aui-if.tsx [app-ssr] (ecmascript) <export AuiIf as AssistantIf>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssistantIf",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$aui$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuiIf"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$aui$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/aui-if.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/branch-picker/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
}),
"[project]/packages/react/src/primitives/branch-picker/branch-picker-next.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveNext",
    ()=>BranchPickerPrimitiveNext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const useBranchPickerNext = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ thread, message })=>{
        // Disabled if no next branch
        if (message.branchNumber >= message.branchCount) return true;
        // Disabled if running and capability not supported
        if (thread.isRunning && !thread.capabilities.switchBranchDuringRun) {
            return true;
        }
        return false;
    });
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.message().switchToBranch({
            position: "next"
        });
    }, [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
const BranchPickerPrimitiveNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("BranchPickerPrimitive.Next", useBranchPickerNext);
}),
"[project]/packages/react/src/primitives/branch-picker/branch-picker-previous.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitivePrevious",
    ()=>BranchPickerPrimitivePrevious
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
/**
 * Hook that provides navigation to the previous branch functionality.
 *
 * This hook returns a callback function that switches to the previous branch
 * in the message branch tree, or null if there is no previous branch available.
 *
 * @returns A previous branch callback function, or null if navigation is disabled
 *
 * @example
 * ```tsx
 * function CustomPreviousButton() {
 *   const previous = useBranchPickerPrevious();
 *
 *   return (
 *     <button onClick={previous} disabled={!previous}>
 *       {previous ? "Previous Branch" : "No Previous Branch"}
 *     </button>
 *   );
 * }
 * ```
 */ const useBranchPickerPrevious = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ thread, message })=>{
        // Disabled if no previous branch
        if (message.branchNumber <= 1) return true;
        // Disabled if running and capability not supported
        if (thread.isRunning && !thread.capabilities.switchBranchDuringRun) {
            return true;
        }
        return false;
    });
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.message().switchToBranch({
            position: "previous"
        });
    }, [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
const BranchPickerPrimitivePrevious = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("BranchPickerPrimitive.Previous", useBranchPickerPrevious);
}),
"[project]/packages/react/src/primitives/branch-picker/branch-picker-count.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveCount",
    ()=>BranchPickerPrimitiveCount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
;
const useBranchPickerCount = ()=>{
    const branchCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.branchCount);
    return branchCount;
};
const BranchPickerPrimitiveCount = ()=>{
    const branchCount = useBranchPickerCount();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: branchCount
    }, void 0, false);
};
BranchPickerPrimitiveCount.displayName = "BranchPickerPrimitive.Count";
}),
"[project]/packages/react/src/primitives/branch-picker/branch-picker-number.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveNumber",
    ()=>BranchPickerPrimitiveNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
;
const useBranchPickerNumber = ()=>{
    const branchNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.branchNumber);
    return branchNumber;
};
const BranchPickerPrimitiveNumber = ()=>{
    const branchNumber = useBranchPickerNumber();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: branchNumber
    }, void 0, false);
};
BranchPickerPrimitiveNumber.displayName = "BranchPickerPrimitive.Number";
}),
"[project]/packages/react/src/primitives/message/message-if.tsx [app-ssr] (ecmascript) <export MessagePrimitiveIf as If>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagePrimitiveIf"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-if.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/branch-picker/branch-picker-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveRoot",
    ()=>BranchPickerPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__MessagePrimitiveIf__as__If$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-if.tsx [app-ssr] (ecmascript) <export MessagePrimitiveIf as If>");
"use client";
;
;
;
;
const BranchPickerPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ hideWhenSingleBranch, ...rest }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__MessagePrimitiveIf__as__If$3e$__["If"], {
        hasBranches: hideWhenSingleBranch ? true : undefined,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
            ...rest,
            ref: ref
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/branch-picker/branch-picker-root.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/branch-picker/branch-picker-root.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
BranchPickerPrimitiveRoot.displayName = "BranchPickerPrimitive.Root";
}),
"[project]/packages/react/src/primitives/branch-picker/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Count",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$count$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveCount"],
    "Next",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$next$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveNext"],
    "Number",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$number$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveNumber"],
    "Previous",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$previous$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BranchPickerPrimitivePrevious"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveRoot"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$next$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/branch-picker-next.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$previous$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/branch-picker-previous.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$count$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/branch-picker-count.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$number$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/branch-picker-number.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/branch-picker-root.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/branch-picker/index.ts [app-ssr] (ecmascript) <export * as BranchPickerPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/error/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
}),
"[project]/packages/react/src/primitives/error/error-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorPrimitiveRoot",
    ()=>ErrorPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const ErrorPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, forwardRef)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        role: "alert",
        ...props,
        ref: forwardRef
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/error/error-root.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
ErrorPrimitiveRoot.displayName = "ErrorPrimitive.Root";
}),
"[project]/packages/react/src/primitives/error/error-message.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorPrimitiveMessage",
    ()=>ErrorPrimitiveMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ErrorPrimitiveMessage = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ children, ...props }, forwardRef)=>{
    const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>{
        return message.status?.type === "incomplete" && message.status.reason === "error" ? message.status.error : undefined;
    });
    if (error === undefined) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].span, {
        ...props,
        ref: forwardRef,
        children: children ?? String(error)
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/error/error-message.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ErrorPrimitiveMessage.displayName = "ErrorPrimitive.Message";
}),
"[project]/packages/react/src/primitives/error/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Message",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$error$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorPrimitiveMessage"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$error$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ErrorPrimitiveRoot"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/error/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$error$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/error/error-root.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$error$2d$message$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/error/error-message.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/error/index.ts [app-ssr] (ecmascript) <export * as ErrorPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/error/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/packages/react/src/primitives/thread/thread-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveRoot",
    ()=>ThreadPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const ThreadPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-root.tsx",
        lineNumber: 34,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadPrimitiveRoot.displayName = "ThreadPrimitive.Root";
}),
"[project]/packages/react/src/primitives/thread/thread-empty.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveEmpty",
    ()=>ThreadPrimitiveEmpty
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
const ThreadPrimitiveEmpty = ({ children })=>{
    const empty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ thread })=>thread.messages.length === 0 && !thread.isLoading);
    return empty ? children : null;
};
ThreadPrimitiveEmpty.displayName = "ThreadPrimitive.Empty";
}),
"[project]/packages/react/src/primitives/thread/thread-if.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveIf",
    ()=>ThreadPrimitiveIf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
const useThreadIf = (props)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ thread })=>{
        if (props.empty === true && !thread.isEmpty) return false;
        if (props.empty === false && thread.isEmpty) return false;
        if (props.running === true && !thread.isRunning) return false;
        if (props.running === false && thread.isRunning) return false;
        if (props.disabled === true && !thread.isDisabled) return false;
        if (props.disabled === false && thread.isDisabled) return false;
        return true;
    });
};
const ThreadPrimitiveIf = ({ children, ...query })=>{
    const result = useThreadIf(query);
    return result ? children : null;
};
ThreadPrimitiveIf.displayName = "ThreadPrimitive.If";
}),
"[project]/packages/store/src/use-aui-event.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuiEvent",
    ()=>useAuiEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$effect$2d$event$40$2$2e$0$2e$3_react$40$19$2e$2$2e$4$2f$node_modules$2f$use$2d$effect$2d$event$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/use-effect-event@2.0.3_react@19.2.4/node_modules/use-effect-event/dist/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$types$2f$events$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/types/events.ts [app-ssr] (ecmascript)");
;
;
;
;
const useAuiEvent = (selector, callback)=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$effect$2d$event$40$2$2e$0$2e$3_react$40$19$2e$2$2e$4$2f$node_modules$2f$use$2d$effect$2d$event$2f$dist$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffectEvent"])(callback);
    const { scope, event } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$types$2f$events$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeEventSelector"])(selector);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>aui.on({
            scope,
            event
        }, callbackRef), [
        aui,
        scope,
        event,
        callbackRef
    ]);
};
}),
"[project]/packages/react/src/utils/hooks/use-on-resize-content.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOnResizeContent",
    ()=>useOnResizeContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-ssr] (ecmascript)");
;
;
;
const useOnResizeContent = (callback)=>{
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallbackRef"])(callback);
    const refCallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>{
        const resizeObserver = new ResizeObserver(()=>{
            callbackRef();
        });
        const mutationObserver = new MutationObserver((mutations)=>{
            // Filter out style-only attribute mutations to prevent feedback loops
            // with components like ThreadViewportSlack that write styles in response
            // to viewport changes
            const hasRelevantMutation = mutations.some((m)=>m.type !== "attributes" || m.attributeName !== "style");
            if (hasRelevantMutation) {
                callbackRef();
            }
        });
        resizeObserver.observe(el);
        mutationObserver.observe(el, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
        return ()=>{
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [
        callbackRef
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useManagedRef"])(refCallback);
};
}),
"[project]/packages/react/src/primitives/thread/use-thread-viewport-auto-scroll.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useThreadViewportAutoScroll",
    ()=>useThreadViewportAutoScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-event.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$resize$2d$content$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-on-resize-content.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-on-scroll-to-bottom.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/readonly-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const useThreadViewportAutoScroll = ({ autoScroll, scrollToBottomOnRunStart = true, scrollToBottomOnInitialize = true, scrollToBottomOnThreadSwitch = true })=>{
    const divRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const threadViewportStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewportStore"])();
    if (autoScroll === undefined) {
        autoScroll = threadViewportStore.getState().turnAnchor !== "top";
    }
    const lastScrollTop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    // bug: when ScrollToBottom's button changes its disabled state, the scroll stops
    // fix: delay the state change until the scroll is done
    // stores the scroll behavior to reuse during content resize, or null if not scrolling
    const scrollingToBottomBehaviorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((behavior)=>{
        const div = divRef.current;
        if (!div) return;
        scrollingToBottomBehaviorRef.current = behavior;
        div.scrollTo({
            top: div.scrollHeight,
            behavior
        });
    }, []);
    const handleScroll = ()=>{
        const div = divRef.current;
        if (!div) return;
        const isAtBottom = threadViewportStore.getState().isAtBottom;
        const newIsAtBottom = Math.abs(div.scrollHeight - div.scrollTop - div.clientHeight) < 1 || div.scrollHeight <= div.clientHeight;
        if (!newIsAtBottom && lastScrollTop.current < div.scrollTop) {
        // ignore scroll down
        } else {
            if (newIsAtBottom) {
                scrollingToBottomBehaviorRef.current = null;
            }
            const shouldUpdate = newIsAtBottom || scrollingToBottomBehaviorRef.current === null;
            if (shouldUpdate && newIsAtBottom !== isAtBottom) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["writableStore"])(threadViewportStore).setState({
                    isAtBottom: newIsAtBottom
                });
            }
        }
        lastScrollTop.current = div.scrollTop;
    };
    const resizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$resize$2d$content$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOnResizeContent"])(()=>{
        const scrollBehavior = scrollingToBottomBehaviorRef.current;
        if (scrollBehavior) {
            scrollToBottom(scrollBehavior);
        } else if (autoScroll && threadViewportStore.getState().isAtBottom) {
            scrollToBottom("instant");
        }
        handleScroll();
    });
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useManagedRef"])((el)=>{
        el.addEventListener("scroll", handleScroll);
        return ()=>{
            el.removeEventListener("scroll", handleScroll);
        };
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOnScrollToBottom"])(({ behavior })=>{
        scrollToBottom(behavior);
    });
    // autoscroll on run start
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiEvent"])("thread.runStart", ()=>{
        if (!scrollToBottomOnRunStart) return;
        scrollingToBottomBehaviorRef.current = "auto";
        requestAnimationFrame(()=>{
            scrollToBottom("auto");
        });
    });
    // scroll to bottom instantly when thread history is first loaded
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiEvent"])("thread.initialize", ()=>{
        if (!scrollToBottomOnInitialize) return;
        scrollingToBottomBehaviorRef.current = "instant";
        requestAnimationFrame(()=>{
            scrollToBottom("instant");
        });
    });
    // scroll to bottom instantly when switching threads
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiEvent"])("threadListItem.switchedTo", ()=>{
        if (!scrollToBottomOnThreadSwitch) return;
        scrollingToBottomBehaviorRef.current = "instant";
        requestAnimationFrame(()=>{
            scrollToBottom("instant");
        });
    });
    const autoScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposedRefs"])(resizeRef, scrollRef, divRef);
    return autoScrollRef;
};
}),
"[project]/packages/react/src/primitives/thread/thread-viewport.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveViewport",
    ()=>ThreadPrimitiveViewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$use$2d$thread$2d$viewport$2d$auto$2d$scroll$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/use-thread-viewport-auto-scroll.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/thread-viewport-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-size-handle.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const useViewportSizeRef = ()=>{
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewport"])((s)=>s.registerViewport);
    const getHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>el.clientHeight, []);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSizeHandle"])(register, getHeight);
};
const ThreadPrimitiveViewportScrollable = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ autoScroll, scrollToBottomOnRunStart, scrollToBottomOnInitialize, scrollToBottomOnThreadSwitch, children, ...rest }, forwardedRef)=>{
    const autoScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$use$2d$thread$2d$viewport$2d$auto$2d$scroll$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewportAutoScroll"])({
        autoScroll,
        scrollToBottomOnRunStart,
        scrollToBottomOnInitialize,
        scrollToBottomOnThreadSwitch
    });
    const viewportSizeRef = useViewportSizeRef();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, autoScrollRef, viewportSizeRef);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...rest,
        ref: ref,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-viewport.tsx",
        lineNumber: 88,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadPrimitiveViewportScrollable.displayName = "ThreadPrimitive.ViewportScrollable";
const ThreadPrimitiveViewport = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ turnAnchor, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportProvider"], {
        options: {
            turnAnchor
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadPrimitiveViewportScrollable, {
            ...props,
            ref: ref
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/thread/thread-viewport.tsx",
            lineNumber: 118,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-viewport.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadPrimitiveViewport.displayName = "ThreadPrimitive.Viewport";
}),
"[project]/packages/react/src/primitives/thread/thread-viewport-footer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveViewportFooter",
    ()=>ThreadPrimitiveViewportFooter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-size-handle.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
const ThreadPrimitiveViewportFooter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, forwardedRef)=>{
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewport"])((s)=>s.registerContentInset);
    const getHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((el)=>{
        const marginTop = parseFloat(getComputedStyle(el).marginTop) || 0;
        return el.offsetHeight + marginTop;
    }, []);
    const resizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSizeHandle"])(register, getHeight);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, resizeRef);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-viewport-footer.tsx",
        lineNumber: 54,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadPrimitiveViewportFooter.displayName = "ThreadPrimitive.ViewportFooter";
}),
"[project]/packages/react/src/context/providers/message-by-index-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageByIndexProvider",
    ()=>MessageByIndexProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-ssr] (ecmascript)");
"use client";
;
;
const MessageByIndexProvider = ({ index, children })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])({
        message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"])({
            source: "thread",
            query: {
                type: "index",
                index
            },
            get: (aui)=>aui.thread().message({
                    index
                })
        }),
        composer: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"])({
            source: "message",
            query: {},
            get: (aui)=>aui.thread().message({
                    index
                }).composer
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/message-by-index-provider.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/packages/react/src/primitives/thread/thread-messages.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveMessageByIndex",
    ()=>ThreadPrimitiveMessageByIndex,
    "ThreadPrimitiveMessages",
    ()=>ThreadPrimitiveMessages,
    "ThreadPrimitiveMessagesImpl",
    ()=>ThreadPrimitiveMessagesImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$message$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/message-by-index-provider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const isComponentsSame = (prev, next)=>{
    return prev.Message === next.Message && prev.EditComposer === next.EditComposer && prev.UserEditComposer === next.UserEditComposer && prev.AssistantEditComposer === next.AssistantEditComposer && prev.SystemEditComposer === next.SystemEditComposer && prev.UserMessage === next.UserMessage && prev.AssistantMessage === next.AssistantMessage && prev.SystemMessage === next.SystemMessage;
};
const DEFAULT_SYSTEM_MESSAGE = ()=>null;
const getComponent = (components, role, isEditing)=>{
    switch(role){
        case "user":
            if (isEditing) {
                return components.UserEditComposer ?? components.EditComposer ?? components.UserMessage ?? components.Message;
            } else {
                return components.UserMessage ?? components.Message;
            }
        case "assistant":
            if (isEditing) {
                return components.AssistantEditComposer ?? components.EditComposer ?? components.AssistantMessage ?? components.Message;
            } else {
                return components.AssistantMessage ?? components.Message;
            }
        case "system":
            if (isEditing) {
                return components.SystemEditComposer ?? components.EditComposer ?? components.SystemMessage ?? components.Message;
            } else {
                return components.SystemMessage ?? DEFAULT_SYSTEM_MESSAGE;
            }
        default:
            const _exhaustiveCheck = role;
            throw new Error(`Unknown message role: ${_exhaustiveCheck}`);
    }
};
const ThreadMessageComponent = ({ components })=>{
    const role = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.role);
    const isEditing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ message })=>message.composer.isEditing);
    const Component = getComponent(components, role, isEditing);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {}, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-messages.tsx",
        lineNumber: 136,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const ThreadPrimitiveMessageByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$message$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessageByIndexProvider"], {
        index: index,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadMessageComponent, {
            components: components
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/thread/thread-messages.tsx",
            lineNumber: 167,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-messages.tsx",
        lineNumber: 166,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
}, (prev, next)=>prev.index === next.index && isComponentsSame(prev.components, next.components));
ThreadPrimitiveMessageByIndex.displayName = "ThreadPrimitive.MessageByIndex";
const ThreadPrimitiveMessagesImpl = ({ components })=>{
    const messagesLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ thread })=>thread.messages.length);
    const messageElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (messagesLength === 0) return null;
        return Array.from({
            length: messagesLength
        }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadPrimitiveMessageByIndex, {
                index: index,
                components: components
            }, index, false, {
                fileName: "[project]/packages/react/src/primitives/thread/thread-messages.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)));
    }, [
        messagesLength,
        components
    ]);
    return messageElements;
};
ThreadPrimitiveMessagesImpl.displayName = "ThreadPrimitive.Messages";
const ThreadPrimitiveMessages = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(ThreadPrimitiveMessagesImpl, (prev, next)=>isComponentsSame(prev.components, next.components));
}),
"[project]/packages/react/src/primitives/thread/thread-scroll-to-bottom.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveScrollToBottom",
    ()=>ThreadPrimitiveScrollToBottom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const useThreadScrollToBottom = ({ behavior } = {})=>{
    const isAtBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewport"])((s)=>s.isAtBottom);
    const threadViewportStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useThreadViewportStore"])();
    const handleScrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        threadViewportStore.getState().scrollToBottom({
            behavior
        });
    }, [
        threadViewportStore,
        behavior
    ]);
    if (isAtBottom) return null;
    return handleScrollToBottom;
};
const ThreadPrimitiveScrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadPrimitive.ScrollToBottom", useThreadScrollToBottom, [
    "behavior"
]);
}),
"[project]/packages/react/src/primitives/thread/thread-suggestion.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveSuggestion",
    ()=>ThreadPrimitiveSuggestion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const useThreadSuggestion = ({ prompt, send, clearComposer = true, autoSend, method: _method })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ thread })=>thread.isDisabled);
    // ========== Deprecation Mapping ==========
    const resolvedSend = send ?? autoSend ?? false;
    // ==========================================
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const isRunning = aui.thread().getState().isRunning;
        if (resolvedSend && !isRunning) {
            aui.thread().append(prompt);
            if (clearComposer) {
                aui.composer().setText("");
            }
        } else {
            if (clearComposer) {
                aui.composer().setText(prompt);
            } else {
                const currentText = aui.composer().getState().text;
                aui.composer().setText(currentText.trim() ? `${currentText} ${prompt}` : prompt);
            }
        }
    }, [
        aui,
        resolvedSend,
        clearComposer,
        prompt
    ]);
    if (disabled) return null;
    return callback;
};
const ThreadPrimitiveSuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadPrimitive.Suggestion", useThreadSuggestion, [
    "prompt",
    "send",
    "clearComposer",
    "autoSend",
    "method"
]);
}),
"[project]/packages/react/src/context/providers/suggestion-by-index-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SuggestionByIndexProvider",
    ()=>SuggestionByIndexProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
const SuggestionByIndexProvider = ({ index, children })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])({
        suggestion: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"])({
            source: "suggestions",
            query: {
                index
            },
            get: (aui)=>aui.suggestions().suggestion({
                    index
                })
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/suggestion-by-index-provider.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/packages/react/src/primitives/thread/thread-suggestions.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveSuggestionByIndex",
    ()=>ThreadPrimitiveSuggestionByIndex,
    "ThreadPrimitiveSuggestions",
    ()=>ThreadPrimitiveSuggestions,
    "ThreadPrimitiveSuggestionsImpl",
    ()=>ThreadPrimitiveSuggestionsImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$suggestion$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/suggestion-by-index-provider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const SuggestionComponent = ({ components })=>{
    const Component = components.Suggestion;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {}, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-suggestions.tsx",
        lineNumber: 25,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const ThreadPrimitiveSuggestionByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$suggestion$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SuggestionByIndexProvider"], {
        index: index,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SuggestionComponent, {
            components: components
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/thread/thread-suggestions.tsx",
            lineNumber: 56,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-suggestions.tsx",
        lineNumber: 55,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
}, (prev, next)=>prev.index === next.index && prev.components.Suggestion === next.components.Suggestion);
ThreadPrimitiveSuggestionByIndex.displayName = "ThreadPrimitive.SuggestionByIndex";
const ThreadPrimitiveSuggestionsImpl = ({ components })=>{
    const suggestionsLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ suggestions })=>suggestions.suggestions.length);
    const suggestionElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (suggestionsLength === 0) return null;
        return Array.from({
            length: suggestionsLength
        }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadPrimitiveSuggestionByIndex, {
                index: index,
                components: components
            }, index, false, {
                fileName: "[project]/packages/react/src/primitives/thread/thread-suggestions.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)));
    }, [
        suggestionsLength,
        components
    ]);
    return suggestionElements;
};
ThreadPrimitiveSuggestionsImpl.displayName = "ThreadPrimitive.Suggestions";
const ThreadPrimitiveSuggestions = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(ThreadPrimitiveSuggestionsImpl, (prev, next)=>prev.components.Suggestion === next.components.Suggestion);
}),
"[project]/packages/react/src/primitives/thread/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Empty",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$empty$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveEmpty"],
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveIf"],
    "MessageByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$messages$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveMessageByIndex"],
    "Messages",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$messages$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveMessages"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveRoot"],
    "ScrollToBottom",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveScrollToBottom"],
    "Suggestion",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$suggestion$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveSuggestion"],
    "SuggestionByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$suggestions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveSuggestionByIndex"],
    "Suggestions",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$suggestions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveSuggestions"],
    "Viewport",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewport"],
    "ViewportFooter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$footer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportFooter"],
    "ViewportProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportProvider"],
    "ViewportSlack",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$slack$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportSlack"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-root.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$empty$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-empty.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$if$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-if.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-viewport.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/thread-viewport-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$footer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-viewport-footer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$slack$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-viewport-slack.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$messages$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-messages.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-scroll-to-bottom.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$suggestion$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-suggestion.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$suggestions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-suggestions.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread/index.ts [app-ssr] (ecmascript) <export * as ThreadPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list-item-more/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
}),
"[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDropdownMenuScope",
    ()=>useDropdownMenuScope
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
;
const useDropdownMenuScope = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDropdownMenuScope"]();
}),
"[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitiveRoot",
    ()=>ThreadListItemMorePrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const ThreadListItemMorePrimitiveRoot = ({ __scopeThreadListItemMore, ...rest })=>{
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeThreadListItemMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        ...scope,
        ...rest
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-root.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
ThreadListItemMorePrimitiveRoot.displayName = "ThreadListItemMorePrimitive.Root";
}),
"[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-trigger.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitiveTrigger",
    ()=>ThreadListItemMorePrimitiveTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ThreadListItemMorePrimitiveTrigger = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ __scopeThreadListItemMore, ...rest }, ref)=>{
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeThreadListItemMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-trigger.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadListItemMorePrimitiveTrigger.displayName = "ThreadListItemMorePrimitive.Trigger";
}),
"[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-content.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitiveContent",
    ()=>ThreadListItemMorePrimitiveContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ThreadListItemMorePrimitiveContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ __scopeThreadListItemMore, portalProps, sideOffset = 4, ...props }, forwardedRef)=>{
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeThreadListItemMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Portal"], {
        ...scope,
        ...portalProps,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
            ...scope,
            ...props,
            ref: forwardedRef,
            sideOffset: sideOffset
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-content.tsx",
            lineNumber: 35,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-content.tsx",
        lineNumber: 34,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadListItemMorePrimitiveContent.displayName = "ThreadListItemMorePrimitive.Content";
}),
"[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-item.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitiveItem",
    ()=>ThreadListItemMorePrimitiveItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ThreadListItemMorePrimitiveItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ __scopeThreadListItemMore, ...rest }, ref)=>{
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeThreadListItemMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Item"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-item.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadListItemMorePrimitiveItem.displayName = "ThreadListItemMorePrimitive.Item";
}),
"[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-separator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitiveSeparator",
    ()=>ThreadListItemMorePrimitiveSeparator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ThreadListItemMorePrimitiveSeparator = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ __scopeThreadListItemMore, ...rest }, ref)=>{
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeThreadListItemMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-separator.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadListItemMorePrimitiveSeparator.displayName = "ThreadListItemMorePrimitive.Separator";
}),
"[project]/packages/react/src/primitives/thread-list-item-more/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Content",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$content$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemMorePrimitiveContent"],
    "Item",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$item$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemMorePrimitiveItem"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemMorePrimitiveRoot"],
    "Separator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemMorePrimitiveSeparator"],
    "Trigger",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$trigger$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemMorePrimitiveTrigger"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-root.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$trigger$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-trigger.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$content$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-content.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$item$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-item.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-separator.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list-item-more/index.ts [app-ssr] (ecmascript) <export * as ThreadListItemMorePrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list-item/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveRoot",
    ()=>ThreadListItemPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ThreadListItemPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    const isMain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ threads, threadListItem })=>threads.mainThreadId === threadListItem.id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...isMain ? {
            "data-active": "true",
            "aria-current": "true"
        } : null,
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list-item/thread-list-item-root.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadListItemPrimitiveRoot.displayName = "ThreadListItemPrimitive.Root";
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-archive.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveArchive",
    ()=>ThreadListItemPrimitiveArchive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const useThreadListItemArchive = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.threadListItem().archive();
    }, [
        aui
    ]);
};
const ThreadListItemPrimitiveArchive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadListItemPrimitive.Archive", useThreadListItemArchive);
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-unarchive.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveUnarchive",
    ()=>ThreadListItemPrimitiveUnarchive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const useThreadListItemUnarchive = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.threadListItem().unarchive();
    }, [
        aui
    ]);
};
const ThreadListItemPrimitiveUnarchive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadListItemPrimitive.Unarchive", useThreadListItemUnarchive);
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-delete.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveDelete",
    ()=>ThreadListItemPrimitiveDelete
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const useThreadListItemDelete = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.threadListItem().delete();
    }, [
        aui
    ]);
};
const ThreadListItemPrimitiveDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadListItemPrimitive.Delete", useThreadListItemDelete);
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-trigger.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveTrigger",
    ()=>ThreadListItemPrimitiveTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const useThreadListItemTrigger = ()=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        aui.threadListItem().switchTo();
    }, [
        aui
    ]);
};
const ThreadListItemPrimitiveTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadListItemPrimitive.Trigger", useThreadListItemTrigger);
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-title.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveTitle",
    ()=>ThreadListItemPrimitiveTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
"use client";
;
;
const ThreadListItemPrimitiveTitle = ({ fallback })=>{
    const title = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ threadListItem })=>threadListItem.title);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: title || fallback
    }, void 0, false);
};
ThreadListItemPrimitiveTitle.displayName = "ThreadListItemPrimitive.Title";
}),
"[project]/packages/react/src/primitives/thread-list-item/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Archive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$archive$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveArchive"],
    "Delete",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$delete$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveDelete"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveRoot"],
    "Title",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$title$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveTitle"],
    "Trigger",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$trigger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveTrigger"],
    "Unarchive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$unarchive$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveUnarchive"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-root.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$archive$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-archive.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$unarchive$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-unarchive.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$delete$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-delete.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$trigger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-trigger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$title$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-title.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list-item/index.ts [app-ssr] (ecmascript) <export * as ThreadListItemPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/index.ts [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
}),
"[project]/packages/react/src/primitives/thread-list/thread-list-new.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListPrimitiveNew",
    ()=>ThreadListPrimitiveNew
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const ThreadListPrimitiveNew = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])(({ onClick, disabled, ...props }, forwardedRef)=>{
    const isMain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ threads })=>threads.newThreadId === threads.mainThreadId);
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isMain ? {
            "data-active": "true",
            "aria-current": "true"
        } : null,
        ...props,
        ref: forwardedRef,
        disabled: disabled,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            aui.threads().switchToNewThread();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list/thread-list-new.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadListPrimitiveNew.displayName = "ThreadListPrimitive.New";
}),
"[project]/packages/react/src/context/providers/thread-list-item-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemByIndexProvider",
    ()=>ThreadListItemByIndexProvider,
    "ThreadListItemRuntimeProvider",
    ()=>ThreadListItemRuntimeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$item$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/thread-list-item-runtime-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const ThreadListItemByIndexProvider = ({ index, archived, children })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])({
        threadListItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Derived"])({
            source: "threads",
            query: {
                type: "index",
                index,
                archived
            },
            get: (aui)=>aui.threads().item({
                    index,
                    archived
                })
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/thread-list-item-provider.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
const ThreadListItemRuntimeProvider = ({ runtime, children })=>{
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAui"])({
        threadListItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$item$2d$runtime$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemClient"])({
            runtime
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/thread-list-item-provider.tsx",
        lineNumber: 34,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/packages/react/src/primitives/thread-list/thread-list-items.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListPrimitiveItemByIndex",
    ()=>ThreadListPrimitiveItemByIndex,
    "ThreadListPrimitiveItems",
    ()=>ThreadListPrimitiveItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$list$2d$item$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/thread-list-item-provider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const ThreadListPrimitiveItemByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["memo"])(({ index, archived = false, components })=>{
    const ThreadListItemComponent = components.ThreadListItem;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$list$2d$item$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListItemByIndexProvider"], {
        index: index,
        archived: archived,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadListItemComponent, {}, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/thread-list/thread-list-items.tsx",
            lineNumber: 47,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list/thread-list-items.tsx",
        lineNumber: 46,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
}, (prev, next)=>prev.index === next.index && prev.archived === next.archived && prev.components.ThreadListItem === next.components.ThreadListItem);
ThreadListPrimitiveItemByIndex.displayName = "ThreadListPrimitive.ItemByIndex";
const ThreadListPrimitiveItems = ({ archived = false, components })=>{
    const contentLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuiState"])(({ threads })=>archived ? threads.archivedThreadIds.length : threads.threadIds.length);
    const listElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return Array.from({
            length: contentLength
        }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadListPrimitiveItemByIndex, {
                index: index,
                archived: archived,
                components: components
            }, index, false, {
                fileName: "[project]/packages/react/src/primitives/thread-list/thread-list-items.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)));
    }, [
        contentLength,
        archived,
        components
    ]);
    return listElements;
};
ThreadListPrimitiveItems.displayName = "ThreadListPrimitive.Items";
}),
"[project]/packages/react/src/primitives/thread-list/thread-list-root.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListPrimitiveRoot",
    ()=>ThreadListPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const ThreadListPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list/thread-list-root.tsx",
        lineNumber: 17,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
ThreadListPrimitiveRoot.displayName = "ThreadListPrimitive.Root";
}),
"[project]/packages/react/src/primitives/thread-list/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ItemByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$items$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListPrimitiveItemByIndex"],
    "Items",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$items$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListPrimitiveItems"],
    "New",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$new$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListPrimitiveNew"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThreadListPrimitiveRoot"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$new$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list/thread-list-new.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$items$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list/thread-list-items.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$root$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list/thread-list-root.tsx [app-ssr] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list/index.ts [app-ssr] (ecmascript) <export * as ThreadListPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list/index.ts [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=packages_653262fc._.js.map