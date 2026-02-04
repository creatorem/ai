(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/packages/tap/src/core/commit.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/core/env.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isDevelopment",
    ()=>isDevelopment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const isDevelopment = ("TURBOPACK compile-time value", "development") === "development" || ("TURBOPACK compile-time value", "development") === "test";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/core/execution-context.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentResourceFiber",
    ()=>getCurrentResourceFiber,
    "getDevStrictMode",
    ()=>getDevStrictMode,
    "withResourceFiber",
    ()=>withResourceFiber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-client] (ecmascript)");
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
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopment"]) return null;
    if (currentResourceFiber?.devStrictMode) return currentResourceFiber.isFirstRender ? "child" : "root";
    return enable ? "root" : null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/core/call-resource-fn.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/core/resource-fiber.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$commit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/commit.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/call-resource-fn.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-client] (ecmascript)");
;
;
;
;
function createResourceFiber(type, dispatchUpdate, strictMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDevStrictMode"])(false)) {
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$commit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cleanupAllEffects"])(fiber);
}
function renderResourceFiber(fiber, props) {
    const result = {
        commitTasks: [],
        props,
        output: undefined
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withResourceFiber"])(fiber, ()=>{
        fiber.renderContext = result;
        try {
            result.output = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callResourceFn"])(fiber.type, props);
        } finally{
            fiber.renderContext = undefined;
        }
    });
    return result;
}
function commitResourceFiber(fiber, result) {
    fiber.isMounted = true;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopment"] && fiber.isNeverMounted && fiber.devStrictMode === "root") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$commit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitRender"])(result);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$commit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cleanupAllEffects"])(fiber);
    }
    fiber.isNeverMounted = false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$commit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitRender"])(result);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/react/use-resource.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useResource",
    ()=>useResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource-fiber.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
const useDevStrictMode = ()=>{
    _s();
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopment"]) return null;
    const count = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const isFirstRender = count.current === 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useDevStrictMode.useState": ()=>count.current++
    }["useDevStrictMode.useState"]);
    if (count.current !== 2) return null;
    return isFirstRender ? "child" : "root";
};
_s(useDevStrictMode, "0whC3Aespm3K0YRXoGAVfh8Kz+0=");
const resourceReducer = (version, callback)=>{
    return version + (callback() ? 1 : 0);
};
function useResource(element) {
    _s1();
    const [, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(resourceReducer, 0);
    const devStrictMode = useDevStrictMode();
    // biome-ignore lint/correctness/useExhaustiveDependencies: user provided deps instead of prop identity
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useResource.useMemo[fiber]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createResourceFiber"])(element.type, dispatch, devStrictMode);
        }
    }["useResource.useMemo[fiber]"], [
        element.type,
        element.key
    ]);
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, element.props);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "useResource.useLayoutEffect": ()=>{
            return ({
                "useResource.useLayoutEffect": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(fiber)
            })["useResource.useLayoutEffect"];
        }
    }["useResource.useLayoutEffect"], [
        fiber
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "useResource.useLayoutEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitResourceFiber"])(fiber, result);
        }
    }["useResource.useLayoutEffect"]);
    return result.output;
}
_s1(useResource, "+HbpT4KSh/2EEqFxvk1Hhxo//18=", false, function() {
    return [
        useDevStrictMode
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resource",
    ()=>resource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/call-resource-fn.ts [app-client] (ecmascript)");
;
function resource(fn) {
    const type = (props)=>{
        return {
            type,
            props: props
        };
    };
    type[__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fnSymbol"]] = fn;
    return type;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapState",
    ()=>tapState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-client] (ecmascript)");
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
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentResourceFiber"])();
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
    if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopment"] && fiber.devStrictMode && typeof initialValue === "function") {
        void initialValue();
    }
    const newCell = {
        type: "state",
        value,
        set: (updater)=>{
            dispatchOnFiber(fiber, ()=>{
                const currentValue = newCell.value;
                const nextValue = typeof updater === "function" ? updater(currentValue) : updater;
                if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopment"] && fiber.devStrictMode && typeof updater === "function") {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/tap-ref.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapRef",
    ()=>tapRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
;
function tapRef(initialValue) {
    const [state] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(()=>({
            current: initialValue
        }));
    return state;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/utils/deps-shallow-equal.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapMemo",
    ()=>tapMemo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-ref.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$deps$2d$shallow$2d$equal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/utils/deps-shallow-equal.ts [app-client] (ecmascript)");
;
;
;
;
const tapMemo = (fn, deps)=>{
    const dataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapRef"])();
    if (!dataRef.current) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopment"]) {
            const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentResourceFiber"])();
            if (fiber.devStrictMode) {
                void fn();
            }
        }
        dataRef.current = {
            value: fn(),
            deps
        };
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$deps$2d$shallow$2d$equal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["depsShallowEqual"])(dataRef.current.deps, deps)) {
        dataRef.current.value = fn();
        dataRef.current.deps = deps;
    }
    return dataRef.current.value;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/utils/tap-hook.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "registerRenderMountTask",
    ()=>registerRenderMountTask,
    "tapHook",
    ()=>tapHook
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-client] (ecmascript)");
;
const tapHook = (type, init)=>{
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentResourceFiber"])();
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
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentResourceFiber"])();
    fiber.renderContext.commitTasks.push(task);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapEffect",
    ()=>tapEffect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$deps$2d$shallow$2d$equal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/utils/deps-shallow-equal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$tap$2d$hook$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/utils/tap-hook.ts [app-client] (ecmascript)");
;
;
const newEffect = ()=>({
        type: "effect",
        cleanup: undefined,
        deps: null
    });
function tapEffect(effect, deps) {
    const cell = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$tap$2d$hook$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapHook"])("effect", newEffect);
    if (deps && cell.deps && (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$deps$2d$shallow$2d$equal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["depsShallowEqual"])(cell.deps, deps)) return;
    if (cell.deps !== null && !!deps !== !!cell.deps) throw new Error("tapEffect called with and without dependencies across re-renders");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$utils$2f$tap$2d$hook$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerRenderMountTask"])(()=>{
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/tap-callback.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapCallback",
    ()=>tapCallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
;
const tapCallback = (fn, deps)=>{
    // biome-ignore lint/correctness/useExhaustiveDependencies: user provided deps instead of callback identity
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>fn, deps);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/tap-const.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapConst",
    ()=>tapConst
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
;
function tapConst(getValue, _deps) {
    const [state] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(getValue);
    return state;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/tap-resources.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapResources",
    ()=>tapResources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-callback.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource-fiber.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-const.ts [app-client] (ecmascript)");
;
;
;
;
;
;
function tapResources(getElements, getElementsDeps) {
    const [version, setVersion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(0);
    const rerender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapConst"])(()=>()=>setVersion((v)=>v + 1), []);
    const fibers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapConst"])(()=>new Map(), []);
    const getElementsMemo = getElementsDeps ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapCallback"])(getElements, getElementsDeps) : getElements;
    // Process each element
    const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
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
                const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createResourceFiber"])(element.type, (callback)=>{
                    if (callback()) rerender();
                });
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, element.props);
                state = {
                    fiber,
                    next: result
                };
                newCount++;
                fibers.set(elementKey, state);
                results.push(result.output);
            } else if (state.fiber.type !== element.type) {
                const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createResourceFiber"])(element.type, (callback)=>{
                    if (callback()) rerender();
                });
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, element.props);
                state.next = [
                    fiber,
                    result
                ];
                results.push(result.output);
            } else {
                state.next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(state.fiber, element.props);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        return ()=>{
            for (const key of fibers.keys()){
                const fiber = fibers.get(key).fiber;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(fiber);
            }
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        res; // as a performance optimization, we only run if the results have changed
        for (const [key, state] of fibers.entries()){
            if (state.next === "delete") {
                if (state.fiber.isMounted) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(state.fiber);
                }
                fibers.delete(key);
            } else if (Array.isArray(state.next)) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(state.fiber);
                state.fiber = state.next[0];
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitResourceFiber"])(state.fiber, state.next[1]);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitResourceFiber"])(state.fiber, state.next);
            }
        }
    }, [
        res
    ]);
    return res;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/tap-effect-event.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapEffectEvent",
    ()=>tapEffectEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-ref.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-callback.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-client] (ecmascript)");
;
;
;
;
;
function tapEffectEvent(callback) {
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapRef"])(callback);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        callbackRef.current = callback;
    });
    if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopment"]) {
        const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentResourceFiber"])();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapCallback"])((...args)=>{
            if (fiber.renderContext) throw new Error("tapEffectEvent cannot be called during render");
            return callbackRef.current(...args);
        }, [
            fiber
        ]);
    }
    return callbackRef.current;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapInlineResource",
    ()=>tapInlineResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/call-resource-fn.ts [app-client] (ecmascript)");
;
function tapInlineResource(element) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$call$2d$resource$2d$fn$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callResourceFn"])(element.type, element.props);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/hooks/tap-resource.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapResource",
    ()=>tapResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource-fiber.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-const.ts [app-client] (ecmascript)");
;
;
;
;
;
function tapResource(element, propsDeps) {
    const [version, setVersion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(0);
    const rerender = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapConst"])(()=>()=>setVersion((v)=>v + 1), []);
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        void element.key;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createResourceFiber"])(element.type, (callback)=>{
            if (callback()) rerender();
        });
    }, [
        element.type,
        element.key
    ]);
    const result = propsDeps ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, element.props), [
        fiber,
        ...propsDeps,
        version
    ]) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, element.props);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(fiber), [
        fiber
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitResourceFiber"])(fiber, result);
    }, [
        fiber,
        result
    ]);
    return result.output;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/core/with-key.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/core/scheduler.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/core/create-resource.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createResource",
    ()=>createResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource-fiber.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/scheduler.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-ref.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-const.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/execution-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/env.ts [app-client] (ecmascript)");
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
const HandleWrapperResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = (state)=>{
    const [, setElement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(state.elementRef.current);
    const output = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapResource"])(state.elementRef.current);
    const subscribers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapConst"])(()=>new Set(), []);
    const valueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapRef"])(output);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        if (output !== valueRef.current) {
            valueRef.current = output;
            subscribers.forEach((callback)=>callback());
        }
    });
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
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
_c1 = HandleWrapperResource;
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
            if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopment"] && fiber.isNeverMounted && fiber.devStrictMode === "child") {
                if (changed) {
                    render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, props);
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitResourceFiber"])(fiber, render);
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushResourcesSync"])(()=>{
                    if (changed) {
                        // In strict mode, render twice to detect side effects
                        if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopment"] && fiber.devStrictMode === "root") {
                            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, props);
                        }
                        render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, props);
                    }
                    if (scheduler.isDirty) return;
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitResourceFiber"])(fiber, render);
                });
            }
            return false;
        },
        onUnmount: ()=>{
            if (!isMounted) throw new Error("Resource not mounted");
            isMounted = false;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unmountResourceFiber"])(fiber);
        }
    };
    const scheduler = new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UpdateScheduler"](()=>{
        // In strict mode, render twice to detect side effects
        if (__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDevelopment"] && (fiber.devStrictMode === "root" || fiber.devStrictMode && !fiber.isFirstRender)) {
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, props);
        }
        render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["renderResourceFiber"])(fiber, props);
        if (scheduler.isDirty || !isMounted) return;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitResourceFiber"])(fiber, render);
    });
    const fiber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2d$fiber$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createResourceFiber"])(HandleWrapperResource, (callback)=>{
        if (callback()) scheduler.markDirty();
    }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$execution$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDevStrictMode"])(devStrictMode));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushResourcesSync"])(()=>{
        scheduler.markDirty();
    });
    return render.output;
};
var _c, _c1;
__turbopack_context__.k.register(_c, "HandleWrapperResource$resource");
__turbopack_context__.k.register(_c1, "HandleWrapperResource");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/utils/store-resource.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StoreResource",
    ()=>StoreResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$create$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/create-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
;
const StoreResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = (element)=>{
    const [handle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$create$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createResource"])(element, {
            mount: false
        }));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>handle.unmount, [
        handle
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        handle.render(element);
    });
    return handle;
});
_c1 = StoreResource;
var _c, _c1;
__turbopack_context__.k.register(_c, "StoreResource$resource");
__turbopack_context__.k.register(_c1, "StoreResource");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/tap/src/core/context.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/utils/tap-client-stack-context.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
;
const SYMBOL_CLIENT_INDEX = Symbol("assistant-ui.store.clientIndex");
const getClientIndex = (client)=>{
    return client[SYMBOL_CLIENT_INDEX];
};
const ClientStackContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createResourceContext"])([]);
const tapClientStack = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tap"])(ClientStackContext);
};
const tapWithClientStack = (client, callback)=>{
    const currentStack = tapClientStack();
    const newStack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>[
            ...currentStack,
            client
        ], [
        currentStack,
        client
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withContextProvider"])(ClientStackContext, newStack, callback);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/utils/base-proxy-handler.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/wrapper-resource.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "wrapperResource",
    ()=>wrapperResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-client] (ecmascript)");
;
const wrapperResource = (fn)=>{
    const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(fn);
    return (props)=>{
        const el = res(props);
        if (props.key === undefined) return el;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withKey"])(props.key, el);
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/tap-client-resource.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientResource",
    ()=>ClientResource,
    "getClientState",
    ()=>getClientState,
    "tapClientResource",
    ()=>tapClientResource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-ref.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-client-stack-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/base-proxy-handler.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$wrapper$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/wrapper-resource.ts [app-client] (ecmascript)");
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
class ClientProxyHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseProxyHandler"] {
    outputRef;
    index;
    boundFns;
    cachedReceiver;
    constructor(outputRef, index){
        super(), this.outputRef = outputRef, this.index = index;
    }
    get(_, prop, receiver) {
        if (prop === SYMBOL_GET_OUTPUT) return this.outputRef.current;
        if (prop === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SYMBOL_CLIENT_INDEX"]) return this.index;
        const introspection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleIntrospectionProp"])(prop, "ClientProxy");
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
        if (prop === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SYMBOL_CLIENT_INDEX"]) return true;
        return prop in this.outputRef.current.methods;
    }
}
const ClientResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$wrapper$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapperResource"])(_c = (element)=>{
    const valueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapRef"])(null);
    const index = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientStack"])().length;
    const methods = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>new Proxy({}, new ClientProxyHandler(valueRef, index)), [
        index
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapWithClientStack"])(methods, ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapResource"])(element));
    if (!valueRef.current) {
        valueRef.current = value;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        valueRef.current = value;
    });
    return {
        methods,
        state: value.state,
        key: element.key
    };
});
_c1 = ClientResource;
const tapClientResource = (element)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])(ClientResource(element));
};
var _c, _c1;
__turbopack_context__.k.register(_c, "ClientResource$wrapperResource");
__turbopack_context__.k.register(_c1, "ClientResource");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/utils/proxied-assistant-state.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PROXIED_ASSISTANT_STATE_SYMBOL",
    ()=>PROXIED_ASSISTANT_STATE_SYMBOL,
    "createProxiedAssistantState",
    ()=>createProxiedAssistantState,
    "getProxiedAssistantState",
    ()=>getProxiedAssistantState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/base-proxy-handler.ts [app-client] (ecmascript)");
"use client";
;
;
const PROXIED_ASSISTANT_STATE_SYMBOL = Symbol("assistant-ui.store.proxiedAssistantState");
const isIgnoredKey = (key)=>{
    return key === "on" || key === "subscribe" || typeof key === "symbol";
};
const createProxiedAssistantState = (client)=>{
    class ProxiedAssistantStateProxyHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseProxyHandler"] {
        get(_, prop) {
            const introspection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleIntrospectionProp"])(prop, "AssistantState");
            if (introspection !== false) return introspection;
            const scope = prop;
            if (isIgnoredKey(scope)) return undefined;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClientState"])(client[scope]());
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/utils/react-assistant-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/proxied-assistant-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/base-proxy-handler.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
class DefaultAssistantClientProxyHandler extends __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BaseProxyHandler"] {
    get(_, prop) {
        if (prop === "subscribe") return NO_OP_SUBSCRIBE;
        if (prop === "on") return NO_OP_SUBSCRIBE;
        if (prop === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROXIED_ASSISTANT_STATE_SYMBOL"]) return DefaultAssistantClientProxiedAssistantState;
        const introspection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleIntrospectionProp"])(prop, "DefaultAssistantClient");
        if (introspection !== false) return introspection;
        return createErrorClientField("You are using a component or hook that requires an AuiProvider. Wrap your component in an <AuiProvider> component.");
    }
    ownKeys() {
        return [
            "subscribe",
            "on",
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROXIED_ASSISTANT_STATE_SYMBOL"]
        ];
    }
    has(_, prop) {
        return prop === "subscribe" || prop === "on" || prop === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROXIED_ASSISTANT_STATE_SYMBOL"];
    }
}
const DefaultAssistantClient = new Proxy({}, new DefaultAssistantClientProxyHandler());
const DefaultAssistantClientProxiedAssistantState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createProxiedAssistantState"])(DefaultAssistantClient);
_c = DefaultAssistantClientProxiedAssistantState;
const createRootAssistantClient = ()=>new Proxy({}, {
        get (_, prop) {
            const introspection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$base$2d$proxy$2d$handler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleIntrospectionProp"])(prop, "AssistantClient");
            if (introspection !== false) return introspection;
            return createErrorClientField(`The current scope does not have a "${String(prop)}" property.`);
        }
    });
/**
 * React Context for the AssistantClient
 */ const AssistantContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(DefaultAssistantClient);
_c1 = AssistantContext;
const useAssistantContextValue = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AssistantContext);
};
_s(useAssistantContextValue, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
const AuiProvider = ({ value, children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AssistantContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/store/src/utils/react-assistant-context.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c2 = AuiProvider;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "DefaultAssistantClientProxiedAssistantState");
__turbopack_context__.k.register(_c1, "AssistantContext");
__turbopack_context__.k.register(_c2, "AuiProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/derived.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Derived",
    ()=>Derived
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
;
const Derived = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = (_config)=>{
    return null;
});
_c1 = Derived;
var _c, _c1;
__turbopack_context__.k.register(_c, "Derived$resource");
__turbopack_context__.k.register(_c1, "Derived");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/attach-default-peers.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/utils/split-clients.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapSplitClients",
    ()=>tapSplitClients
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/attach-default-peers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
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
        if (clientElement.type === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"]) {
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
        const defaultPeers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDefaultPeers"])(clientElement.type);
        if (!defaultPeers) return [];
        const result = [];
        for (const [key, peerElement] of Object.entries(defaultPeers)){
            result.push([
                key,
                peerElement
            ]);
            // If this peer is a root client with its own default peers, recursively gather them
            if (peerElement.type !== __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"]) {
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
            if (peerElement.type === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"]) {
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>object, [
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/types/events.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/utils/notification-manager.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationManager",
    ()=>NotificationManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-const.ts [app-client] (ecmascript)");
;
;
const NotificationManager = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$const$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapConst"])(()=>{
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
_c1 = NotificationManager;
var _c, _c1;
__turbopack_context__.k.register(_c, "NotificationManager$resource");
__turbopack_context__.k.register(_c1, "NotificationManager");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/utils/tap-assistant-context.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapAssistantClientRef",
    ()=>tapAssistantClientRef,
    "tapAssistantEmit",
    ()=>tapAssistantEmit,
    "withAssistantTapContextProvider",
    ()=>withAssistantTapContextProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect-event.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-client-stack-context.ts [app-client] (ecmascript)");
;
;
const AssistantTapContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createResourceContext"])(null);
const withAssistantTapContextProvider = (value, fn)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withContextProvider"])(AssistantTapContext, value, fn);
};
const tapAssistantTapContext = ()=>{
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tap"])(AssistantTapContext);
    if (!ctx) throw new Error("AssistantTapContext is not available");
    return ctx;
};
const tapAssistantClientRef = ()=>{
    return tapAssistantTapContext().clientRef;
};
const tapAssistantEmit = ()=>{
    const { emit } = tapAssistantTapContext();
    const clientStack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientStack"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffectEvent"])((event, payload)=>{
        emit(event, payload, clientStack);
    });
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssistantClientResource",
    ()=>AssistantClientResource,
    "useAui",
    ()=>useAui
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$react$2f$use$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/react/use-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-resources.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect-event.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-ref.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$store$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/store-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$split$2d$clients$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/split-clients.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$types$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/types/events.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$notification$2d$manager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/notification-manager.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-client-stack-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/proxied-assistant-state.tsx [app-client] (ecmascript)");
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
const RootClientResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ({ element, emit, clientRef })=>{
    const { methods, state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withAssistantTapContextProvider"])({
        clientRef,
        emit
    }, ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientResource"])(element));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            state,
            methods
        }), [
        methods,
        state
    ]);
});
_c1 = RootClientResource;
const RootClientAccessorResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c2 = ({ element, notifications, clientRef, name })=>{
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$store$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StoreResource"])(RootClientResource({
        element,
        emit: notifications.emit,
        clientRef
    })));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        return store.subscribe(notifications.notifySubscribers);
    }, [
        store,
        notifications
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
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
_c3 = RootClientAccessorResource;
const NoOpRootClientsAccessorsResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c4 = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            clients: [],
            subscribe: undefined,
            on: undefined
        }), []);
});
_c5 = NoOpRootClientsAccessorsResource;
const RootClientsAccessorsResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c6 = ({ clients: inputClients, clientRef })=>{
    const notifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$notification$2d$manager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NotificationManager"])());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>clientRef.parent.subscribe(notifications.notifySubscribers), [
        clientRef,
        notifications
    ]);
    const results = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapResources"])(()=>Object.keys(inputClients).map((key)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withKey"])(key, RootClientAccessorResource({
                element: inputClients[key],
                notifications,
                clientRef,
                name: key
            }))), [
        inputClients,
        notifications,
        clientRef
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        return {
            clients: results,
            subscribe: notifications.subscribe,
            on: function(selector, callback) {
                if (!this) {
                    throw new Error("const { on } = useAui() is not supported. Use aui.on() instead.");
                }
                const { scope, event } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$types$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeEventSelector"])(selector);
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
                    const index = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$client$2d$stack$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClientIndex"])(scopeClient);
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
_c7 = RootClientsAccessorsResource;
const getMeta = (props, clientRef, memo)=>{
    if ("source" in props && "query" in props) return props;
    if (memo.dep === props) return memo.meta;
    const meta = props.getMeta(clientRef.current);
    memo.meta = meta;
    memo.dep = props;
    return meta;
};
const DerivedClientAccessorResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c8 = ({ element, clientRef, name })=>{
    const get = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffectEvent"])(()=>element.props);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
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
_c9 = DerivedClientAccessorResource;
const DerivedClientsAccessorsResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c10 = ({ clients, clientRef })=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapResources"])(()=>Object.keys(clients).map((key)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withKey"])(key, DerivedClientAccessorResource({
                element: clients[key],
                clientRef,
                name: key
            }))), [
        clients,
        clientRef
    ]);
});
_c11 = DerivedClientsAccessorsResource;
const AssistantClientResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c12 = ({ parent, clients })=>{
    const { rootClients, derivedClients } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$split$2d$clients$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapSplitClients"])(clients, parent);
    const clientRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapRef"])({
        parent: parent,
        current: null
    }).current;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        // if (clientRef.current && clientRef.current !== client)
        //   throw new Error("clientRef.current !== client");
        clientRef.current = client;
    });
    const rootFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapResource"])(Object.keys(rootClients).length > 0 ? RootClientsAccessorsResource({
        clients: rootClients,
        clientRef
    }) : NoOpRootClientsAccessorsResource());
    const derivedFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])(DerivedClientsAccessorsResource({
        clients: derivedClients,
        clientRef
    }));
    const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        // Swap DefaultAssistantClient -> createRootAssistantClient at root to change error message
        const proto = parent === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultAssistantClient"] ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRootAssistantClient"])() : parent;
        const client = Object.create(proto);
        Object.assign(client, {
            subscribe: rootFields.subscribe ?? parent.subscribe,
            on: rootFields.on ?? parent.on,
            [__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROXIED_ASSISTANT_STATE_SYMBOL"]]: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createProxiedAssistantState"])(client)
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
_c13 = AssistantClientResource;
function useAui(clients, { parent } = {
    parent: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAssistantContextValue"])()
}) {
    if (clients) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$react$2f$use$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useResource"])(AssistantClientResource({
            parent: parent ?? __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultAssistantClient"],
            clients
        }));
    }
    if (parent === null) throw new Error("received null parent, this usage is not allowed");
    return parent;
}
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13;
__turbopack_context__.k.register(_c, "RootClientResource$resource");
__turbopack_context__.k.register(_c1, "RootClientResource");
__turbopack_context__.k.register(_c2, "RootClientAccessorResource$resource");
__turbopack_context__.k.register(_c3, "RootClientAccessorResource");
__turbopack_context__.k.register(_c4, "NoOpRootClientsAccessorsResource$resource");
__turbopack_context__.k.register(_c5, "NoOpRootClientsAccessorsResource");
__turbopack_context__.k.register(_c6, "RootClientsAccessorsResource$resource");
__turbopack_context__.k.register(_c7, "RootClientsAccessorsResource");
__turbopack_context__.k.register(_c8, "DerivedClientAccessorResource$resource");
__turbopack_context__.k.register(_c9, "DerivedClientAccessorResource");
__turbopack_context__.k.register(_c10, "DerivedClientsAccessorsResource$resource");
__turbopack_context__.k.register(_c11, "DerivedClientsAccessorsResource");
__turbopack_context__.k.register(_c12, "AssistantClientResource$resource");
__turbopack_context__.k.register(_c13, "AssistantClientResource");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/tap-client-lookup.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapClientLookup",
    ()=>tapClientLookup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-resources.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$wrapper$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/wrapper-resource.ts [app-client] (ecmascript)");
;
;
;
const ClientResourceWithKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$wrapper$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wrapperResource"])(_c = (el)=>{
    if (el.key === undefined) {
        throw new Error("tapClientResource: Element has no key");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClientResource"])(el));
});
_c1 = ClientResourceWithKey;
function tapClientLookup(getElements, getElementsDeps) {
    const resources = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$resources$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapResources"])(()=>getElements().map((el)=>ClientResourceWithKey(el)), // biome-ignore lint/correctness/useExhaustiveDependencies: getElementsDeps is passed through from caller
    getElementsDeps);
    const keys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>Object.keys(resources), [
        resources
    ]);
    // For arrays, track element key -> index mapping
    const keyToIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
        return resources.reduce((acc, resource, index)=>{
            acc[resource.key] = index;
            return acc;
        }, {});
    }, [
        resources
    ]);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
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
var _c, _c1;
__turbopack_context__.k.register(_c, "ClientResourceWithKey$wrapperResource");
__turbopack_context__.k.register(_c1, "ClientResourceWithKey");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tapSubscribable",
    ()=>tapSubscribable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
;
const tapSubscribable = (subscribable)=>{
    const [, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(subscribable.getState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        setState(subscribable.getState());
        return subscribable.subscribe(()=>{
            setState(subscribable.getState());
        });
    }, [
        subscribable
    ]);
    return subscribable.getState();
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/legacy-runtime/client/thread-list-item-runtime-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemClient",
    ()=>ThreadListItemClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-client] (ecmascript)");
;
;
;
const ThreadListItemClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ({ runtime })=>{
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    const emit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapAssistantEmit"])();
    // Bind thread list item events to event manager
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
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
_c1 = ThreadListItemClient;
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadListItemClient$resource");
__turbopack_context__.k.register(_c1, "ThreadListItemClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/legacy-runtime/client/attachment-runtime-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentRuntimeClient",
    ()=>AttachmentRuntimeClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-client] (ecmascript)");
;
;
const AttachmentRuntimeClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ({ runtime })=>{
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    return {
        state,
        methods: {
            getState: ()=>state,
            remove: runtime.remove,
            __internal_getRuntime: ()=>runtime
        }
    };
});
_c1 = AttachmentRuntimeClient;
var _c, _c1;
__turbopack_context__.k.register(_c, "AttachmentRuntimeClient$resource");
__turbopack_context__.k.register(_c1, "AttachmentRuntimeClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/legacy-runtime/client/composer-runtime-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerClient",
    ()=>ComposerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-lookup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$attachment$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/attachment-runtime-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-client] (ecmascript)");
;
;
;
;
const ComposerAttachmentClientByIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ({ runtime, index })=>{
    const attachmentRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>runtime.getAttachmentByIndex(index), [
        runtime,
        index
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$attachment$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AttachmentRuntimeClient"])({
        runtime: attachmentRuntime
    }));
});
_c1 = ComposerAttachmentClientByIndex;
const ComposerClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c2 = ({ threadIdRef, messageIdRef, runtime })=>{
    const runtimeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    const emit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapAssistantEmit"])();
    // Bind composer events to event manager
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
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
    const attachments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>runtimeState.attachments.map((attachment, idx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withKey"])(attachment.id, ComposerAttachmentClientByIndex({
                runtime,
                index: idx
            }))), [
        runtimeState.attachments,
        runtime
    ]);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
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
_c3 = ComposerClient;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ComposerAttachmentClientByIndex$resource");
__turbopack_context__.k.register(_c1, "ComposerAttachmentClientByIndex");
__turbopack_context__.k.register(_c2, "ComposerClient$resource");
__turbopack_context__.k.register(_c3, "ComposerClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/legacy-runtime/client/message-part-runtime-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartClient",
    ()=>MessagePartClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-client] (ecmascript)");
;
;
const MessagePartClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ({ runtime })=>{
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
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
_c1 = MessagePartClient;
var _c, _c1;
__turbopack_context__.k.register(_c, "MessagePartClient$resource");
__turbopack_context__.k.register(_c1, "MessagePartClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/legacy-runtime/client/message-runtime-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageClient",
    ()=>MessageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-lookup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$composer$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/composer-runtime-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$message$2d$part$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/message-part-runtime-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$attachment$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/attachment-runtime-client.ts [app-client] (ecmascript)");
;
;
;
;
;
;
const MessageAttachmentClientByIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ({ runtime, index })=>{
    const attachmentRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>runtime.getAttachmentByIndex(index), [
        runtime,
        index
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$attachment$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AttachmentRuntimeClient"])({
        runtime: attachmentRuntime
    }));
});
_c1 = MessageAttachmentClientByIndex;
const MessagePartByIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c2 = ({ runtime, index })=>{
    const partRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>runtime.getMessagePartByIndex(index), [
        runtime,
        index
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$message$2d$part$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePartClient"])({
        runtime: partRuntime
    }));
});
_c3 = MessagePartByIndex;
const MessageClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c4 = ({ runtime, threadIdRef })=>{
    const runtimeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    const [isCopiedState, setIsCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(false);
    const [isHoveringState, setIsHovering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(false);
    const messageIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            get current () {
                return runtime.getState().id;
            }
        }), [
        runtime
    ]);
    const composer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$composer$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerClient"])({
        runtime: runtime.composer,
        threadIdRef,
        messageIdRef
    }));
    const parts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>runtimeState.content.map((part, idx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withKey"])("toolCallId" in part && part.toolCallId != null ? `toolCallId-${part.toolCallId}` : `index-${idx}`, MessagePartByIndex({
                runtime,
                index: idx
            }))), [
        runtimeState.content,
        runtime
    ]);
    const attachments = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>(runtimeState.attachments ?? []).map((attachment, idx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withKey"])(attachment.id, MessageAttachmentClientByIndex({
                runtime,
                index: idx
            }))), [
        runtimeState.attachments,
        runtime
    ]);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
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
_c5 = MessageClient;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "MessageAttachmentClientByIndex$resource");
__turbopack_context__.k.register(_c1, "MessageAttachmentClientByIndex");
__turbopack_context__.k.register(_c2, "MessagePartByIndex$resource");
__turbopack_context__.k.register(_c3, "MessagePartByIndex");
__turbopack_context__.k.register(_c4, "MessageClient$resource");
__turbopack_context__.k.register(_c5, "MessageClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/legacy-runtime/client/thread-runtime-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadClient",
    ()=>ThreadClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-lookup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$composer$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/composer-runtime-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$message$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/message-runtime-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-client] (ecmascript)");
;
;
;
;
;
const MessageClientById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ({ runtime, id, threadIdRef })=>{
    const messageRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>runtime.getMessageById(id), [
        runtime,
        id
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$message$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageClient"])({
        runtime: messageRuntime,
        threadIdRef
    }));
});
_c1 = MessageClientById;
const ThreadClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c2 = ({ runtime })=>{
    const runtimeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    const emit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapAssistantEmit"])();
    // Bind thread events to event manager
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
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
    const threadIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
            get current () {
                return runtime.getState().threadId;
            }
        }), [
        runtime
    ]);
    const composer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$composer$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerClient"])({
        runtime: runtime.composer,
        threadIdRef
    }));
    const messages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>runtimeState.messages.map((m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withKey"])(m.id, MessageClientById({
                runtime,
                id: m.id,
                threadIdRef
            }))), [
        runtimeState.messages,
        runtime,
        threadIdRef
    ]);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
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
_c3 = ThreadClient;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "MessageClientById$resource");
__turbopack_context__.k.register(_c1, "MessageClientById");
__turbopack_context__.k.register(_c2, "ThreadClient$resource");
__turbopack_context__.k.register(_c3, "ThreadClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/legacy-runtime/client/thread-list-runtime-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListClient",
    ()=>ThreadListClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-lookup.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/util-hooks/tap-subscribable.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$item$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/thread-list-item-runtime-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/thread-runtime-client.ts [app-client] (ecmascript)");
;
;
;
;
;
const ThreadListItemClientById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ({ runtime, id })=>{
    const threadListItemRuntime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>runtime.getItemById(id), [
        runtime,
        id
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$item$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemClient"])({
        runtime: threadListItemRuntime
    }));
});
_c1 = ThreadListItemClientById;
const ThreadListClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c2 = ({ runtime, __internal_assistantRuntime })=>{
    const runtimeState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$util$2d$hooks$2f$tap$2d$subscribable$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapSubscribable"])(runtime);
    const main = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadClient"])({
        runtime: runtime.main
    }));
    const threadItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>Object.keys(runtimeState.threadItems).map((id)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withKey"])(id, ThreadListItemClientById({
                runtime,
                id
            }))), [
        runtimeState.threadItems,
        runtime
    ]);
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>{
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
_c3 = ThreadListClient;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ThreadListItemClientById$resource");
__turbopack_context__.k.register(_c1, "ThreadListItemClientById");
__turbopack_context__.k.register(_c2, "ThreadListClient$resource");
__turbopack_context__.k.register(_c3, "ThreadListClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/model-context/model-context-types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/utils/composite-context-provider.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CompositeContextProvider",
    ()=>CompositeContextProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$model$2d$context$2f$model$2d$context$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/model-context/model-context-types.ts [app-client] (ecmascript)");
;
class CompositeContextProvider {
    _providers = new Set();
    getModelContext() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$model$2d$context$2f$model$2d$context$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeModelContexts"])(this._providers);
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/client/model-context-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModelContext",
    ()=>ModelContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$composite$2d$context$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/composite-context-provider.ts [app-client] (ecmascript)");
;
;
const version = 1;
const ModelContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ()=>{
    const [state] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(()=>({
            version: version + 1
        }));
    const composite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$composite$2d$context$2d$provider$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CompositeContextProvider"](), []);
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
_c1 = ModelContext;
var _c, _c1;
__turbopack_context__.k.register(_c, "ModelContext$resource");
__turbopack_context__.k.register(_c1, "ModelContext");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/client/tools.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tools",
    ()=>Tools
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-callback.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/attach-default-peers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$model$2d$context$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/client/model-context-client.ts [app-client] (ecmascript)");
;
;
;
const Tools = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ({ toolkit })=>{
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(()=>({
            tools: {}
        }));
    const clientRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapAssistantClientRef"])();
    const setToolUI = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$callback$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapCallback"])((toolName, render)=>{
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
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
_c1 = Tools;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attachDefaultPeers"])(Tools, {
    modelContext: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$model$2d$context$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModelContext"])()
});
var _c, _c1;
__turbopack_context__.k.register(_c, "Tools$resource");
__turbopack_context__.k.register(_c1, "Tools");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/client/suggestions.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Suggestions",
    ()=>Suggestions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-state.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/with-key.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/tap-client-lookup.ts [app-client] (ecmascript)");
;
;
const SuggestionClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = (state)=>{
    return {
        state,
        methods: {
            getState: ()=>state
        }
    };
});
_c1 = SuggestionClient;
const SuggestionsResource = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c2 = (suggestions)=>{
    const [state] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$state$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapState"])(()=>{
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
    const suggestionClients = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$tap$2d$client$2d$lookup$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapClientLookup"])(()=>state.suggestions.map((suggestion, index)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$with$2d$key$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["withKey"])(index, SuggestionClient(suggestion))), [
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
_c3 = SuggestionsResource;
const Suggestions = SuggestionsResource;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "SuggestionClient$resource");
__turbopack_context__.k.register(_c1, "SuggestionClient");
__turbopack_context__.k.register(_c2, "SuggestionsResource$resource");
__turbopack_context__.k.register(_c3, "SuggestionsResource");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/legacy-runtime/runtime-adapter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RuntimeAdapter",
    ()=>RuntimeAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-effect.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-inline-resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/thread-list-runtime-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/tap-assistant-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/attach-default-peers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$model$2d$context$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/client/model-context-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$tools$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/client/tools.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$suggestions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/client/suggestions.ts [app-client] (ecmascript)");
;
;
;
;
;
const RuntimeAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = (runtime)=>{
    const clientRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$tap$2d$assistant$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapAssistantClientRef"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$effect$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapEffect"])(()=>{
        return runtime.registerModelContextProvider(clientRef.current.modelContext());
    }, [
        runtime,
        clientRef
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$inline$2d$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapInlineResource"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListClient"])({
        runtime: runtime.threads,
        __internal_assistantRuntime: runtime
    }));
});
_c1 = RuntimeAdapter;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$attach$2d$default$2d$peers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attachDefaultPeers"])(RuntimeAdapter, {
    modelContext: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$model$2d$context$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModelContext"])(),
    tools: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$tools$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tools"])({}),
    suggestions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$client$2f$suggestions$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suggestions"])(),
    threadListItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"])({
        source: "threads",
        query: {
            type: "main"
        },
        get: (aui)=>aui.threads().item("main")
    }),
    thread: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"])({
        source: "threads",
        query: {
            type: "main"
        },
        get: (aui)=>aui.threads().thread("main")
    }),
    composer: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"])({
        source: "thread",
        query: {},
        get: (aui)=>aui.threads().thread("main").composer
    })
});
var _c, _c1;
__turbopack_context__.k.register(_c, "RuntimeAdapter$resource");
__turbopack_context__.k.register(_c1, "RuntimeAdapter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/stores/thread-viewport.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeThreadViewportStore",
    ()=>makeThreadViewportStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.11_@types+react@19.2.10_immer@11.1.3_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
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
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])(()=>({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/react/utils/create-context-hook.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createContextHook",
    ()=>createContextHook
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
function createContextHook(context, providerName) {
    var _s = __turbopack_context__.k.signature();
    function useContextHook(options) {
        _s();
        const contextValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(context);
        if (!options?.optional && !contextValue) {
            throw new Error(`This component must be used within ${providerName}.`);
        }
        return contextValue;
    }
    _s(useContextHook, "LIxFXvZbUdXE/TWxKLLXMjM3Mig=");
    return useContextHook;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/react/utils/create-context-store-hook.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createContextStoreHook",
    ()=>createContextStoreHook
]);
function createContextStoreHook(contextHook, contextKey) {
    var _s = __turbopack_context__.k.signature();
    function useStoreStoreHook(options) {
        const context = contextHook(options);
        if (!context) return null;
        return context[contextKey];
    }
    function useStoreHook(param) {
        _s();
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
    _s(useStoreHook, "0Z0qWgPYYS7oHk4pu9z1XXM6Qu8=", false, function() {
        return [
            useStoreStoreHook
        ];
    });
    // Return an object with keys based on contextKey
    return {
        [contextKey]: useStoreHook,
        [`${contextKey}Store`]: useStoreStoreHook
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/react/thread-viewport-context.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadViewportContext",
    ()=>ThreadViewportContext,
    "useThreadViewport",
    ()=>useThreadViewport,
    "useThreadViewportStore",
    ()=>useThreadViewportStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$hook$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/utils/create-context-hook.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$store$2d$hook$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/utils/create-context-store-hook.ts [app-client] (ecmascript)");
"use client";
;
;
;
const ThreadViewportContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const useThreadViewportContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$hook$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextHook"])(ThreadViewportContext, "ThreadPrimitive.Viewport");
const { useThreadViewport, useThreadViewportStore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$store$2d$hook$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextStoreHook"])(useThreadViewportContext, "useThreadViewport");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/readonly-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "writableStore",
    ()=>writableStore
]);
const writableStore = (store)=>{
    return store;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/providers/thread-viewport-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveViewportProvider",
    ()=>ThreadPrimitiveViewportProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$stores$2f$thread$2d$viewport$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/stores/thread-viewport.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/readonly-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const useThreadViewportStoreValue = (options)=>{
    _s();
    const outerViewport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewportStore"])({
        optional: true
    });
    const [store] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useThreadViewportStoreValue.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$stores$2f$thread$2d$viewport$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeThreadViewportStore"])(options)
    }["useThreadViewportStoreValue.useState"]);
    // Forward scrollToBottom from outer viewport to inner viewport
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useThreadViewportStoreValue.useEffect": ()=>{
            return outerViewport?.getState().onScrollToBottom({
                "useThreadViewportStoreValue.useEffect": ()=>{
                    store.getState().scrollToBottom();
                }
            }["useThreadViewportStoreValue.useEffect"]);
        }
    }["useThreadViewportStoreValue.useEffect"], [
        outerViewport,
        store
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useThreadViewportStoreValue.useEffect": ()=>{
            if (!outerViewport) return;
            return store.subscribe({
                "useThreadViewportStoreValue.useEffect": (state)=>{
                    if (outerViewport.getState().isAtBottom !== state.isAtBottom) {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writableStore"])(outerViewport).setState({
                            isAtBottom: state.isAtBottom
                        });
                    }
                }
            }["useThreadViewportStoreValue.useEffect"]);
        }
    }["useThreadViewportStoreValue.useEffect"], [
        store,
        outerViewport
    ]);
    // Sync options to store when they change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useThreadViewportStoreValue.useEffect": ()=>{
            const nextState = {
                turnAnchor: options.turnAnchor ?? "bottom"
            };
            const currentState = store.getState();
            if (currentState.turnAnchor !== nextState.turnAnchor) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writableStore"])(store).setState(nextState);
            }
        }
    }["useThreadViewportStoreValue.useEffect"], [
        store,
        options.turnAnchor
    ]);
    return store;
};
_s(useThreadViewportStoreValue, "3SaM7uVdJekdH+JTg+PqEN9IHh0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewportStore"]
    ];
});
const ThreadPrimitiveViewportProvider = ({ children, options = {} })=>{
    _s1();
    const useThreadViewport = useThreadViewportStoreValue(options);
    const [context] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ThreadPrimitiveViewportProvider.useState": ()=>{
            return {
                useThreadViewport
            };
        }
    }["ThreadPrimitiveViewportProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadViewportContext"].Provider, {
        value: context,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/thread-viewport-provider.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(ThreadPrimitiveViewportProvider, "YC1P6LJtI25qkfHOHZ64L8t5gY4=", false, function() {
    return [
        useThreadViewportStoreValue
    ];
});
_c = ThreadPrimitiveViewportProvider;
var _c;
__turbopack_context__.k.register(_c, "ThreadPrimitiveViewportProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/legacy-runtime/assistant-runtime-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssistantRuntimeProvider",
    ()=>AssistantRuntimeProvider,
    "AssistantRuntimeProviderImpl",
    ()=>AssistantRuntimeProviderImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/runtime-adapter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/thread-viewport-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const getRenderComponent = (runtime)=>{
    return runtime._core?.RenderComponent;
};
const AssistantRuntimeProviderImpl = ({ children, aui: parent = null, runtime })=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])({
        threads: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$runtime$2d$adapter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RuntimeAdapter"])(runtime)
    }, {
        parent: parent
    });
    // useEffect(() => {
    //   if (process.env["NODE_ENV"] === "production") return;
    //   return DevToolsProviderApi.register(aui);
    // }, [aui]);
    const RenderComponent = getRenderComponent(runtime);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: [
            RenderComponent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RenderComponent, {}, void 0, false, {
                fileName: "[project]/packages/react/src/legacy-runtime/assistant-runtime-provider.tsx",
                lineNumber: 43,
                columnNumber: 27
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportProvider"], {
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
_s(AssistantRuntimeProviderImpl, "BbJ1x+sAPxy/dizeIXhuPkzme6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c = AssistantRuntimeProviderImpl;
const AssistantRuntimeProvider = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(AssistantRuntimeProviderImpl);
_c1 = AssistantRuntimeProvider;
var _c, _c1;
__turbopack_context__.k.register(_c, "AssistantRuntimeProviderImpl");
__turbopack_context__.k.register(_c1, "AssistantRuntimeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/attachment/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/attachment/attachment-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentPrimitiveRoot",
    ()=>AttachmentPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
;
;
const AttachmentPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = (props, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/attachment/attachment-root.tsx",
        lineNumber: 35,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = AttachmentPrimitiveRoot;
AttachmentPrimitiveRoot.displayName = "AttachmentPrimitive.Root";
var _c, _c1;
__turbopack_context__.k.register(_c, "AttachmentPrimitiveRoot$forwardRef");
__turbopack_context__.k.register(_c1, "AttachmentPrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuiState",
    ()=>useAuiState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/proxied-assistant-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
const useAuiState = (selector)=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const proxiedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$proxied$2d$assistant$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProxiedAssistantState"])(aui);
    const slice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(aui.subscribe, {
        "useAuiState.useSyncExternalStore[slice]": ()=>selector(proxiedState)
    }["useAuiState.useSyncExternalStore[slice]"], {
        "useAuiState.useSyncExternalStore[slice]": ()=>selector(proxiedState)
    }["useAuiState.useSyncExternalStore[slice]"]);
    if (slice === proxiedState) {
        throw new Error("You tried to return the entire AssistantState. This is not supported due to technical limitations.");
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebugValue"])(slice);
    return slice;
};
_s(useAuiState, "NIoDgWnIsmp0HwjdWbyalDs5lvY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/attachment/attachment-thumb.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentPrimitiveThumb",
    ()=>AttachmentPrimitiveThumb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const AttachmentPrimitiveThumb = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s((props, ref)=>{
    _s();
    const ext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "AttachmentPrimitiveThumb.useAuiState[ext]": ({ attachment })=>{
            const parts = attachment.name.split(".");
            return parts.length > 1 ? parts.pop() : "";
        }
    }["AttachmentPrimitiveThumb.useAuiState[ext]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
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
}, "WV0A3tZMyTyJ12TcBKHx+/shb6s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
})), "WV0A3tZMyTyJ12TcBKHx+/shb6s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c1 = AttachmentPrimitiveThumb;
AttachmentPrimitiveThumb.displayName = "AttachmentPrimitive.Thumb";
var _c, _c1;
__turbopack_context__.k.register(_c, "AttachmentPrimitiveThumb$forwardRef");
__turbopack_context__.k.register(_c1, "AttachmentPrimitiveThumb");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/attachment/attachment-name.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentPrimitiveName",
    ()=>AttachmentPrimitiveName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const AttachmentPrimitiveName = ()=>{
    _s();
    const name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "AttachmentPrimitiveName.useAuiState[name]": ({ attachment })=>attachment.name
    }["AttachmentPrimitiveName.useAuiState[name]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: name
    }, void 0, false);
};
_s(AttachmentPrimitiveName, "7yoM3iZ+qQAU+oOK33PL/OXo1wE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c = AttachmentPrimitiveName;
AttachmentPrimitiveName.displayName = "AttachmentPrimitive.Name";
var _c;
__turbopack_context__.k.register(_c, "AttachmentPrimitiveName");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createActionButton",
    ()=>createActionButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
;
;
;
;
const createActionButton = (displayName, useActionButton, forwardProps = [])=>{
    var _s = __turbopack_context__.k.signature();
    const ActionButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_s((props, forwardedRef)=>{
        _s();
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
            type: "button",
            ...primitiveProps,
            ref: forwardedRef,
            disabled: primitiveProps.disabled || !callback,
            onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(primitiveProps.onClick, callback)
        }, void 0, false, {
            fileName: "[project]/packages/react/src/utils/create-action-button.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }, "P/SLJdzQyY52sFFBZcdCImmxVuA=", false, function() {
        return [
            useActionButton
        ];
    }));
    ActionButton.displayName = displayName;
    return ActionButton;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/attachment/attachment-remove.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentPrimitiveRemove",
    ()=>AttachmentPrimitiveRemove
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useAttachmentRemove = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const handleRemoveAttachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAttachmentRemove.useCallback[handleRemoveAttachment]": ()=>{
            aui.attachment().remove();
        }
    }["useAttachmentRemove.useCallback[handleRemoveAttachment]"], [
        aui
    ]);
    return handleRemoveAttachment;
};
_s(useAttachmentRemove, "MVhScfMfJLGK6NnLAxC2iewibww=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
const AttachmentPrimitiveRemove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("AttachmentPrimitive.Remove", useAttachmentRemove);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/attachment/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Name",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$name$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AttachmentPrimitiveName"],
    "Remove",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$remove$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AttachmentPrimitiveRemove"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AttachmentPrimitiveRoot"],
    "unstable_Thumb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$thumb$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AttachmentPrimitiveThumb"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/attachment-root.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$thumb$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/attachment-thumb.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$name$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/attachment-name.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$attachment$2d$remove$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/attachment-remove.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/attachment/index.ts [app-client] (ecmascript) <export * as AttachmentPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$attachment$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/attachment/index.ts [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/composer/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-send.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveSend",
    ()=>ComposerPrimitiveSend,
    "useComposerSend",
    ()=>useComposerSend
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useComposerSend = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useComposerSend.useAuiState[disabled]": (s)=>s.thread.isRunning || !s.composer.isEditing || s.composer.isEmpty
    }["useComposerSend.useAuiState[disabled]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useComposerSend.useCallback[callback]": ()=>{
            aui.composer().send();
        }
    }["useComposerSend.useCallback[callback]"], [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
_s(useComposerSend, "dwEAQvB3pQRhQ0UWtrspbZhyjhU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ComposerPrimitiveSend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.Send", useComposerSend);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveRoot",
    ()=>ComposerPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$send$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-send.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const ComposerPrimitiveRoot = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ onSubmit, ...rest }, forwardedRef)=>{
    _s();
    const send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$send$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposerSend"])();
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!send) return;
        send();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].form, {
        ...rest,
        ref: forwardedRef,
        onSubmit: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onSubmit, handleSubmit)
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/composer/composer-root.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "i5nYA6t1dRG0P/K7CDDoQqmIK/4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$send$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposerSend"]
    ];
})), "i5nYA6t1dRG0P/K7CDDoQqmIK/4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$send$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposerSend"]
    ];
});
_c1 = ComposerPrimitiveRoot;
ComposerPrimitiveRoot.displayName = "ComposerPrimitive.Root";
var _c, _c1;
__turbopack_context__.k.register(_c, "ComposerPrimitiveRoot$forwardRef");
__turbopack_context__.k.register(_c1, "ComposerPrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/utils/hooks/use-on-scroll-to-bottom.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOnScrollToBottom",
    ()=>useOnScrollToBottom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useOnScrollToBottom = (callback)=>{
    _s();
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"])(callback);
    const onScrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"])({
        "useOnScrollToBottom.useThreadViewport[onScrollToBottom]": (vp)=>vp.onScrollToBottom
    }["useOnScrollToBottom.useThreadViewport[onScrollToBottom]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useOnScrollToBottom.useEffect": ()=>{
            return onScrollToBottom(callbackRef);
        }
    }["useOnScrollToBottom.useEffect"], [
        onScrollToBottom,
        callbackRef
    ]);
};
_s(useOnScrollToBottom, "GhG+sv+gQEorWQOSpuuBQCiYwgM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveInput",
    ()=>ComposerPrimitiveInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$textarea$2d$autosize$40$8$2e$5$2e$9_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f$react$2d$textarea$2d$autosize$2f$dist$2f$react$2d$textarea$2d$autosize$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/react-textarea-autosize@8.5.9_@types+react@19.2.10_react@19.2.4/node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.development.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-escape-keydown@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-on-scroll-to-bottom.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/scheduler.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
const ComposerPrimitiveInput = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ autoFocus = false, asChild, disabled: disabledProp, onChange, onKeyDown, onPaste, submitOnEnter = true, cancelOnEscape = true, unstable_focusOnRunStart = true, unstable_focusOnScrollToBottom = true, unstable_focusOnThreadSwitched = true, addAttachmentOnPaste = true, ...rest }, forwardedRef)=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ComposerPrimitiveInput.useAuiState[value]": ({ composer })=>{
            if (!composer.isEditing) return "";
            return composer.text;
        }
    }["ComposerPrimitiveInput.useAuiState[value]"]);
    const Component = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$textarea$2d$autosize$40$8$2e$5$2e$9_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f$react$2d$textarea$2d$autosize$2f$dist$2f$react$2d$textarea$2d$autosize$2e$browser$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
    const isDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ComposerPrimitiveInput.useAuiState": ({ thread, composer })=>thread.isDisabled || composer.dictation?.inputDisabled
    }["ComposerPrimitiveInput.useAuiState"]) || disabledProp;
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, textareaRef);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKeydown"])({
        "ComposerPrimitiveInput.useEscapeKeydown": (e)=>{
            if (!cancelOnEscape) return;
            // Only handle ESC if it originated from within this input
            if (!textareaRef.current?.contains(e.target)) return;
            const composer = aui.composer();
            if (composer.getState().canCancel) {
                composer.cancel();
                e.preventDefault();
            }
        }
    }["ComposerPrimitiveInput.useEscapeKeydown"]);
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
    const focus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ComposerPrimitiveInput.useCallback[focus]": ()=>{
            const textarea = textareaRef.current;
            if (!textarea || !autoFocusEnabled) return;
            textarea.focus({
                preventScroll: true
            });
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }["ComposerPrimitiveInput.useCallback[focus]"], [
        autoFocusEnabled
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComposerPrimitiveInput.useEffect": ()=>focus()
    }["ComposerPrimitiveInput.useEffect"], [
        focus
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnScrollToBottom"])({
        "ComposerPrimitiveInput.useOnScrollToBottom": ()=>{
            if (aui.composer().getState().type === "thread" && unstable_focusOnScrollToBottom) {
                focus();
            }
        }
    }["ComposerPrimitiveInput.useOnScrollToBottom"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComposerPrimitiveInput.useEffect": ()=>{
            if (aui.composer().getState().type !== "thread" || !unstable_focusOnRunStart) return undefined;
            return aui.on("thread.runStart", focus);
        }
    }["ComposerPrimitiveInput.useEffect"], [
        unstable_focusOnRunStart,
        focus,
        aui
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComposerPrimitiveInput.useEffect": ()=>{
            if (aui.composer().getState().type !== "thread" || !unstable_focusOnThreadSwitched) return undefined;
            return aui.on("threadListItem.switchedTo", focus);
        }
    }["ComposerPrimitiveInput.useEffect"], [
        unstable_focusOnThreadSwitched,
        focus,
        aui
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        name: "input",
        value: value,
        ...rest,
        ref: ref,
        disabled: isDisabled,
        onChange: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onChange, (e)=>{
            if (!aui.composer().getState().isEditing) return;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$scheduler$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushResourcesSync"])(()=>{
                aui.composer().setText(e.target.value);
            });
        }),
        onKeyDown: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onKeyDown, handleKeyPress),
        onPaste: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onPaste, handlePaste)
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/composer/composer-input.tsx",
        lineNumber: 206,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
}, "Ze+9yIQa1WLnFgjB8CLJ2fw7kNc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKeydown"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnScrollToBottom"]
    ];
})), "Ze+9yIQa1WLnFgjB8CLJ2fw7kNc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKeydown"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnScrollToBottom"]
    ];
});
_c1 = ComposerPrimitiveInput;
ComposerPrimitiveInput.displayName = "ComposerPrimitive.Input";
var _c, _c1;
__turbopack_context__.k.register(_c, "ComposerPrimitiveInput$forwardRef");
__turbopack_context__.k.register(_c1, "ComposerPrimitiveInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-cancel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveCancel",
    ()=>ComposerPrimitiveCancel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useComposerCancel = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useComposerCancel.useAuiState[disabled]": ({ composer })=>!composer.canCancel
    }["useComposerCancel.useAuiState[disabled]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useComposerCancel.useCallback[callback]": ()=>{
            aui.composer().cancel();
        }
    }["useComposerCancel.useCallback[callback]"], [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
_s(useComposerCancel, "dwEAQvB3pQRhQ0UWtrspbZhyjhU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ComposerPrimitiveCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.Cancel", useComposerCancel);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-add-attachment.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveAddAttachment",
    ()=>ComposerPrimitiveAddAttachment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useComposerAddAttachment = ({ multiple = true } = {})=>{
    _s();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useComposerAddAttachment.useAuiState[disabled]": ({ composer })=>!composer.isEditing
    }["useComposerAddAttachment.useAuiState[disabled]"]);
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useComposerAddAttachment.useCallback[callback]": ()=>{
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = multiple;
            input.hidden = true;
            const attachmentAccept = aui.composer().getState().attachmentAccept;
            if (attachmentAccept !== "*") {
                input.accept = attachmentAccept;
            }
            document.body.appendChild(input);
            input.onchange = ({
                "useComposerAddAttachment.useCallback[callback]": (e)=>{
                    const fileList = e.target.files;
                    if (!fileList) return;
                    for (const file of fileList){
                        aui.composer().addAttachment(file);
                    }
                    document.body.removeChild(input);
                }
            })["useComposerAddAttachment.useCallback[callback]"];
            input.oncancel = ({
                "useComposerAddAttachment.useCallback[callback]": ()=>{
                    if (!input.files || input.files.length === 0) {
                        document.body.removeChild(input);
                    }
                }
            })["useComposerAddAttachment.useCallback[callback]"];
            input.click();
        }
    }["useComposerAddAttachment.useCallback[callback]"], [
        aui,
        multiple
    ]);
    if (disabled) return null;
    return callback;
};
_s(useComposerAddAttachment, "2EOq9eT+coyYkqkXfiFybkc93+c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
const ComposerPrimitiveAddAttachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.AddAttachment", useComposerAddAttachment, [
    "multiple"
]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/providers/attachment-by-index-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerAttachmentByIndexProvider",
    ()=>ComposerAttachmentByIndexProvider,
    "MessageAttachmentByIndexProvider",
    ()=>MessageAttachmentByIndexProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const MessageAttachmentByIndexProvider = ({ index, children })=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])({
        attachment: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"])({
            source: "message",
            query: {
                type: "index",
                index
            },
            get: {
                "MessageAttachmentByIndexProvider.useAui[aui]": (aui)=>aui.message().attachment({
                        index
                    })
            }["MessageAttachmentByIndexProvider.useAui[aui]"]
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/attachment-by-index-provider.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MessageAttachmentByIndexProvider, "BbJ1x+sAPxy/dizeIXhuPkzme6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c = MessageAttachmentByIndexProvider;
const ComposerAttachmentByIndexProvider = ({ index, children })=>{
    _s1();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])({
        attachment: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"])({
            source: "composer",
            query: {
                type: "index",
                index
            },
            get: {
                "ComposerAttachmentByIndexProvider.useAui[aui]": (aui)=>aui.composer().attachment({
                        index
                    })
            }["ComposerAttachmentByIndexProvider.useAui[aui]"]
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/attachment-by-index-provider.tsx",
        lineNumber: 35,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(ComposerAttachmentByIndexProvider, "BbJ1x+sAPxy/dizeIXhuPkzme6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c1 = ComposerAttachmentByIndexProvider;
var _c, _c1;
__turbopack_context__.k.register(_c, "MessageAttachmentByIndexProvider");
__turbopack_context__.k.register(_c1, "ComposerAttachmentByIndexProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-attachments.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveAttachmentByIndex",
    ()=>ComposerPrimitiveAttachmentByIndex,
    "ComposerPrimitiveAttachments",
    ()=>ComposerPrimitiveAttachments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$attachment$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/attachment-by-index-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
    _s();
    const attachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "AttachmentComponent.useAuiState[attachment]": ({ attachment })=>attachment
    }["AttachmentComponent.useAuiState[attachment]"]);
    if (!attachment) return null;
    const Component = getComponent(components, attachment);
    if (!Component) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {}, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/composer/composer-attachments.tsx",
        lineNumber: 47,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AttachmentComponent, "wEND96foQ/721yWVG3ZDsS+35/w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c = AttachmentComponent;
const ComposerPrimitiveAttachmentByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$attachment$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerAttachmentByIndexProvider"], {
        index: index,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AttachmentComponent, {
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
_c1 = ComposerPrimitiveAttachmentByIndex;
ComposerPrimitiveAttachmentByIndex.displayName = "ComposerPrimitive.AttachmentByIndex";
const ComposerPrimitiveAttachments = ({ components })=>{
    _s1();
    const attachmentsCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ComposerPrimitiveAttachments.useAuiState[attachmentsCount]": (s)=>s.composer.attachments.length
    }["ComposerPrimitiveAttachments.useAuiState[attachmentsCount]"]);
    const attachmentElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ComposerPrimitiveAttachments.useMemo[attachmentElements]": ()=>{
            return Array.from({
                length: attachmentsCount
            }, {
                "ComposerPrimitiveAttachments.useMemo[attachmentElements]": (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ComposerPrimitiveAttachmentByIndex, {
                        index: index,
                        components: components
                    }, index, false, {
                        fileName: "[project]/packages/react/src/primitives/composer/composer-attachments.tsx",
                        lineNumber: 101,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
            }["ComposerPrimitiveAttachments.useMemo[attachmentElements]"]);
        }
    }["ComposerPrimitiveAttachments.useMemo[attachmentElements]"], [
        attachmentsCount,
        components
    ]);
    return attachmentElements;
};
_s1(ComposerPrimitiveAttachments, "GB8kdy5mygX7OH5aUVDsCct9Zdk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c2 = ComposerPrimitiveAttachments;
ComposerPrimitiveAttachments.displayName = "ComposerPrimitive.Attachments";
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AttachmentComponent");
__turbopack_context__.k.register(_c1, "ComposerPrimitiveAttachmentByIndex");
__turbopack_context__.k.register(_c2, "ComposerPrimitiveAttachments");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-attachment-dropzone.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveAttachmentDropzone",
    ()=>ComposerPrimitiveAttachmentDropzone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ComposerPrimitiveAttachmentDropzone = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ disabled, asChild = false, children, ...rest }, ref)=>{
    _s();
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const handleDragEnterCapture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ComposerPrimitiveAttachmentDropzone.useCallback[handleDragEnterCapture]": (e)=>{
            if (disabled) return;
            e.preventDefault();
            setIsDragging(true);
        }
    }["ComposerPrimitiveAttachmentDropzone.useCallback[handleDragEnterCapture]"], [
        disabled
    ]);
    const handleDragOverCapture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ComposerPrimitiveAttachmentDropzone.useCallback[handleDragOverCapture]": (e)=>{
            if (disabled) return;
            e.preventDefault();
            if (!isDragging) setIsDragging(true);
        }
    }["ComposerPrimitiveAttachmentDropzone.useCallback[handleDragOverCapture]"], [
        disabled,
        isDragging
    ]);
    const handleDragLeaveCapture = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ComposerPrimitiveAttachmentDropzone.useCallback[handleDragLeaveCapture]": (e)=>{
            if (disabled) return;
            e.preventDefault();
            const next = e.relatedTarget;
            if (next && e.currentTarget.contains(next)) {
                return;
            }
            setIsDragging(false);
        }
    }["ComposerPrimitiveAttachmentDropzone.useCallback[handleDragLeaveCapture]"], [
        disabled
    ]);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ComposerPrimitiveAttachmentDropzone.useCallback[handleDrop]": async (e)=>{
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
        }
    }["ComposerPrimitiveAttachmentDropzone.useCallback[handleDrop]"], [
        disabled,
        aui
    ]);
    const dragProps = {
        onDragEnterCapture: handleDragEnterCapture,
        onDragOverCapture: handleDragOverCapture,
        onDragLeaveCapture: handleDragLeaveCapture,
        onDropCapture: handleDrop
    };
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "div";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
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
}, "Aki3MBSGGzk34axeBNsyTNWV408=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
})), "Aki3MBSGGzk34axeBNsyTNWV408=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c1 = ComposerPrimitiveAttachmentDropzone;
ComposerPrimitiveAttachmentDropzone.displayName = "ComposerPrimitive.AttachmentDropzone";
var _c, _c1;
__turbopack_context__.k.register(_c, "ComposerPrimitiveAttachmentDropzone$forwardRef");
__turbopack_context__.k.register(_c1, "ComposerPrimitiveAttachmentDropzone");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-dictate.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveDictate",
    ()=>ComposerPrimitiveDictate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useComposerDictate = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useComposerDictate.useAuiState[disabled]": ({ thread, composer })=>composer.dictation != null || !thread.capabilities.dictation || !composer.isEditing
    }["useComposerDictate.useAuiState[disabled]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useComposerDictate.useCallback[callback]": ()=>{
            aui.composer().startDictation();
        }
    }["useComposerDictate.useCallback[callback]"], [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
_s(useComposerDictate, "dwEAQvB3pQRhQ0UWtrspbZhyjhU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ComposerPrimitiveDictate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.Dictate", useComposerDictate);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-stop-dictation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveStopDictation",
    ()=>ComposerPrimitiveStopDictation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const useComposerStopDictation = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const isDictating = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useComposerStopDictation.useAuiState[isDictating]": ({ composer })=>composer.dictation != null
    }["useComposerStopDictation.useAuiState[isDictating]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useComposerStopDictation.useCallback[callback]": ()=>{
            aui.composer().stopDictation();
        }
    }["useComposerStopDictation.useCallback[callback]"], [
        aui
    ]);
    if (!isDictating) return null;
    return callback;
};
_s(useComposerStopDictation, "vqQ//DbwtBq2rNdEBVBmHDfAPj4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ComposerPrimitiveStopDictation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ComposerPrimitive.StopDictation", useComposerStopDictation);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-dictation-transcript.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveDictationTranscript",
    ()=>ComposerPrimitiveDictationTranscript
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ComposerPrimitiveDictationTranscript = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ children, ...props }, forwardRef)=>{
    _s();
    const transcript = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ComposerPrimitiveDictationTranscript.useAuiState[transcript]": ({ composer })=>composer.dictation?.transcript
    }["ComposerPrimitiveDictationTranscript.useAuiState[transcript]"]);
    if (!transcript) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].span, {
        ...props,
        ref: forwardRef,
        children: children ?? transcript
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/composer/composer-dictation-transcript.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "413p+Tsi1Hz19q2+vIm1pGBZMdA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
})), "413p+Tsi1Hz19q2+vIm1pGBZMdA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c1 = ComposerPrimitiveDictationTranscript;
ComposerPrimitiveDictationTranscript.displayName = "ComposerPrimitive.DictationTranscript";
var _c, _c1;
__turbopack_context__.k.register(_c, "ComposerPrimitiveDictationTranscript$forwardRef");
__turbopack_context__.k.register(_c1, "ComposerPrimitiveDictationTranscript");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/composer-if.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitiveIf",
    ()=>ComposerPrimitiveIf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const useComposerIf = (props)=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useComposerIf.useAuiState": ({ composer })=>{
            if (props.editing === true && !composer.isEditing) return false;
            if (props.editing === false && composer.isEditing) return false;
            const isDictating = composer.dictation != null;
            if (props.dictation === true && !isDictating) return false;
            if (props.dictation === false && isDictating) return false;
            return true;
        }
    }["useComposerIf.useAuiState"]);
};
_s(useComposerIf, "kbE+C4pk3mcZo+W+dXJ9ArS6lK4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ComposerPrimitiveIf = ({ children, ...query })=>{
    _s1();
    const result = useComposerIf(query);
    return result ? children : null;
};
_s1(ComposerPrimitiveIf, "Fn/Z2P+G7Z9tI4Q6Ds9U9MYm2fo=", false, function() {
    return [
        useComposerIf
    ];
});
_c = ComposerPrimitiveIf;
ComposerPrimitiveIf.displayName = "ComposerPrimitive.If";
var _c;
__turbopack_context__.k.register(_c, "ComposerPrimitiveIf");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/composer/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddAttachment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$add$2d$attachment$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveAddAttachment"],
    "AttachmentByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$attachments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveAttachmentByIndex"],
    "AttachmentDropzone",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$attachment$2d$dropzone$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveAttachmentDropzone"],
    "Attachments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$attachments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveAttachments"],
    "Cancel",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$cancel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveCancel"],
    "Dictate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$dictate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveDictate"],
    "DictationTranscript",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$dictation$2d$transcript$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveDictationTranscript"],
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveIf"],
    "Input",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveInput"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveRoot"],
    "Send",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$send$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveSend"],
    "StopDictation",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$stop$2d$dictation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposerPrimitiveStopDictation"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-root.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$send$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-send.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$cancel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-cancel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$add$2d$attachment$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-add-attachment.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$attachments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-attachments.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$attachment$2d$dropzone$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-attachment-dropzone.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$dictate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-dictate.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$stop$2d$dictation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-stop-dictation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$dictation$2d$transcript$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-dictation-transcript.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$composer$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/composer-if.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/composer/index.ts [app-client] (ecmascript) <export * as ComposerPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ComposerPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$composer$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/composer/index.ts [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/message/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useManagedRef",
    ()=>useManagedRef
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const useManagedRef = (callback)=>{
    _s();
    const cleanupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(undefined);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useManagedRef.useCallback[ref]": (el)=>{
            // Call the previous cleanup function
            if (cleanupRef.current) {
                cleanupRef.current();
            }
            // Call the new callback and store its cleanup function
            if (el) {
                cleanupRef.current = callback(el);
            }
        }
    }["useManagedRef.useCallback[ref]"], [
        callback
    ]);
    return ref;
};
_s(useManagedRef, "Sdqv+d39nkZv2RyB/jkI1i0sM2Q=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/utils/hooks/use-size-handle.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSizeHandle",
    ()=>useSizeHandle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const useSizeHandle = (register, getHeight)=>{
    _s();
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSizeHandle.useCallback[callbackRef]": (el)=>{
            if (!register) return;
            const sizeHandle = register();
            const updateHeight = {
                "useSizeHandle.useCallback[callbackRef].updateHeight": ()=>{
                    const height = getHeight ? getHeight(el) : el.offsetHeight;
                    sizeHandle.setHeight(height);
                }
            }["useSizeHandle.useCallback[callbackRef].updateHeight"];
            const ro = new ResizeObserver(updateHeight);
            ro.observe(el);
            updateHeight();
            return ({
                "useSizeHandle.useCallback[callbackRef]": ()=>{
                    ro.disconnect();
                    sizeHandle.unregister();
                }
            })["useSizeHandle.useCallback[callbackRef]"];
        }
    }["useSizeHandle.useCallback[callbackRef]"], [
        register,
        getHeight
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useManagedRef"])(callbackRef);
};
_s(useSizeHandle, "wVsGfCB457wOhRmtVviYqjN88i4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useManagedRef"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/thread-viewport-slack.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveViewportSlack",
    ()=>ThreadPrimitiveViewportSlack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const SlackNestingContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(false);
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
    _s();
    const shouldApplySlack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ThreadPrimitiveViewportSlack.useAuiState[shouldApplySlack]": // only add slack to the last assistant message following a user message (valid turn)
        ({ thread, message })=>message.isLast && message.role === "assistant" && message.index >= 1 && thread.messages.at(message.index - 1)?.role === "user"
    }["ThreadPrimitiveViewportSlack.useAuiState[shouldApplySlack]"]);
    const threadViewportStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewportStore"])({
        optional: true
    });
    const isNested = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SlackNestingContext);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThreadPrimitiveViewportSlack.useCallback[callback]": (el)=>{
            if (!threadViewportStore || isNested) return;
            const updateMinHeight = {
                "ThreadPrimitiveViewportSlack.useCallback[callback].updateMinHeight": ()=>{
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
                }
            }["ThreadPrimitiveViewportSlack.useCallback[callback].updateMinHeight"];
            updateMinHeight();
            return threadViewportStore.subscribe(updateMinHeight);
        }
    }["ThreadPrimitiveViewportSlack.useCallback[callback]"], [
        threadViewportStore,
        shouldApplySlack,
        isNested,
        fillClampThreshold,
        fillClampOffset
    ]);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useManagedRef"])(callback);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SlackNestingContext.Provider, {
        value: true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"], {
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
_s(ThreadPrimitiveViewportSlack, "HmqBYpZFCU6iJFILROoAdLYtIls=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewportStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useManagedRef"]
    ];
});
_c = ThreadPrimitiveViewportSlack;
ThreadPrimitiveViewportSlack.displayName = "ThreadPrimitive.ViewportSlack";
var _c;
__turbopack_context__.k.register(_c, "ThreadPrimitiveViewportSlack");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message/message-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveRoot",
    ()=>MessagePrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-size-handle.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$slack$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-viewport-slack.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const useIsHoveringRef = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useIsHoveringRef.useAuiState[message]": ()=>aui.message()
    }["useIsHoveringRef.useAuiState[message]"]);
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useIsHoveringRef.useCallback[callbackRef]": (el)=>{
            const handleMouseEnter = {
                "useIsHoveringRef.useCallback[callbackRef].handleMouseEnter": ()=>{
                    message.setIsHovering(true);
                }
            }["useIsHoveringRef.useCallback[callbackRef].handleMouseEnter"];
            const handleMouseLeave = {
                "useIsHoveringRef.useCallback[callbackRef].handleMouseLeave": ()=>{
                    message.setIsHovering(false);
                }
            }["useIsHoveringRef.useCallback[callbackRef].handleMouseLeave"];
            el.addEventListener("mouseenter", handleMouseEnter);
            el.addEventListener("mouseleave", handleMouseLeave);
            if (el.matches(":hover")) {
                // TODO this is needed for SSR to work, figure out why
                queueMicrotask({
                    "useIsHoveringRef.useCallback[callbackRef]": ()=>message.setIsHovering(true)
                }["useIsHoveringRef.useCallback[callbackRef]"]);
            }
            return ({
                "useIsHoveringRef.useCallback[callbackRef]": ()=>{
                    el.removeEventListener("mouseenter", handleMouseEnter);
                    el.removeEventListener("mouseleave", handleMouseLeave);
                    message.setIsHovering(false);
                }
            })["useIsHoveringRef.useCallback[callbackRef]"];
        }
    }["useIsHoveringRef.useCallback[callbackRef]"], [
        message
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useManagedRef"])(callbackRef);
};
_s(useIsHoveringRef, "sM/EyAIP/6tH2qQX5nqN2mV+gtk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useManagedRef"]
    ];
});
/**
 * Hook that registers the anchor user message as a content inset.
 * Only registers if: user message, at index messages.length-2, and last message is assistant.
 */ const useMessageViewportRef = ()=>{
    _s1();
    const turnAnchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"])({
        "useMessageViewportRef.useThreadViewport[turnAnchor]": (s)=>s.turnAnchor
    }["useMessageViewportRef.useThreadViewport[turnAnchor]"]);
    const registerUserHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"])({
        "useMessageViewportRef.useThreadViewport[registerUserHeight]": (s)=>s.registerUserMessageHeight
    }["useMessageViewportRef.useThreadViewport[registerUserHeight]"]);
    // inset rules:
    // - the previous user message before the last assistant message registers its full height
    const shouldRegisterAsInset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useMessageViewportRef.useAuiState[shouldRegisterAsInset]": ({ thread, message })=>turnAnchor === "top" && message.role === "user" && message.index === thread.messages.length - 2 && thread.messages.at(-1)?.role === "assistant"
    }["useMessageViewportRef.useAuiState[shouldRegisterAsInset]"]);
    const getHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMessageViewportRef.useCallback[getHeight]": (el)=>el.offsetHeight
    }["useMessageViewportRef.useCallback[getHeight]"], []);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSizeHandle"])(shouldRegisterAsInset ? registerUserHeight : null, getHeight);
};
_s1(useMessageViewportRef, "5AkW2SSKAKSwAfuVMvnfLfDavq4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSizeHandle"]
    ];
});
const MessagePrimitiveRoot = /*#__PURE__*/ _s2((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s2((props, forwardRef)=>{
    _s2();
    const isHoveringRef = useIsHoveringRef();
    const anchorUserMessageRef = useMessageViewportRef();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardRef, isHoveringRef, anchorUserMessageRef);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$slack$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportSlack"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
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
}, "ZawEwyoKQM+G+HgvkstWTobpTNE=", false, function() {
    return [
        useIsHoveringRef,
        useMessageViewportRef,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"]
    ];
})), "ZawEwyoKQM+G+HgvkstWTobpTNE=", false, function() {
    return [
        useIsHoveringRef,
        useMessageViewportRef,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"]
    ];
});
_c1 = MessagePrimitiveRoot;
MessagePrimitiveRoot.displayName = "MessagePrimitive.Root";
var _c, _c1;
__turbopack_context__.k.register(_c, "MessagePrimitiveRoot$forwardRef");
__turbopack_context__.k.register(_c1, "MessagePrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/providers/part-by-index-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PartByIndexProvider",
    ()=>PartByIndexProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const PartByIndexProvider = ({ index, children })=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])({
        part: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"])({
            source: "message",
            query: {
                type: "index",
                index
            },
            get: {
                "PartByIndexProvider.useAui[aui]": (aui)=>aui.message().part({
                        index
                    })
            }["PartByIndexProvider.useAui[aui]"]
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/part-by-index-provider.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PartByIndexProvider, "BbJ1x+sAPxy/dizeIXhuPkzme6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c = PartByIndexProvider;
var _c;
__turbopack_context__.k.register(_c, "PartByIndexProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/providers/text-message-part-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TextMessagePartProvider",
    ()=>TextMessagePartProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/core/resource.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/tap/src/hooks/tap-memo.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const TextMessagePartClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$core$2f$resource$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resource"])(_c = ({ text, isRunning })=>{
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$tap$2f$src$2f$hooks$2f$tap$2d$memo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tapMemo"])(()=>({
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
_c1 = TextMessagePartClient;
const TextMessagePartProvider = ({ text, isRunning = false, children })=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])({
        part: TextMessagePartClient({
            text,
            isRunning
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/text-message-part-provider.tsx",
        lineNumber: 50,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TextMessagePartProvider, "BbJ1x+sAPxy/dizeIXhuPkzme6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c2 = TextMessagePartProvider;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TextMessagePartClient$resource");
__turbopack_context__.k.register(_c1, "TextMessagePartClient");
__turbopack_context__.k.register(_c2, "TextMessagePartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message-part/use-message-part-text.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMessagePartText",
    ()=>useMessagePartText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const useMessagePartText = ()=>{
    _s();
    const text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useMessagePartText.useAuiState[text]": ({ part })=>{
            if (part.type !== "text" && part.type !== "reasoning") throw new Error("MessagePartText can only be used inside text or reasoning message parts.");
            return part;
        }
    }["useMessagePartText.useAuiState[text]"]);
    return text;
};
_s(useMessagePartText, "ehSFnyemyAOgIIWEIMI0X9Zznqo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/utils/smooth/smooth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.11_@types+react@19.2.10_immer@11.1.3_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$store$2d$hook$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/utils/create-context-store-hook.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const SmoothContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const makeSmoothContext = (initialState)=>{
    const useSmoothStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])(()=>initialState);
    return {
        useSmoothStatus
    };
};
const SmoothContextProvider = ({ children })=>{
    _s();
    const outer = useSmoothContext({
        optional: true
    });
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const [context] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SmoothContextProvider.useState": ()=>makeSmoothContext(aui.part().getState().status)
    }["SmoothContextProvider.useState"]);
    // do not wrap if there is an outer SmoothContextProvider
    if (outer) return children;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SmoothContext.Provider, {
        value: context,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/utils/smooth/smooth-context.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SmoothContextProvider, "779RUAxvjhuWacjrvSZXREZ7aCU=", false, function() {
    return [
        useSmoothContext,
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c = SmoothContextProvider;
const withSmoothContextProvider = (Component)=>{
    const Wrapped = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SmoothContextProvider, {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
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
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SmoothContext);
    if (!options?.optional && !context) throw new Error("This component must be used within a SmoothContextProvider.");
    return context;
}
_s1(useSmoothContext, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const { useSmoothStatus, useSmoothStatusStore } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$utils$2f$create$2d$context$2d$store$2d$hook$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContextStoreHook"])(useSmoothContext, "useSmoothStatus");
var _c;
__turbopack_context__.k.register(_c, "SmoothContextProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/utils/smooth/use-smooth.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSmooth",
    ()=>useSmooth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$smooth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/smooth/smooth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/readonly-store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
    _s();
    const { text } = state;
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useSmooth.useAuiState[id]": ({ message })=>message.id
    }["useSmooth.useAuiState[id]"]);
    const idRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(id);
    const [displayedText, setDisplayedText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(text);
    const smoothStatusStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$smooth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSmoothStatusStore"])({
        optional: true
    });
    const setText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"])({
        "useSmooth.useCallbackRef[setText]": (text)=>{
            setDisplayedText(text);
            if (smoothStatusStore) {
                const target = displayedText !== text || state.status.type === "running" ? SMOOTH_STATUS : state.status;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writableStore"])(smoothStatusStore).setState(target, true);
            }
        }
    }["useSmooth.useCallbackRef[setText]"]);
    // TODO this is hacky
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSmooth.useEffect": ()=>{
            if (smoothStatusStore) {
                const target = smooth && (displayedText !== text || state.status.type === "running") ? SMOOTH_STATUS : state.status;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writableStore"])(smoothStatusStore).setState(target, true);
            }
        }
    }["useSmooth.useEffect"], [
        smoothStatusStore,
        smooth,
        text,
        displayedText,
        state.status
    ]);
    const [animatorRef] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new TextStreamAnimator(text, setText));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSmooth.useEffect": ()=>{
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
        }
    }["useSmooth.useEffect"], [
        setText,
        animatorRef,
        id,
        smooth,
        text
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSmooth.useEffect": ()=>{
            return ({
                "useSmooth.useEffect": ()=>{
                    animatorRef.stop();
                }
            })["useSmooth.useEffect"];
        }
    }["useSmooth.useEffect"], [
        animatorRef
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSmooth.useMemo": ()=>smooth ? {
                type: "text",
                text: displayedText,
                status: text === displayedText ? state.status : SMOOTH_STATUS
            } : state
    }["useSmooth.useMemo"], [
        smooth,
        displayedText,
        state,
        text
    ]);
};
_s(useSmooth, "XjCuhHSFWbFy2tKscE2SaBjlipM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$smooth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSmoothStatusStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message-part/message-part-text.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartPrimitiveText",
    ()=>MessagePartPrimitiveText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$text$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/use-message-part-text.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$use$2d$smooth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/smooth/use-smooth.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const MessagePartPrimitiveText = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ smooth = true, component: Component = "span", ...rest }, forwardedRef)=>{
    _s();
    const { text, status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$use$2d$smooth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSmooth"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$text$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMessagePartText"])(), smooth);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
        "data-status": status.type,
        ...rest,
        ref: forwardedRef,
        children: text
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message-part/message-part-text.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "ULeRGV1CpKbvJ3fIZJMcZE712qE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$use$2d$smooth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSmooth"]
    ];
})), "ULeRGV1CpKbvJ3fIZJMcZE712qE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$smooth$2f$use$2d$smooth$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSmooth"]
    ];
});
_c1 = MessagePartPrimitiveText;
MessagePartPrimitiveText.displayName = "MessagePartPrimitive.Text";
var _c, _c1;
__turbopack_context__.k.register(_c, "MessagePartPrimitiveText$forwardRef");
__turbopack_context__.k.register(_c1, "MessagePartPrimitiveText");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message-part/use-message-part-image.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMessagePartImage",
    ()=>useMessagePartImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const useMessagePartImage = ()=>{
    _s();
    const image = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useMessagePartImage.useAuiState[image]": ({ part })=>{
            if (part.type !== "image") throw new Error("MessagePartImage can only be used inside image message parts.");
            return part;
        }
    }["useMessagePartImage.useAuiState[image]"]);
    return image;
};
_s(useMessagePartImage, "DPgbyySJBnlF2DvXMbf8NTgsngs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message-part/message-part-image.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartPrimitiveImage",
    ()=>MessagePartPrimitiveImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/use-message-part-image.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const MessagePartPrimitiveImage = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s((props, forwardedRef)=>{
    _s();
    const { image } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMessagePartImage"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].img, {
        src: image,
        ...props,
        ref: forwardedRef
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message-part/message-part-image.tsx",
        lineNumber: 36,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
}, "F1xBZ4U9DTZlqs5ZQ8rYwa3J34U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMessagePartImage"]
    ];
})), "F1xBZ4U9DTZlqs5ZQ8rYwa3J34U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$use$2d$message$2d$part$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMessagePartImage"]
    ];
});
_c1 = MessagePartPrimitiveImage;
MessagePartPrimitiveImage.displayName = "MessagePartPrimitive.Image";
var _c, _c1;
__turbopack_context__.k.register(_c, "MessagePartPrimitiveImage$forwardRef");
__turbopack_context__.k.register(_c1, "MessagePartPrimitiveImage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message-part/message-part-in-progress.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePartPrimitiveInProgress",
    ()=>MessagePartPrimitiveInProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const MessagePartPrimitiveInProgress = ({ children })=>{
    _s();
    const isInProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "MessagePartPrimitiveInProgress.useAuiState[isInProgress]": ({ part })=>part.status.type === "running"
    }["MessagePartPrimitiveInProgress.useAuiState[isInProgress]"]);
    return isInProgress ? children : null;
};
_s(MessagePartPrimitiveInProgress, "skB81Mx95YnaXB+5TvWGUP4/ppo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c = MessagePartPrimitiveInProgress;
MessagePartPrimitiveInProgress.displayName = "MessagePartPrimitive.InProgress";
var _c;
__turbopack_context__.k.register(_c, "MessagePartPrimitiveInProgress");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message/message-parts.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitivePartByIndex",
    ()=>MessagePrimitivePartByIndex,
    "MessagePrimitiveParts",
    ()=>MessagePrimitiveParts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$part$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/part-by-index-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$text$2d$message$2d$part$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/text-message-part-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$text$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-text.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-image.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$in$2d$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-in-progress.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@5.0.11_@types+react@19.2.10_immer@11.1.3_react@19.2.4_use-sync-external-store@1.6.0_react@19.2.4_/node_modules/zustand/esm/react/shallow.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
"use client";
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
    _s();
    const messageTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$5$2e$0$2e$11_$40$types$2b$react$40$19$2e$2$2e$10_immer$40$11$2e$1$2e$3_react$40$19$2e$2$2e$4_use$2d$sync$2d$external$2d$store$40$1$2e$6$2e$0_react$40$19$2e$2$2e$4_$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "useMessagePartsGroups.useAuiState[messageTypes]": (s)=>s.message.parts.map({
                "useMessagePartsGroups.useAuiState[messageTypes]": (c)=>c.type
            }["useMessagePartsGroups.useAuiState[messageTypes]"])
    }["useMessagePartsGroups.useAuiState[messageTypes]"]));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useMessagePartsGroups.useMemo": ()=>{
            if (messageTypes.length === 0) {
                return [];
            }
            return groupMessageParts(messageTypes);
        }
    }["useMessagePartsGroups.useMemo"], [
        messageTypes
    ]);
};
_s(useMessagePartsGroups, "VivnjWBw37eZymWwQiXCbaNHoTA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ToolUIDisplay = ({ Fallback, ...props })=>{
    _s1();
    const Render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ToolUIDisplay.useAuiState[Render]": ({ tools })=>{
            const Render = tools.tools[props.toolName] ?? Fallback;
            if (Array.isArray(Render)) return Render[0] ?? Fallback;
            return Render;
        }
    }["ToolUIDisplay.useAuiState[Render]"]);
    if (!Render) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Render, {
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
        lineNumber: 271,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(ToolUIDisplay, "kbXDCVZgI7uenmsWLyg2XgaAsQo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c = ToolUIDisplay;
const defaultComponents = {
    Text: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            style: {
                whiteSpace: "pre-line"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$text$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePartPrimitiveText"], {}, void 0, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                    lineNumber: 277,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$in$2d$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePartPrimitiveInProgress"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    Image: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePartPrimitiveImage"], {}, void 0, false, {
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
    _s2();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const part = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "MessagePartComponent.useAuiState[part]": ({ part })=>part
    }["MessagePartComponent.useAuiState[part]"]);
    const type = part.type;
    if (type === "tool-call") {
        const addResult = aui.part().addToolResult;
        const resume = aui.part().resumeToolCall;
        if ("Override" in tools) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(tools.Override, {
            ...part,
            addResult: addResult,
            resume: resume
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
            lineNumber: 315,
            columnNumber: 14
        }, ("TURBOPACK compile-time value", void 0));
        const Tool = tools.by_name?.[part.toolName] ?? tools.Fallback;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolUIDisplay, {
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 332,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "reasoning":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Reasoning, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 335,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "source":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Source, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 338,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "image":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Image, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 341,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "file":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(File, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                lineNumber: 344,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "audio":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Audio, {
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
_s2(MessagePartComponent, "wqPatTibHnMotl+BcLfxneq+3HQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c1 = MessagePartComponent;
const MessagePrimitivePartByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$part$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PartByIndexProvider"], {
        index: index,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePartComponent, {
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
_c2 = MessagePrimitivePartByIndex;
MessagePrimitivePartByIndex.displayName = "MessagePrimitive.PartByIndex";
const EmptyPartFallback = ({ status, component: Component })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$text$2d$message$2d$part$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextMessagePartProvider"], {
        text: "",
        isRunning: status.type === "running",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
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
_c3 = EmptyPartFallback;
const COMPLETE_STATUS = Object.freeze({
    type: "complete"
});
const EmptyPartsImpl = ({ components })=>{
    _s3();
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "EmptyPartsImpl.useAuiState[status]": (s)=>s.message.status ?? COMPLETE_STATUS
    }["EmptyPartsImpl.useAuiState[status]"]);
    if (components?.Empty) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(components.Empty, {
        status: status
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
        lineNumber: 426,
        columnNumber: 33
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyPartFallback, {
        status: status,
        component: components?.Text ?? defaultComponents.Text
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
        lineNumber: 429,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s3(EmptyPartsImpl, "fPuRTQARIBC7hD/XxxJnXBjxeko=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c4 = EmptyPartsImpl;
const EmptyParts = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(EmptyPartsImpl, (prev, next)=>prev.components?.Empty === next.components?.Empty && prev.components?.Text === next.components?.Text);
_c5 = EmptyParts;
const ConditionalEmptyImpl = ({ components, enabled })=>{
    _s4();
    const shouldShowEmpty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ConditionalEmptyImpl.useAuiState[shouldShowEmpty]": ({ message })=>{
            if (!enabled) return false;
            if (message.parts.length === 0) return false;
            const lastPart = message.parts[message.parts.length - 1];
            return lastPart?.type !== "text" && lastPart?.type !== "reasoning";
        }
    }["ConditionalEmptyImpl.useAuiState[shouldShowEmpty]"]);
    if (!shouldShowEmpty) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyParts, {
        components: components
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
        lineNumber: 456,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s4(ConditionalEmptyImpl, "dkWw5shP+6LrCrAOninZkYUvnmw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c6 = ConditionalEmptyImpl;
const ConditionalEmpty = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(ConditionalEmptyImpl, (prev, next)=>prev.enabled === next.enabled && prev.components?.Empty === next.components?.Empty && prev.components?.Text === next.components?.Text);
_c7 = ConditionalEmpty;
const MessagePrimitiveParts = ({ components, unstable_showEmptyOnNonTextEnd = true })=>{
    _s5();
    const contentLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "MessagePrimitiveParts.useAuiState[contentLength]": ({ message })=>message.parts.length
    }["MessagePrimitiveParts.useAuiState[contentLength]"]);
    const messageRanges = useMessagePartsGroups();
    const partsElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MessagePrimitiveParts.useMemo[partsElements]": ()=>{
            if (contentLength === 0) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyParts, {
                    components: components
                }, void 0, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                    lineNumber: 500,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            }
            return messageRanges.map({
                "MessagePrimitiveParts.useMemo[partsElements]": (range)=>{
                    if (range.type === "single") {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePrimitivePartByIndex, {
                            index: range.index,
                            components: components
                        }, range.index, false, {
                            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                            lineNumber: 506,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0));
                    } else if (range.type === "toolGroup") {
                        const ToolGroupComponent = components?.ToolGroup ?? defaultComponents.ToolGroup;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolGroupComponent, {
                            startIndex: range.startIndex,
                            endIndex: range.endIndex,
                            children: Array.from({
                                length: range.endIndex - range.startIndex + 1
                            }, {
                                "MessagePrimitiveParts.useMemo[partsElements]": (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePrimitivePartByIndex, {
                                        index: range.startIndex + i,
                                        components: components
                                    }, i, false, {
                                        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                                        lineNumber: 524,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                            }["MessagePrimitiveParts.useMemo[partsElements]"])
                        }, `tool-${range.startIndex}`, false, {
                            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                            lineNumber: 516,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0));
                    } else {
                        // reasoningGroup
                        const ReasoningGroupComponent = components?.ReasoningGroup ?? defaultComponents.ReasoningGroup;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReasoningGroupComponent, {
                            startIndex: range.startIndex,
                            endIndex: range.endIndex,
                            children: Array.from({
                                length: range.endIndex - range.startIndex + 1
                            }, {
                                "MessagePrimitiveParts.useMemo[partsElements]": (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePrimitivePartByIndex, {
                                        index: range.startIndex + i,
                                        components: components
                                    }, i, false, {
                                        fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                                        lineNumber: 546,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                            }["MessagePrimitiveParts.useMemo[partsElements]"])
                        }, `reasoning-${range.startIndex}`, false, {
                            fileName: "[project]/packages/react/src/primitives/message/message-parts.tsx",
                            lineNumber: 538,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0));
                    }
                }
            }["MessagePrimitiveParts.useMemo[partsElements]"]);
        }
    }["MessagePrimitiveParts.useMemo[partsElements]"], [
        messageRanges,
        components,
        contentLength
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            partsElements,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConditionalEmpty, {
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
_s5(MessagePrimitiveParts, "9cr/QOc05pmblsIE4YGjrrDpmiY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        useMessagePartsGroups
    ];
});
_c8 = MessagePrimitiveParts;
MessagePrimitiveParts.displayName = "MessagePrimitive.Parts";
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "ToolUIDisplay");
__turbopack_context__.k.register(_c1, "MessagePartComponent");
__turbopack_context__.k.register(_c2, "MessagePrimitivePartByIndex");
__turbopack_context__.k.register(_c3, "EmptyPartFallback");
__turbopack_context__.k.register(_c4, "EmptyPartsImpl");
__turbopack_context__.k.register(_c5, "EmptyParts");
__turbopack_context__.k.register(_c6, "ConditionalEmptyImpl");
__turbopack_context__.k.register(_c7, "ConditionalEmpty");
__turbopack_context__.k.register(_c8, "MessagePrimitiveParts");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message/message-if.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveIf",
    ()=>MessagePrimitiveIf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const useMessageIf = (props)=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useMessageIf.useAuiState": ({ message })=>{
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
        }
    }["useMessageIf.useAuiState"]);
};
_s(useMessageIf, "kbE+C4pk3mcZo+W+dXJ9ArS6lK4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const MessagePrimitiveIf = ({ children, ...query })=>{
    _s1();
    const result = useMessageIf(query);
    return result ? children : null;
};
_s1(MessagePrimitiveIf, "/5ravk1Os1Cne2DltAgKDLYmME4=", false, function() {
    return [
        useMessageIf
    ];
});
_c = MessagePrimitiveIf;
MessagePrimitiveIf.displayName = "MessagePrimitive.If";
var _c;
__turbopack_context__.k.register(_c, "MessagePrimitiveIf");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message/message-attachments.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveAttachmentByIndex",
    ()=>MessagePrimitiveAttachmentByIndex,
    "MessagePrimitiveAttachments",
    ()=>MessagePrimitiveAttachments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$attachment$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/attachment-by-index-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
    _s();
    const attachment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "AttachmentComponent.useAuiState[attachment]": ({ attachment })=>attachment
    }["AttachmentComponent.useAuiState[attachment]"]);
    if (!attachment) return null;
    const Component = getComponent(components, attachment);
    if (!Component) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {}, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-attachments.tsx",
        lineNumber: 47,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AttachmentComponent, "wEND96foQ/721yWVG3ZDsS+35/w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c = AttachmentComponent;
const MessagePrimitiveAttachmentByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$attachment$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageAttachmentByIndexProvider"], {
        index: index,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AttachmentComponent, {
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
_c1 = MessagePrimitiveAttachmentByIndex;
MessagePrimitiveAttachmentByIndex.displayName = "MessagePrimitive.AttachmentByIndex";
const MessagePrimitiveAttachments = ({ components })=>{
    _s1();
    const attachmentsCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "MessagePrimitiveAttachments.useAuiState[attachmentsCount]": ({ message })=>{
            if (message.role !== "user") return 0;
            return message.attachments.length;
        }
    }["MessagePrimitiveAttachments.useAuiState[attachmentsCount]"]);
    const attachmentElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MessagePrimitiveAttachments.useMemo[attachmentElements]": ()=>{
            return Array.from({
                length: attachmentsCount
            }, {
                "MessagePrimitiveAttachments.useMemo[attachmentElements]": (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePrimitiveAttachmentByIndex, {
                        index: index,
                        components: components
                    }, index, false, {
                        fileName: "[project]/packages/react/src/primitives/message/message-attachments.tsx",
                        lineNumber: 104,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
            }["MessagePrimitiveAttachments.useMemo[attachmentElements]"]);
        }
    }["MessagePrimitiveAttachments.useMemo[attachmentElements]"], [
        attachmentsCount,
        components
    ]);
    return attachmentElements;
};
_s1(MessagePrimitiveAttachments, "GB8kdy5mygX7OH5aUVDsCct9Zdk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c2 = MessagePrimitiveAttachments;
MessagePrimitiveAttachments.displayName = "MessagePrimitive.Attachments";
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AttachmentComponent");
__turbopack_context__.k.register(_c1, "MessagePrimitiveAttachmentByIndex");
__turbopack_context__.k.register(_c2, "MessagePrimitiveAttachments");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message/message-error.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveError",
    ()=>MessagePrimitiveError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const MessagePrimitiveError = ({ children })=>{
    _s();
    const hasError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "MessagePrimitiveError.useAuiState[hasError]": ({ message })=>message.status?.type === "incomplete" && message.status.reason === "error"
    }["MessagePrimitiveError.useAuiState[hasError]"]);
    return hasError ? children : null;
};
_s(MessagePrimitiveError, "QM5517p4hGLrjIelQs+oZDrLdv4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c = MessagePrimitiveError;
MessagePrimitiveError.displayName = "MessagePrimitive.Error";
var _c;
__turbopack_context__.k.register(_c, "MessagePrimitiveError");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message/message-parts-grouped.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitiveUnstable_PartsGrouped",
    ()=>MessagePrimitiveUnstable_PartsGrouped,
    "MessagePrimitiveUnstable_PartsGroupedByParentId",
    ()=>MessagePrimitiveUnstable_PartsGroupedByParentId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$part$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/part-by-index-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$text$2d$message$2d$part$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/text-message-part-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$text$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-text.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-image.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$in$2d$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message-part/message-part-in-progress.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
"use client";
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
    _s();
    const parts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useMessagePartsGrouped.useAuiState[parts]": ({ message })=>message.parts
    }["useMessagePartsGrouped.useAuiState[parts]"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useMessagePartsGrouped.useMemo": ()=>{
            if (parts.length === 0) {
                return [];
            }
            return groupingFunction(parts);
        }
    }["useMessagePartsGrouped.useMemo"], [
        parts,
        groupingFunction
    ]);
};
_s(useMessagePartsGrouped, "BI8x2iAXUIq+BVJ2HPgQbv7RxLs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ToolUIDisplay = ({ Fallback, ...props })=>{
    _s1();
    const Render = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ToolUIDisplay.useAuiState[Render]": ({ tools })=>{
            const Render = tools.tools[props.toolName] ?? Fallback;
            if (Array.isArray(Render)) return Render[0] ?? Fallback;
            return Render;
        }
    }["ToolUIDisplay.useAuiState[Render]"]);
    if (!Render) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Render, {
        ...props
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
        lineNumber: 228,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(ToolUIDisplay, "kbXDCVZgI7uenmsWLyg2XgaAsQo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c = ToolUIDisplay;
const defaultComponents = {
    Text: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            style: {
                whiteSpace: "pre-line"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$text$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePartPrimitiveText"], {}, void 0, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                    lineNumber: 234,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$in$2d$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePartPrimitiveInProgress"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    Image: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2d$part$2f$message$2d$part$2d$image$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePartPrimitiveImage"], {}, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
            lineNumber: 242,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
    File: ()=>null,
    Unstable_Audio: ()=>null,
    Group: ({ children })=>children
};
const MessagePartComponent = ({ components: { Text = defaultComponents.Text, Reasoning = defaultComponents.Reasoning, Image = defaultComponents.Image, Source = defaultComponents.Source, File = defaultComponents.File, Unstable_Audio: Audio = defaultComponents.Unstable_Audio, tools = {} } = {} })=>{
    _s2();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const part = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "MessagePartComponent.useAuiState[part]": ({ part })=>part
    }["MessagePartComponent.useAuiState[part]"]);
    const type = part.type;
    if (type === "tool-call") {
        const addResult = aui.part().addToolResult;
        const resume = aui.part().resumeToolCall;
        if ("Override" in tools) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(tools.Override, {
            ...part,
            addResult: addResult,
            resume: resume
        }, void 0, false, {
            fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
            lineNumber: 271,
            columnNumber: 14
        }, ("TURBOPACK compile-time value", void 0));
        const Tool = tools.by_name?.[part.toolName] ?? tools.Fallback;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolUIDisplay, {
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Text, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 288,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "reasoning":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Reasoning, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 291,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "source":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Source, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 294,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "image":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Image, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 297,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "file":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(File, {
                ...part
            }, void 0, false, {
                fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                lineNumber: 300,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        case "audio":
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Audio, {
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
_s2(MessagePartComponent, "wqPatTibHnMotl+BcLfxneq+3HQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c1 = MessagePartComponent;
const MessagePartImpl = ({ partIndex, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$part$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PartByIndexProvider"], {
        index: partIndex,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePartComponent, {
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
_c2 = MessagePartImpl;
const MessagePart = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(MessagePartImpl, (prev, next)=>prev.partIndex === next.partIndex && prev.components?.Text === next.components?.Text && prev.components?.Reasoning === next.components?.Reasoning && prev.components?.Source === next.components?.Source && prev.components?.Image === next.components?.Image && prev.components?.File === next.components?.File && prev.components?.Unstable_Audio === next.components?.Unstable_Audio && prev.components?.tools === next.components?.tools && prev.components?.Group === next.components?.Group);
_c3 = MessagePart;
const EmptyPartFallback = ({ status, component: Component })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$text$2d$message$2d$part$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TextMessagePartProvider"], {
        text: "",
        isRunning: status.type === "running",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
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
_c4 = EmptyPartFallback;
const COMPLETE_STATUS = Object.freeze({
    type: "complete"
});
const EmptyPartsImpl = ({ components })=>{
    _s3();
    const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "EmptyPartsImpl.useAuiState[status]": (s)=>s.message.status ?? COMPLETE_STATUS
    }["EmptyPartsImpl.useAuiState[status]"]);
    if (components?.Empty) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(components.Empty, {
        status: status
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
        lineNumber: 361,
        columnNumber: 33
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyPartFallback, {
        status: status,
        component: components?.Text ?? defaultComponents.Text
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
        lineNumber: 364,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s3(EmptyPartsImpl, "fPuRTQARIBC7hD/XxxJnXBjxeko=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c5 = EmptyPartsImpl;
const EmptyParts = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(EmptyPartsImpl, (prev, next)=>prev.components?.Empty === next.components?.Empty && prev.components?.Text === next.components?.Text);
_c6 = EmptyParts;
const MessagePrimitiveUnstable_PartsGrouped = ({ groupingFunction, components })=>{
    _s4();
    const contentLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "MessagePrimitiveUnstable_PartsGrouped.useAuiState[contentLength]": ({ message })=>message.parts.length
    }["MessagePrimitiveUnstable_PartsGrouped.useAuiState[contentLength]"]);
    const messageGroups = useMessagePartsGrouped(groupingFunction);
    const partsElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MessagePrimitiveUnstable_PartsGrouped.useMemo[partsElements]": ()=>{
            if (contentLength === 0) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyParts, {
                    components: components
                }, void 0, false, {
                    fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                    lineNumber: 434,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            }
            return messageGroups.map({
                "MessagePrimitiveUnstable_PartsGrouped.useMemo[partsElements]": (group, groupIndex)=>{
                    const GroupComponent = components?.Group ?? defaultComponents.Group;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GroupComponent, {
                        groupKey: group.groupKey,
                        indices: group.indices,
                        children: group.indices.map({
                            "MessagePrimitiveUnstable_PartsGrouped.useMemo[partsElements]": (partIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePart, {
                                    partIndex: partIndex,
                                    components: components
                                }, partIndex, false, {
                                    fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                                    lineNumber: 447,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                        }["MessagePrimitiveUnstable_PartsGrouped.useMemo[partsElements]"])
                    }, `group-${groupIndex}-${group.groupKey ?? "ungrouped"}`, false, {
                        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
                        lineNumber: 441,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0));
                }
            }["MessagePrimitiveUnstable_PartsGrouped.useMemo[partsElements]"]);
        }
    }["MessagePrimitiveUnstable_PartsGrouped.useMemo[partsElements]"], [
        messageGroups,
        components,
        contentLength
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: partsElements
    }, void 0, false);
};
_s4(MessagePrimitiveUnstable_PartsGrouped, "dggOQwQYwh6f+OXImGhBNOMG4hY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        useMessagePartsGrouped
    ];
});
_c7 = MessagePrimitiveUnstable_PartsGrouped;
MessagePrimitiveUnstable_PartsGrouped.displayName = "MessagePrimitive.Unstable_PartsGrouped";
const MessagePrimitiveUnstable_PartsGroupedByParentId = ({ components, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessagePrimitiveUnstable_PartsGrouped, {
        ...props,
        components: components,
        groupingFunction: groupMessagePartsByParentId
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/message/message-parts-grouped.tsx",
        lineNumber: 474,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c8 = MessagePrimitiveUnstable_PartsGroupedByParentId;
MessagePrimitiveUnstable_PartsGroupedByParentId.displayName = "MessagePrimitive.Unstable_PartsGroupedByParentId";
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "ToolUIDisplay");
__turbopack_context__.k.register(_c1, "MessagePartComponent");
__turbopack_context__.k.register(_c2, "MessagePartImpl");
__turbopack_context__.k.register(_c3, "MessagePart");
__turbopack_context__.k.register(_c4, "EmptyPartFallback");
__turbopack_context__.k.register(_c5, "EmptyPartsImpl");
__turbopack_context__.k.register(_c6, "EmptyParts");
__turbopack_context__.k.register(_c7, "MessagePrimitiveUnstable_PartsGrouped");
__turbopack_context__.k.register(_c8, "MessagePrimitiveUnstable_PartsGroupedByParentId");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AttachmentByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$attachments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitiveAttachmentByIndex"],
    "Attachments",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$attachments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitiveAttachments"],
    "Content",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitiveParts"],
    "Error",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitiveError"],
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitiveIf"],
    "PartByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitivePartByIndex"],
    "Parts",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitiveParts"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitiveRoot"],
    "Unstable_PartsGrouped",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2d$grouped$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitiveUnstable_PartsGrouped"],
    "Unstable_PartsGroupedByParentId",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2d$grouped$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitiveUnstable_PartsGroupedByParentId"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-root.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-parts.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-if.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$attachments$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-attachments.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$error$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-error.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$parts$2d$grouped$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-parts-grouped.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/message/index.ts [app-client] (ecmascript) <export * as MessagePrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagePrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/index.ts [app-client] (ecmascript)");
}),
"[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript) <export useAuiState as useAssistantState>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAssistantState",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
}),
"[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript) <export useAui as useAssistantApi>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAssistantApi",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/reasoning/use-scroll-lock.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useScrollLock",
    ()=>useScrollLock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const useScrollLock = (animatedElementRef, animationDuration)=>{
    _s();
    const scrollContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cleanupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useScrollLock.useEffect": ()=>{
            return ({
                "useScrollLock.useEffect": ()=>{
                    cleanupRef.current?.();
                }
            })["useScrollLock.useEffect"];
        }
    }["useScrollLock.useEffect"], []);
    const lockScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useScrollLock.useCallback[lockScroll]": ()=>{
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
            const resetPosition = {
                "useScrollLock.useCallback[lockScroll].resetPosition": ()=>scrollContainer.scrollTop = scrollPosition
            }["useScrollLock.useCallback[lockScroll].resetPosition"];
            scrollContainer.addEventListener("scroll", resetPosition);
            const timeoutId = setTimeout({
                "useScrollLock.useCallback[lockScroll].timeoutId": ()=>{
                    scrollContainer.removeEventListener("scroll", resetPosition);
                    scrollContainer.style.scrollbarWidth = scrollbarWidth;
                    cleanupRef.current = null;
                }
            }["useScrollLock.useCallback[lockScroll].timeoutId"], animationDuration);
            cleanupRef.current = ({
                "useScrollLock.useCallback[lockScroll]": ()=>{
                    clearTimeout(timeoutId);
                    scrollContainer.removeEventListener("scroll", resetPosition);
                    scrollContainer.style.scrollbarWidth = scrollbarWidth;
                }
            })["useScrollLock.useCallback[lockScroll]"];
        }
    }["useScrollLock.useCallback[lockScroll]"], [
        animationDuration,
        animatedElementRef
    ]);
    return lockScroll;
};
_s(useScrollLock, "MPuFBDUWyTRxzkDGD1crn4gWzec=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar-more/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDropdownMenuScope",
    ()=>useDropdownMenuScope
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
;
const useDropdownMenuScope = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDropdownMenuScope"]();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar-more/action-bar-more-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitiveRoot",
    ()=>ActionBarMorePrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const ActionBarMorePrimitiveRoot = ({ __scopeActionBarMore, ...rest })=>{
    _s();
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeActionBarMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ...scope,
        ...rest
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar-more/action-bar-more-root.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ActionBarMorePrimitiveRoot, "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
});
_c = ActionBarMorePrimitiveRoot;
ActionBarMorePrimitiveRoot.displayName = "ActionBarMorePrimitive.Root";
var _c;
__turbopack_context__.k.register(_c, "ActionBarMorePrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar-more/action-bar-more-trigger.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitiveTrigger",
    ()=>ActionBarMorePrimitiveTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ActionBarMorePrimitiveTrigger = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ __scopeActionBarMore, ...rest }, ref)=>{
    _s();
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeActionBarMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar-more/action-bar-more-trigger.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
}, "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
})), "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
});
_c1 = ActionBarMorePrimitiveTrigger;
ActionBarMorePrimitiveTrigger.displayName = "ActionBarMorePrimitive.Trigger";
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBarMorePrimitiveTrigger$forwardRef");
__turbopack_context__.k.register(_c1, "ActionBarMorePrimitiveTrigger");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar-more/action-bar-more-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitiveContent",
    ()=>ActionBarMorePrimitiveContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ActionBarMorePrimitiveContent = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ __scopeActionBarMore, portalProps, sideOffset = 4, ...props }, forwardedRef)=>{
    _s();
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeActionBarMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        ...scope,
        ...portalProps,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
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
}, "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
})), "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
});
_c1 = ActionBarMorePrimitiveContent;
ActionBarMorePrimitiveContent.displayName = "ActionBarMorePrimitive.Content";
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBarMorePrimitiveContent$forwardRef");
__turbopack_context__.k.register(_c1, "ActionBarMorePrimitiveContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar-more/action-bar-more-item.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitiveItem",
    ()=>ActionBarMorePrimitiveItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ActionBarMorePrimitiveItem = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ __scopeActionBarMore, ...rest }, ref)=>{
    _s();
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeActionBarMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar-more/action-bar-more-item.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
}, "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
})), "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
});
_c1 = ActionBarMorePrimitiveItem;
ActionBarMorePrimitiveItem.displayName = "ActionBarMorePrimitive.Item";
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBarMorePrimitiveItem$forwardRef");
__turbopack_context__.k.register(_c1, "ActionBarMorePrimitiveItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar-more/action-bar-more-separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitiveSeparator",
    ()=>ActionBarMorePrimitiveSeparator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/scope.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ActionBarMorePrimitiveSeparator = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ __scopeActionBarMore, ...rest }, ref)=>{
    _s();
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeActionBarMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar-more/action-bar-more-separator.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
}, "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
})), "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
});
_c1 = ActionBarMorePrimitiveSeparator;
ActionBarMorePrimitiveSeparator.displayName = "ActionBarMorePrimitive.Separator";
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBarMorePrimitiveSeparator$forwardRef");
__turbopack_context__.k.register(_c1, "ActionBarMorePrimitiveSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar-more/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Content",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarMorePrimitiveContent"],
    "Item",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$item$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarMorePrimitiveItem"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarMorePrimitiveRoot"],
    "Separator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarMorePrimitiveSeparator"],
    "Trigger",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$trigger$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarMorePrimitiveTrigger"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/action-bar-more-root.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$trigger$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/action-bar-more-trigger.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/action-bar-more-content.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$item$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/action-bar-more-item.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$action$2d$bar$2d$more$2d$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/action-bar-more-separator.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/action-bar-more/index.ts [app-client] (ecmascript) <export * as ActionBarMorePrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarMorePrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2d$more$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar-more/index.ts [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/action-bar/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/use-action-bar-float-status.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HideAndFloatStatus",
    ()=>HideAndFloatStatus,
    "useActionBarFloatStatus",
    ()=>useActionBarFloatStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
var HideAndFloatStatus = /*#__PURE__*/ function(HideAndFloatStatus) {
    HideAndFloatStatus["Hidden"] = "hidden";
    HideAndFloatStatus["Floating"] = "floating";
    HideAndFloatStatus["Normal"] = "normal";
    return HideAndFloatStatus;
}({});
const useActionBarFloatStatus = ({ hideWhenRunning, autohide, autohideFloat })=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useActionBarFloatStatus.useAuiState": ({ thread, message })=>{
            if (hideWhenRunning && thread.isRunning) return "hidden";
            const autohideEnabled = autohide === "always" || autohide === "not-last" && !message.isLast;
            // normal status
            if (!autohideEnabled) return "normal";
            // hidden status
            if (!message.isHovering) return "hidden";
            // floating status
            if (autohideFloat === "always" || autohideFloat === "single-branch" && message.branchCount <= 1) return "floating";
            return "normal";
        }
    }["useActionBarFloatStatus.useAuiState"]);
};
_s(useActionBarFloatStatus, "kbE+C4pk3mcZo+W+dXJ9ArS6lK4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveRoot",
    ()=>ActionBarPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$use$2d$action$2d$bar$2d$float$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/use-action-bar-float-status.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ActionBarPrimitiveRoot = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ hideWhenRunning, autohide, autohideFloat, ...rest }, ref)=>{
    _s();
    const hideAndfloatStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$use$2d$action$2d$bar$2d$float$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionBarFloatStatus"])({
        hideWhenRunning,
        autohide,
        autohideFloat
    });
    if (hideAndfloatStatus === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$use$2d$action$2d$bar$2d$float$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HideAndFloatStatus"].Hidden) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...hideAndfloatStatus === __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$use$2d$action$2d$bar$2d$float$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HideAndFloatStatus"].Floating ? {
            "data-floating": "true"
        } : null,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-root.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "0/0BcKxFr0XAkKHpLnLsVaGDyyQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$use$2d$action$2d$bar$2d$float$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionBarFloatStatus"]
    ];
})), "0/0BcKxFr0XAkKHpLnLsVaGDyyQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$use$2d$action$2d$bar$2d$float$2d$status$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useActionBarFloatStatus"]
    ];
});
_c1 = ActionBarPrimitiveRoot;
ActionBarPrimitiveRoot.displayName = "ActionBarPrimitive.Root";
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBarPrimitiveRoot$forwardRef");
__turbopack_context__.k.register(_c1, "ActionBarPrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-copy.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveCopy",
    ()=>ActionBarPrimitiveCopy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const hasCopyableContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useActionBarPrimitiveCopy.useAuiState[hasCopyableContent]": ({ message })=>{
            return (message.role !== "assistant" || message.status?.type !== "running") && message.parts.some({
                "useActionBarPrimitiveCopy.useAuiState[hasCopyableContent]": (c)=>c.type === "text" && c.text.length > 0
            }["useActionBarPrimitiveCopy.useAuiState[hasCopyableContent]"]);
        }
    }["useActionBarPrimitiveCopy.useAuiState[hasCopyableContent]"]);
    const isEditing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useActionBarPrimitiveCopy.useAuiState[isEditing]": ({ composer })=>composer.isEditing
    }["useActionBarPrimitiveCopy.useAuiState[isEditing]"]);
    const composerValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useActionBarPrimitiveCopy.useAuiState[composerValue]": ({ composer })=>composer.text
    }["useActionBarPrimitiveCopy.useAuiState[composerValue]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActionBarPrimitiveCopy.useCallback[callback]": ()=>{
            const valueToCopy = isEditing ? composerValue : aui.message().getCopyText();
            if (!valueToCopy) return;
            navigator.clipboard.writeText(valueToCopy).then({
                "useActionBarPrimitiveCopy.useCallback[callback]": ()=>{
                    aui.message().setIsCopied(true);
                    setTimeout({
                        "useActionBarPrimitiveCopy.useCallback[callback]": ()=>aui.message().setIsCopied(false)
                    }["useActionBarPrimitiveCopy.useCallback[callback]"], copiedDuration);
                }
            }["useActionBarPrimitiveCopy.useCallback[callback]"]);
        }
    }["useActionBarPrimitiveCopy.useCallback[callback]"], [
        aui,
        isEditing,
        composerValue,
        copiedDuration
    ]);
    if (!hasCopyableContent) return null;
    return callback;
};
_s(useActionBarPrimitiveCopy, "JOkMB51jnt6rLHTBVVoEJVyJT50=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ActionBarPrimitiveCopy = /*#__PURE__*/ _s1((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s1(({ copiedDuration, onClick, disabled, ...props }, forwardedRef)=>{
    _s1();
    const isCopied = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ActionBarPrimitiveCopy.useAuiState[isCopied]": ({ message })=>message.isCopied
    }["ActionBarPrimitiveCopy.useAuiState[isCopied]"]);
    const callback = useActionBarPrimitiveCopy({
        copiedDuration
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isCopied ? {
            "data-copied": "true"
        } : {},
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-copy.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "NOBWJvjv29S24CyVne6GFb6kDZY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        useActionBarPrimitiveCopy
    ];
})), "NOBWJvjv29S24CyVne6GFb6kDZY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        useActionBarPrimitiveCopy
    ];
});
_c1 = ActionBarPrimitiveCopy;
ActionBarPrimitiveCopy.displayName = "ActionBarPrimitive.Copy";
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBarPrimitiveCopy$forwardRef");
__turbopack_context__.k.register(_c1, "ActionBarPrimitiveCopy");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-reload.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveReload",
    ()=>ActionBarPrimitiveReload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useActionBarReload.useAuiState[disabled]": (s)=>s.thread.isRunning || s.thread.isDisabled || s.message.role !== "assistant"
    }["useActionBarReload.useAuiState[disabled]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActionBarReload.useCallback[callback]": ()=>{
            aui.message().reload();
        }
    }["useActionBarReload.useCallback[callback]"], [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
_s(useActionBarReload, "dwEAQvB3pQRhQ0UWtrspbZhyjhU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ActionBarPrimitiveReload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ActionBarPrimitive.Reload", useActionBarReload);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-edit.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveEdit",
    ()=>ActionBarPrimitiveEdit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useActionBarEdit.useAuiState[disabled]": ({ composer })=>composer.isEditing
    }["useActionBarEdit.useAuiState[disabled]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActionBarEdit.useCallback[callback]": ()=>{
            aui.composer().beginEdit();
        }
    }["useActionBarEdit.useCallback[callback]"], [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
_s(useActionBarEdit, "dwEAQvB3pQRhQ0UWtrspbZhyjhU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ActionBarPrimitiveEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ActionBarPrimitive.Edit", useActionBarEdit);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-speak.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveSpeak",
    ()=>ActionBarPrimitiveSpeak
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useActionBarSpeak = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActionBarSpeak.useCallback[callback]": async ()=>{
            aui.message().speak();
        }
    }["useActionBarSpeak.useCallback[callback]"], [
        aui
    ]);
    const hasSpeakableContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useActionBarSpeak.useAuiState[hasSpeakableContent]": ({ message })=>{
            return (message.role !== "assistant" || message.status?.type !== "running") && message.parts.some({
                "useActionBarSpeak.useAuiState[hasSpeakableContent]": (c)=>c.type === "text" && c.text.length > 0
            }["useActionBarSpeak.useAuiState[hasSpeakableContent]"]);
        }
    }["useActionBarSpeak.useAuiState[hasSpeakableContent]"]);
    if (!hasSpeakableContent) return null;
    return callback;
};
_s(useActionBarSpeak, "V9xi/VVLP0JnduInd0nK4VjRpg0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ActionBarPrimitiveSpeak = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ActionBarPrimitive.Speak", useActionBarSpeak);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-stop-speaking.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveStopSpeaking",
    ()=>ActionBarPrimitiveStopSpeaking
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-escape-keydown@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-escape-keydown/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const useActionBarStopSpeaking = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const isSpeaking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useActionBarStopSpeaking.useAuiState[isSpeaking]": ({ message })=>message.speech != null
    }["useActionBarStopSpeaking.useAuiState[isSpeaking]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActionBarStopSpeaking.useCallback[callback]": ()=>{
            aui.message().stopSpeaking();
        }
    }["useActionBarStopSpeaking.useCallback[callback]"], [
        aui
    ]);
    if (!isSpeaking) return null;
    return callback;
};
_s(useActionBarStopSpeaking, "5Z1RfjfUNXLfO2srthyKeTC6rKc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ActionBarPrimitiveStopSpeaking = /*#__PURE__*/ _s1((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s1((props, ref)=>{
    _s1();
    const callback = useActionBarStopSpeaking();
    // TODO this stops working if the user is not hovering over an older message
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKeydown"])({
        "ActionBarPrimitiveStopSpeaking.useEscapeKeydown": (e)=>{
            if (callback) {
                e.preventDefault();
                callback();
            }
        }
    }["ActionBarPrimitiveStopSpeaking.useEscapeKeydown"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        disabled: !callback,
        ...props,
        ref: ref,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(props.onClick, ()=>{
            callback?.();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-stop-speaking.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "YLth4BhInIcuYt1AHDZUVshtehA=", false, function() {
    return [
        useActionBarStopSpeaking,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKeydown"]
    ];
})), "YLth4BhInIcuYt1AHDZUVshtehA=", false, function() {
    return [
        useActionBarStopSpeaking,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$escape$2d$keydown$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$escape$2d$keydown$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEscapeKeydown"]
    ];
});
_c1 = ActionBarPrimitiveStopSpeaking;
ActionBarPrimitiveStopSpeaking.displayName = "ActionBarPrimitive.StopSpeaking";
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBarPrimitiveStopSpeaking$forwardRef");
__turbopack_context__.k.register(_c1, "ActionBarPrimitiveStopSpeaking");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-feedback-positive.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveFeedbackPositive",
    ()=>ActionBarPrimitiveFeedbackPositive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const useActionBarFeedbackPositive = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActionBarFeedbackPositive.useCallback[callback]": ()=>{
            aui.message().submitFeedback({
                type: "positive"
            });
        }
    }["useActionBarFeedbackPositive.useCallback[callback]"], [
        aui
    ]);
    return callback;
};
_s(useActionBarFeedbackPositive, "LpdMJTxVkTUoM+s15Ei/hRYx3vY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
const ActionBarPrimitiveFeedbackPositive = /*#__PURE__*/ _s1((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s1(({ onClick, disabled, ...props }, forwardedRef)=>{
    _s1();
    const isSubmitted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ActionBarPrimitiveFeedbackPositive.useAuiState[isSubmitted]": (s)=>s.message.metadata.submittedFeedback?.type === "positive"
    }["ActionBarPrimitiveFeedbackPositive.useAuiState[isSubmitted]"]);
    const callback = useActionBarFeedbackPositive();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isSubmitted ? {
            "data-submitted": "true"
        } : {},
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-feedback-positive.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "SHAKm9CVXPjo//1/ts2z/fQiGGo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        useActionBarFeedbackPositive
    ];
})), "SHAKm9CVXPjo//1/ts2z/fQiGGo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        useActionBarFeedbackPositive
    ];
});
_c1 = ActionBarPrimitiveFeedbackPositive;
ActionBarPrimitiveFeedbackPositive.displayName = "ActionBarPrimitive.FeedbackPositive";
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBarPrimitiveFeedbackPositive$forwardRef");
__turbopack_context__.k.register(_c1, "ActionBarPrimitiveFeedbackPositive");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-feedback-negative.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveFeedbackNegative",
    ()=>ActionBarPrimitiveFeedbackNegative
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const useActionBarFeedbackNegative = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActionBarFeedbackNegative.useCallback[callback]": ()=>{
            aui.message().submitFeedback({
                type: "negative"
            });
        }
    }["useActionBarFeedbackNegative.useCallback[callback]"], [
        aui
    ]);
    return callback;
};
_s(useActionBarFeedbackNegative, "LpdMJTxVkTUoM+s15Ei/hRYx3vY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
const ActionBarPrimitiveFeedbackNegative = /*#__PURE__*/ _s1((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s1(({ onClick, disabled, ...props }, forwardedRef)=>{
    _s1();
    const isSubmitted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ActionBarPrimitiveFeedbackNegative.useAuiState[isSubmitted]": (s)=>s.message.metadata.submittedFeedback?.type === "negative"
    }["ActionBarPrimitiveFeedbackNegative.useAuiState[isSubmitted]"]);
    const callback = useActionBarFeedbackNegative();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isSubmitted ? {
            "data-submitted": "true"
        } : {},
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-feedback-negative.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "lw6QV4vP5T7/tLKySJaza0S63zE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        useActionBarFeedbackNegative
    ];
})), "lw6QV4vP5T7/tLKySJaza0S63zE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        useActionBarFeedbackNegative
    ];
});
_c1 = ActionBarPrimitiveFeedbackNegative;
ActionBarPrimitiveFeedbackNegative.displayName = "ActionBarPrimitive.FeedbackNegative";
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBarPrimitiveFeedbackNegative$forwardRef");
__turbopack_context__.k.register(_c1, "ActionBarPrimitiveFeedbackNegative");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/action-bar-export-markdown.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitiveExportMarkdown",
    ()=>ActionBarPrimitiveExportMarkdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const useActionBarExportMarkdown = ({ filename, onExport } = {})=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const hasExportableContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useActionBarExportMarkdown.useAuiState[hasExportableContent]": ({ message })=>{
            return (message.role !== "assistant" || message.status?.type !== "running") && message.parts.some({
                "useActionBarExportMarkdown.useAuiState[hasExportableContent]": (c)=>c.type === "text" && c.text.length > 0
            }["useActionBarExportMarkdown.useAuiState[hasExportableContent]"]);
        }
    }["useActionBarExportMarkdown.useAuiState[hasExportableContent]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useActionBarExportMarkdown.useCallback[callback]": async ()=>{
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
        }
    }["useActionBarExportMarkdown.useCallback[callback]"], [
        aui,
        filename,
        onExport
    ]);
    if (!hasExportableContent) return null;
    return callback;
};
_s(useActionBarExportMarkdown, "ULLDPvn9tYss6Azta5D5MQmTDGo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ActionBarPrimitiveExportMarkdown = /*#__PURE__*/ _s1((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s1(({ filename, onExport, onClick, disabled, ...props }, forwardedRef)=>{
    _s1();
    const callback = useActionBarExportMarkdown({
        filename,
        onExport
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...props,
        ref: forwardedRef,
        disabled: disabled || !callback,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            callback?.();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/action-bar/action-bar-export-markdown.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "U0Ve3qj4EsEE33y1Z6ebjqJYTqs=", false, function() {
    return [
        useActionBarExportMarkdown
    ];
})), "U0Ve3qj4EsEE33y1Z6ebjqJYTqs=", false, function() {
    return [
        useActionBarExportMarkdown
    ];
});
_c1 = ActionBarPrimitiveExportMarkdown;
ActionBarPrimitiveExportMarkdown.displayName = "ActionBarPrimitive.ExportMarkdown";
var _c, _c1;
__turbopack_context__.k.register(_c, "ActionBarPrimitiveExportMarkdown$forwardRef");
__turbopack_context__.k.register(_c1, "ActionBarPrimitiveExportMarkdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/action-bar/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Copy",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$copy$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarPrimitiveCopy"],
    "Edit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$edit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarPrimitiveEdit"],
    "ExportMarkdown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$export$2d$markdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarPrimitiveExportMarkdown"],
    "FeedbackNegative",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$feedback$2d$negative$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarPrimitiveFeedbackNegative"],
    "FeedbackPositive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$feedback$2d$positive$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarPrimitiveFeedbackPositive"],
    "Reload",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$reload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarPrimitiveReload"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarPrimitiveRoot"],
    "Speak",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$speak$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarPrimitiveSpeak"],
    "StopSpeaking",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$stop$2d$speaking$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionBarPrimitiveStopSpeaking"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-root.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$copy$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-copy.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$reload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-reload.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$edit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-edit.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$speak$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-speak.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$stop$2d$speaking$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-stop-speaking.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$feedback$2d$positive$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-feedback-positive.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$feedback$2d$negative$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-feedback-negative.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$action$2d$bar$2d$export$2d$markdown$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/action-bar-export-markdown.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/action-bar/index.ts [app-client] (ecmascript) <export * as ActionBarPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionBarPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$action$2d$bar$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/action-bar/index.ts [app-client] (ecmascript)");
}),
"[project]/packages/store/src/aui-if.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuiIf",
    ()=>AuiIf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const AuiIf = ({ children, condition })=>{
    _s();
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])(condition);
    return result ? children : null;
};
_s(AuiIf, "Q6VhHlVFRSxNPxQPMQ1IAJVDYGE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c = AuiIf;
AuiIf.displayName = "AuiIf";
var _c;
__turbopack_context__.k.register(_c, "AuiIf");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/aui-if.tsx [app-client] (ecmascript) <export AuiIf as AssistantIf>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssistantIf",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$aui$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuiIf"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$aui$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/aui-if.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/branch-picker/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/branch-picker/branch-picker-next.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveNext",
    ()=>BranchPickerPrimitiveNext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useBranchPickerNext = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useBranchPickerNext.useAuiState[disabled]": ({ thread, message })=>{
            // Disabled if no next branch
            if (message.branchNumber >= message.branchCount) return true;
            // Disabled if running and capability not supported
            if (thread.isRunning && !thread.capabilities.switchBranchDuringRun) {
                return true;
            }
            return false;
        }
    }["useBranchPickerNext.useAuiState[disabled]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBranchPickerNext.useCallback[callback]": ()=>{
            aui.message().switchToBranch({
                position: "next"
            });
        }
    }["useBranchPickerNext.useCallback[callback]"], [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
_s(useBranchPickerNext, "dwEAQvB3pQRhQ0UWtrspbZhyjhU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const BranchPickerPrimitiveNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("BranchPickerPrimitive.Next", useBranchPickerNext);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/branch-picker/branch-picker-previous.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitivePrevious",
    ()=>BranchPickerPrimitivePrevious
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useBranchPickerPrevious.useAuiState[disabled]": ({ thread, message })=>{
            // Disabled if no previous branch
            if (message.branchNumber <= 1) return true;
            // Disabled if running and capability not supported
            if (thread.isRunning && !thread.capabilities.switchBranchDuringRun) {
                return true;
            }
            return false;
        }
    }["useBranchPickerPrevious.useAuiState[disabled]"]);
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBranchPickerPrevious.useCallback[callback]": ()=>{
            aui.message().switchToBranch({
                position: "previous"
            });
        }
    }["useBranchPickerPrevious.useCallback[callback]"], [
        aui
    ]);
    if (disabled) return null;
    return callback;
};
_s(useBranchPickerPrevious, "dwEAQvB3pQRhQ0UWtrspbZhyjhU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const BranchPickerPrimitivePrevious = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("BranchPickerPrimitive.Previous", useBranchPickerPrevious);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/branch-picker/branch-picker-count.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveCount",
    ()=>BranchPickerPrimitiveCount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const useBranchPickerCount = ()=>{
    _s();
    const branchCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useBranchPickerCount.useAuiState[branchCount]": ({ message })=>message.branchCount
    }["useBranchPickerCount.useAuiState[branchCount]"]);
    return branchCount;
};
_s(useBranchPickerCount, "nXoQSPxuXQIECA9IYaaxzu4T/3M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const BranchPickerPrimitiveCount = ()=>{
    _s1();
    const branchCount = useBranchPickerCount();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: branchCount
    }, void 0, false);
};
_s1(BranchPickerPrimitiveCount, "HGXTPOPmd4ElJa2vFjY3z3mI1j8=", false, function() {
    return [
        useBranchPickerCount
    ];
});
_c = BranchPickerPrimitiveCount;
BranchPickerPrimitiveCount.displayName = "BranchPickerPrimitive.Count";
var _c;
__turbopack_context__.k.register(_c, "BranchPickerPrimitiveCount");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/branch-picker/branch-picker-number.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveNumber",
    ()=>BranchPickerPrimitiveNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const useBranchPickerNumber = ()=>{
    _s();
    const branchNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useBranchPickerNumber.useAuiState[branchNumber]": ({ message })=>message.branchNumber
    }["useBranchPickerNumber.useAuiState[branchNumber]"]);
    return branchNumber;
};
_s(useBranchPickerNumber, "dk6oLCh8Nejt9hvIgpIf+9AAZik=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const BranchPickerPrimitiveNumber = ()=>{
    _s1();
    const branchNumber = useBranchPickerNumber();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: branchNumber
    }, void 0, false);
};
_s1(BranchPickerPrimitiveNumber, "J8p2RAwdhadyoy0zl93JAXzx/mY=", false, function() {
    return [
        useBranchPickerNumber
    ];
});
_c = BranchPickerPrimitiveNumber;
BranchPickerPrimitiveNumber.displayName = "BranchPickerPrimitive.Number";
var _c;
__turbopack_context__.k.register(_c, "BranchPickerPrimitiveNumber");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/message/message-if.tsx [app-client] (ecmascript) <export MessagePrimitiveIf as If>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessagePrimitiveIf"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-if.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/branch-picker/branch-picker-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitiveRoot",
    ()=>BranchPickerPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__MessagePrimitiveIf__as__If$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/message/message-if.tsx [app-client] (ecmascript) <export MessagePrimitiveIf as If>");
"use client";
;
;
;
;
const BranchPickerPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ hideWhenSingleBranch, ...rest }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$message$2f$message$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__MessagePrimitiveIf__as__If$3e$__["If"], {
        hasBranches: hideWhenSingleBranch ? true : undefined,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
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
_c1 = BranchPickerPrimitiveRoot;
BranchPickerPrimitiveRoot.displayName = "BranchPickerPrimitive.Root";
var _c, _c1;
__turbopack_context__.k.register(_c, "BranchPickerPrimitiveRoot$forwardRef");
__turbopack_context__.k.register(_c1, "BranchPickerPrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/branch-picker/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Count",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$count$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveCount"],
    "Next",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$next$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveNext"],
    "Number",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$number$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveNumber"],
    "Previous",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$previous$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BranchPickerPrimitivePrevious"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BranchPickerPrimitiveRoot"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$next$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/branch-picker-next.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$previous$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/branch-picker-previous.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$count$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/branch-picker-count.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$number$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/branch-picker-number.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$branch$2d$picker$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/branch-picker-root.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/branch-picker/index.ts [app-client] (ecmascript) <export * as BranchPickerPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BranchPickerPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$branch$2d$picker$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/branch-picker/index.ts [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/error/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/error/error-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorPrimitiveRoot",
    ()=>ErrorPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
;
;
const ErrorPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = (props, forwardRef)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        role: "alert",
        ...props,
        ref: forwardRef
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/error/error-root.tsx",
        lineNumber: 15,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = ErrorPrimitiveRoot;
ErrorPrimitiveRoot.displayName = "ErrorPrimitive.Root";
var _c, _c1;
__turbopack_context__.k.register(_c, "ErrorPrimitiveRoot$forwardRef");
__turbopack_context__.k.register(_c1, "ErrorPrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/error/error-message.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorPrimitiveMessage",
    ()=>ErrorPrimitiveMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ErrorPrimitiveMessage = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ children, ...props }, forwardRef)=>{
    _s();
    const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ErrorPrimitiveMessage.useAuiState[error]": ({ message })=>{
            return message.status?.type === "incomplete" && message.status.reason === "error" ? message.status.error : undefined;
        }
    }["ErrorPrimitiveMessage.useAuiState[error]"]);
    if (error === undefined) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].span, {
        ...props,
        ref: forwardRef,
        children: children ?? String(error)
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/error/error-message.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "08I+Bm0o602KoU/okM3yrkMWyVE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
})), "08I+Bm0o602KoU/okM3yrkMWyVE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c1 = ErrorPrimitiveMessage;
ErrorPrimitiveMessage.displayName = "ErrorPrimitive.Message";
var _c, _c1;
__turbopack_context__.k.register(_c, "ErrorPrimitiveMessage$forwardRef");
__turbopack_context__.k.register(_c1, "ErrorPrimitiveMessage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/error/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Message",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$error$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorPrimitiveMessage"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$error$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorPrimitiveRoot"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/error/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$error$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/error/error-root.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$error$2d$message$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/error/error-message.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/error/index.ts [app-client] (ecmascript) <export * as ErrorPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$error$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/error/index.ts [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/thread-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveRoot",
    ()=>ThreadPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
;
;
const ThreadPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = (props, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-root.tsx",
        lineNumber: 34,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = ThreadPrimitiveRoot;
ThreadPrimitiveRoot.displayName = "ThreadPrimitive.Root";
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadPrimitiveRoot$forwardRef");
__turbopack_context__.k.register(_c1, "ThreadPrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/thread-empty.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveEmpty",
    ()=>ThreadPrimitiveEmpty
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const ThreadPrimitiveEmpty = ({ children })=>{
    _s();
    const empty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ThreadPrimitiveEmpty.useAuiState[empty]": ({ thread })=>thread.messages.length === 0 && !thread.isLoading
    }["ThreadPrimitiveEmpty.useAuiState[empty]"]);
    return empty ? children : null;
};
_s(ThreadPrimitiveEmpty, "ilqsiC//dcxkaQ8XB4idovyz7r8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c = ThreadPrimitiveEmpty;
ThreadPrimitiveEmpty.displayName = "ThreadPrimitive.Empty";
var _c;
__turbopack_context__.k.register(_c, "ThreadPrimitiveEmpty");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/thread-if.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveIf",
    ()=>ThreadPrimitiveIf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const useThreadIf = (props)=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useThreadIf.useAuiState": ({ thread })=>{
            if (props.empty === true && !thread.isEmpty) return false;
            if (props.empty === false && thread.isEmpty) return false;
            if (props.running === true && !thread.isRunning) return false;
            if (props.running === false && thread.isRunning) return false;
            if (props.disabled === true && !thread.isDisabled) return false;
            if (props.disabled === false && thread.isDisabled) return false;
            return true;
        }
    }["useThreadIf.useAuiState"]);
};
_s(useThreadIf, "kbE+C4pk3mcZo+W+dXJ9ArS6lK4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ThreadPrimitiveIf = ({ children, ...query })=>{
    _s1();
    const result = useThreadIf(query);
    return result ? children : null;
};
_s1(ThreadPrimitiveIf, "PH9NJyEiKLZyHvvA3HnqWwPIDAA=", false, function() {
    return [
        useThreadIf
    ];
});
_c = ThreadPrimitiveIf;
ThreadPrimitiveIf.displayName = "ThreadPrimitive.If";
var _c;
__turbopack_context__.k.register(_c, "ThreadPrimitiveIf");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/store/src/use-aui-event.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuiEvent",
    ()=>useAuiEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$effect$2d$event$40$2$2e$0$2e$3_react$40$19$2e$2$2e$4$2f$node_modules$2f$use$2d$effect$2d$event$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/use-effect-event@2.0.3_react@19.2.4/node_modules/use-effect-event/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$types$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/types/events.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
const useAuiEvent = (selector, callback)=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$effect$2d$event$40$2$2e$0$2e$3_react$40$19$2e$2$2e$4$2f$node_modules$2f$use$2d$effect$2d$event$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffectEvent"])(callback);
    const { scope, event } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$types$2f$events$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeEventSelector"])(selector);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuiEvent.useEffect": ()=>aui.on({
                scope,
                event
            }, callbackRef)
    }["useAuiEvent.useEffect"], [
        aui,
        scope,
        event,
        callbackRef
    ]);
};
_s(useAuiEvent, "dU5/RnOLDsfBQ1QQ5U+S87A75vs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$use$2d$effect$2d$event$40$2$2e$0$2e$3_react$40$19$2e$2$2e$4$2f$node_modules$2f$use$2d$effect$2d$event$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffectEvent"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/utils/hooks/use-on-resize-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOnResizeContent",
    ()=>useOnResizeContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-use-callback-ref@1.1.1_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
const useOnResizeContent = (callback)=>{
    _s();
    const callbackRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"])(callback);
    const refCallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOnResizeContent.useCallback[refCallback]": (el)=>{
            const resizeObserver = new ResizeObserver({
                "useOnResizeContent.useCallback[refCallback]": ()=>{
                    callbackRef();
                }
            }["useOnResizeContent.useCallback[refCallback]"]);
            const mutationObserver = new MutationObserver({
                "useOnResizeContent.useCallback[refCallback]": (mutations)=>{
                    // Filter out style-only attribute mutations to prevent feedback loops
                    // with components like ThreadViewportSlack that write styles in response
                    // to viewport changes
                    const hasRelevantMutation = mutations.some({
                        "useOnResizeContent.useCallback[refCallback].hasRelevantMutation": (m)=>m.type !== "attributes" || m.attributeName !== "style"
                    }["useOnResizeContent.useCallback[refCallback].hasRelevantMutation"]);
                    if (hasRelevantMutation) {
                        callbackRef();
                    }
                }
            }["useOnResizeContent.useCallback[refCallback]"]);
            resizeObserver.observe(el);
            mutationObserver.observe(el, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });
            return ({
                "useOnResizeContent.useCallback[refCallback]": ()=>{
                    resizeObserver.disconnect();
                    mutationObserver.disconnect();
                }
            })["useOnResizeContent.useCallback[refCallback]"];
        }
    }["useOnResizeContent.useCallback[refCallback]"], [
        callbackRef
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useManagedRef"])(refCallback);
};
_s(useOnResizeContent, "980LV38qjWIXL7s4NGcbjdhDJoI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$use$2d$callback$2d$ref$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$use$2d$callback$2d$ref$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallbackRef"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useManagedRef"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/use-thread-viewport-auto-scroll.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useThreadViewportAutoScroll",
    ()=>useThreadViewportAutoScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-event.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$resize$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-on-resize-content.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-on-scroll-to-bottom.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-managed-ref.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/readonly-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
    _s();
    const divRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const threadViewportStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewportStore"])();
    if (autoScroll === undefined) {
        autoScroll = threadViewportStore.getState().turnAnchor !== "top";
    }
    const lastScrollTop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // bug: when ScrollToBottom's button changes its disabled state, the scroll stops
    // fix: delay the state change until the scroll is done
    // stores the scroll behavior to reuse during content resize, or null if not scrolling
    const scrollingToBottomBehaviorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useThreadViewportAutoScroll.useCallback[scrollToBottom]": (behavior)=>{
            const div = divRef.current;
            if (!div) return;
            scrollingToBottomBehaviorRef.current = behavior;
            div.scrollTo({
                top: div.scrollHeight,
                behavior
            });
        }
    }["useThreadViewportAutoScroll.useCallback[scrollToBottom]"], []);
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
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$readonly$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writableStore"])(threadViewportStore).setState({
                    isAtBottom: newIsAtBottom
                });
            }
        }
        lastScrollTop.current = div.scrollTop;
    };
    const resizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$resize$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnResizeContent"])({
        "useThreadViewportAutoScroll.useOnResizeContent[resizeRef]": ()=>{
            const scrollBehavior = scrollingToBottomBehaviorRef.current;
            if (scrollBehavior) {
                scrollToBottom(scrollBehavior);
            } else if (autoScroll && threadViewportStore.getState().isAtBottom) {
                scrollToBottom("instant");
            }
            handleScroll();
        }
    }["useThreadViewportAutoScroll.useOnResizeContent[resizeRef]"]);
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useManagedRef"])({
        "useThreadViewportAutoScroll.useManagedRef[scrollRef]": (el)=>{
            el.addEventListener("scroll", handleScroll);
            return ({
                "useThreadViewportAutoScroll.useManagedRef[scrollRef]": ()=>{
                    el.removeEventListener("scroll", handleScroll);
                }
            })["useThreadViewportAutoScroll.useManagedRef[scrollRef]"];
        }
    }["useThreadViewportAutoScroll.useManagedRef[scrollRef]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnScrollToBottom"])({
        "useThreadViewportAutoScroll.useOnScrollToBottom": ({ behavior })=>{
            scrollToBottom(behavior);
        }
    }["useThreadViewportAutoScroll.useOnScrollToBottom"]);
    // autoscroll on run start
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiEvent"])("thread.runStart", {
        "useThreadViewportAutoScroll.useAuiEvent": ()=>{
            if (!scrollToBottomOnRunStart) return;
            scrollingToBottomBehaviorRef.current = "auto";
            requestAnimationFrame({
                "useThreadViewportAutoScroll.useAuiEvent": ()=>{
                    scrollToBottom("auto");
                }
            }["useThreadViewportAutoScroll.useAuiEvent"]);
        }
    }["useThreadViewportAutoScroll.useAuiEvent"]);
    // scroll to bottom instantly when thread history is first loaded
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiEvent"])("thread.initialize", {
        "useThreadViewportAutoScroll.useAuiEvent": ()=>{
            if (!scrollToBottomOnInitialize) return;
            scrollingToBottomBehaviorRef.current = "instant";
            requestAnimationFrame({
                "useThreadViewportAutoScroll.useAuiEvent": ()=>{
                    scrollToBottom("instant");
                }
            }["useThreadViewportAutoScroll.useAuiEvent"]);
        }
    }["useThreadViewportAutoScroll.useAuiEvent"]);
    // scroll to bottom instantly when switching threads
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiEvent"])("threadListItem.switchedTo", {
        "useThreadViewportAutoScroll.useAuiEvent": ()=>{
            if (!scrollToBottomOnThreadSwitch) return;
            scrollingToBottomBehaviorRef.current = "instant";
            requestAnimationFrame({
                "useThreadViewportAutoScroll.useAuiEvent": ()=>{
                    scrollToBottom("instant");
                }
            }["useThreadViewportAutoScroll.useAuiEvent"]);
        }
    }["useThreadViewportAutoScroll.useAuiEvent"]);
    const autoScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(resizeRef, scrollRef, divRef);
    return autoScrollRef;
};
_s(useThreadViewportAutoScroll, "XbCgCEQg/I11zVcwYkvekdtNGes=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewportStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$resize$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnResizeContent"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$managed$2d$ref$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useManagedRef"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$on$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOnScrollToBottom"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiEvent"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiEvent"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$event$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiEvent"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/thread-viewport.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveViewport",
    ()=>ThreadPrimitiveViewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$use$2d$thread$2d$viewport$2d$auto$2d$scroll$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/use-thread-viewport-auto-scroll.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/thread-viewport-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-size-handle.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const useViewportSizeRef = ()=>{
    _s();
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"])({
        "useViewportSizeRef.useThreadViewport[register]": (s)=>s.registerViewport
    }["useViewportSizeRef.useThreadViewport[register]"]);
    const getHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useViewportSizeRef.useCallback[getHeight]": (el)=>el.clientHeight
    }["useViewportSizeRef.useCallback[getHeight]"], []);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSizeHandle"])(register, getHeight);
};
_s(useViewportSizeRef, "zRwYbksQLG3v6diREXbHv0xtLoU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSizeHandle"]
    ];
});
const ThreadPrimitiveViewportScrollable = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_s1(({ autoScroll, scrollToBottomOnRunStart, scrollToBottomOnInitialize, scrollToBottomOnThreadSwitch, children, ...rest }, forwardedRef)=>{
    _s1();
    const autoScrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$use$2d$thread$2d$viewport$2d$auto$2d$scroll$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewportAutoScroll"])({
        autoScroll,
        scrollToBottomOnRunStart,
        scrollToBottomOnInitialize,
        scrollToBottomOnThreadSwitch
    });
    const viewportSizeRef = useViewportSizeRef();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, autoScrollRef, viewportSizeRef);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...rest,
        ref: ref,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-viewport.tsx",
        lineNumber: 88,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
}, "M5ELLuOwJydAYhIanKTsHSeXkgQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$use$2d$thread$2d$viewport$2d$auto$2d$scroll$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewportAutoScroll"],
        useViewportSizeRef,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"]
    ];
}));
_c = ThreadPrimitiveViewportScrollable;
ThreadPrimitiveViewportScrollable.displayName = "ThreadPrimitive.ViewportScrollable";
const ThreadPrimitiveViewport = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c1 = ({ turnAnchor, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportProvider"], {
        options: {
            turnAnchor
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadPrimitiveViewportScrollable, {
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
_c2 = ThreadPrimitiveViewport;
ThreadPrimitiveViewport.displayName = "ThreadPrimitive.Viewport";
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ThreadPrimitiveViewportScrollable");
__turbopack_context__.k.register(_c1, "ThreadPrimitiveViewport$forwardRef");
__turbopack_context__.k.register(_c2, "ThreadPrimitiveViewport");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/thread-viewport-footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveViewportFooter",
    ()=>ThreadPrimitiveViewportFooter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-compose-refs@1.1.2_@types+react@19.2.10_react@19.2.4/node_modules/@radix-ui/react-compose-refs/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/hooks/use-size-handle.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const ThreadPrimitiveViewportFooter = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s((props, forwardedRef)=>{
    _s();
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"])({
        "ThreadPrimitiveViewportFooter.useThreadViewport[register]": (s)=>s.registerContentInset
    }["ThreadPrimitiveViewportFooter.useThreadViewport[register]"]);
    const getHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ThreadPrimitiveViewportFooter.useCallback[getHeight]": (el)=>{
            const marginTop = parseFloat(getComputedStyle(el).marginTop) || 0;
            return el.offsetHeight + marginTop;
        }
    }["ThreadPrimitiveViewportFooter.useCallback[getHeight]"], []);
    const resizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSizeHandle"])(register, getHeight);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"])(forwardedRef, resizeRef);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-viewport-footer.tsx",
        lineNumber: 54,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
}, "E1QDC/IWeKpPr3o2WnsN188JWuc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSizeHandle"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"]
    ];
})), "E1QDC/IWeKpPr3o2WnsN188JWuc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$hooks$2f$use$2d$size$2d$handle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSizeHandle"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$compose$2d$refs$40$1$2e$1$2e$2_$40$types$2b$react$40$19$2e$2$2e$10_react$40$19$2e$2$2e$4$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$compose$2d$refs$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useComposedRefs"]
    ];
});
_c1 = ThreadPrimitiveViewportFooter;
ThreadPrimitiveViewportFooter.displayName = "ThreadPrimitive.ViewportFooter";
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadPrimitiveViewportFooter$forwardRef");
__turbopack_context__.k.register(_c1, "ThreadPrimitiveViewportFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/providers/message-by-index-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageByIndexProvider",
    ()=>MessageByIndexProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const MessageByIndexProvider = ({ index, children })=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])({
        message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"])({
            source: "thread",
            query: {
                type: "index",
                index
            },
            get: {
                "MessageByIndexProvider.useAui[aui]": (aui)=>aui.thread().message({
                        index
                    })
            }["MessageByIndexProvider.useAui[aui]"]
        }),
        composer: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"])({
            source: "message",
            query: {},
            get: {
                "MessageByIndexProvider.useAui[aui]": (aui)=>aui.thread().message({
                        index
                    }).composer
            }["MessageByIndexProvider.useAui[aui]"]
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/message-by-index-provider.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MessageByIndexProvider, "BbJ1x+sAPxy/dizeIXhuPkzme6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c = MessageByIndexProvider;
var _c;
__turbopack_context__.k.register(_c, "MessageByIndexProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/thread-messages.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveMessageByIndex",
    ()=>ThreadPrimitiveMessageByIndex,
    "ThreadPrimitiveMessages",
    ()=>ThreadPrimitiveMessages,
    "ThreadPrimitiveMessagesImpl",
    ()=>ThreadPrimitiveMessagesImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$message$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/message-by-index-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const isComponentsSame = (prev, next)=>{
    return prev.Message === next.Message && prev.EditComposer === next.EditComposer && prev.UserEditComposer === next.UserEditComposer && prev.AssistantEditComposer === next.AssistantEditComposer && prev.SystemEditComposer === next.SystemEditComposer && prev.UserMessage === next.UserMessage && prev.AssistantMessage === next.AssistantMessage && prev.SystemMessage === next.SystemMessage;
};
const DEFAULT_SYSTEM_MESSAGE = ()=>null;
_c = DEFAULT_SYSTEM_MESSAGE;
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
    _s();
    const role = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ThreadMessageComponent.useAuiState[role]": ({ message })=>message.role
    }["ThreadMessageComponent.useAuiState[role]"]);
    const isEditing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ThreadMessageComponent.useAuiState[isEditing]": ({ message })=>message.composer.isEditing
    }["ThreadMessageComponent.useAuiState[isEditing]"]);
    const Component = getComponent(components, role, isEditing);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {}, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-messages.tsx",
        lineNumber: 136,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThreadMessageComponent, "MUkAYRRt+YY2Lc7rWMkRj7aaxSc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c1 = ThreadMessageComponent;
const ThreadPrimitiveMessageByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$message$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageByIndexProvider"], {
        index: index,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadMessageComponent, {
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
_c2 = ThreadPrimitiveMessageByIndex;
ThreadPrimitiveMessageByIndex.displayName = "ThreadPrimitive.MessageByIndex";
const ThreadPrimitiveMessagesImpl = ({ components })=>{
    _s1();
    const messagesLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ThreadPrimitiveMessagesImpl.useAuiState[messagesLength]": ({ thread })=>thread.messages.length
    }["ThreadPrimitiveMessagesImpl.useAuiState[messagesLength]"]);
    const messageElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ThreadPrimitiveMessagesImpl.useMemo[messageElements]": ()=>{
            if (messagesLength === 0) return null;
            return Array.from({
                length: messagesLength
            }, {
                "ThreadPrimitiveMessagesImpl.useMemo[messageElements]": (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadPrimitiveMessageByIndex, {
                        index: index,
                        components: components
                    }, index, false, {
                        fileName: "[project]/packages/react/src/primitives/thread/thread-messages.tsx",
                        lineNumber: 204,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
            }["ThreadPrimitiveMessagesImpl.useMemo[messageElements]"]);
        }
    }["ThreadPrimitiveMessagesImpl.useMemo[messageElements]"], [
        messagesLength,
        components
    ]);
    return messageElements;
};
_s1(ThreadPrimitiveMessagesImpl, "CVU3lSu3B7xm0xL2UWr6y6xJdns=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c3 = ThreadPrimitiveMessagesImpl;
ThreadPrimitiveMessagesImpl.displayName = "ThreadPrimitive.Messages";
const ThreadPrimitiveMessages = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(ThreadPrimitiveMessagesImpl, (prev, next)=>isComponentsSame(prev.components, next.components));
_c4 = ThreadPrimitiveMessages;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "DEFAULT_SYSTEM_MESSAGE");
__turbopack_context__.k.register(_c1, "ThreadMessageComponent");
__turbopack_context__.k.register(_c2, "ThreadPrimitiveMessageByIndex");
__turbopack_context__.k.register(_c3, "ThreadPrimitiveMessagesImpl");
__turbopack_context__.k.register(_c4, "ThreadPrimitiveMessages");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/thread-scroll-to-bottom.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveScrollToBottom",
    ()=>ThreadPrimitiveScrollToBottom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/react/thread-viewport-context.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useThreadScrollToBottom = ({ behavior } = {})=>{
    _s();
    const isAtBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"])({
        "useThreadScrollToBottom.useThreadViewport[isAtBottom]": (s)=>s.isAtBottom
    }["useThreadScrollToBottom.useThreadViewport[isAtBottom]"]);
    const threadViewportStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewportStore"])();
    const handleScrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useThreadScrollToBottom.useCallback[handleScrollToBottom]": ()=>{
            threadViewportStore.getState().scrollToBottom({
                behavior
            });
        }
    }["useThreadScrollToBottom.useCallback[handleScrollToBottom]"], [
        threadViewportStore,
        behavior
    ]);
    if (isAtBottom) return null;
    return handleScrollToBottom;
};
_s(useThreadScrollToBottom, "OKH4VW8foOLouI+NW0WDZzOx4eI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewport"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$react$2f$thread$2d$viewport$2d$context$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useThreadViewportStore"]
    ];
});
const ThreadPrimitiveScrollToBottom = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadPrimitive.ScrollToBottom", useThreadScrollToBottom, [
    "behavior"
]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/thread-suggestion.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveSuggestion",
    ()=>ThreadPrimitiveSuggestion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useThreadSuggestion = ({ prompt, send, clearComposer = true, autoSend, method: _method })=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    const disabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "useThreadSuggestion.useAuiState[disabled]": ({ thread })=>thread.isDisabled
    }["useThreadSuggestion.useAuiState[disabled]"]);
    // ========== Deprecation Mapping ==========
    const resolvedSend = send ?? autoSend ?? false;
    // ==========================================
    const callback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useThreadSuggestion.useCallback[callback]": ()=>{
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
        }
    }["useThreadSuggestion.useCallback[callback]"], [
        aui,
        resolvedSend,
        clearComposer,
        prompt
    ]);
    if (disabled) return null;
    return callback;
};
_s(useThreadSuggestion, "dwEAQvB3pQRhQ0UWtrspbZhyjhU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
const ThreadPrimitiveSuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadPrimitive.Suggestion", useThreadSuggestion, [
    "prompt",
    "send",
    "clearComposer",
    "autoSend",
    "method"
]);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/providers/suggestion-by-index-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SuggestionByIndexProvider",
    ()=>SuggestionByIndexProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const SuggestionByIndexProvider = ({ index, children })=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])({
        suggestion: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"])({
            source: "suggestions",
            query: {
                index
            },
            get: {
                "SuggestionByIndexProvider.useAui[aui]": (aui)=>aui.suggestions().suggestion({
                        index
                    })
            }["SuggestionByIndexProvider.useAui[aui]"]
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/suggestion-by-index-provider.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SuggestionByIndexProvider, "BbJ1x+sAPxy/dizeIXhuPkzme6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c = SuggestionByIndexProvider;
var _c;
__turbopack_context__.k.register(_c, "SuggestionByIndexProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/thread-suggestions.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitiveSuggestionByIndex",
    ()=>ThreadPrimitiveSuggestionByIndex,
    "ThreadPrimitiveSuggestions",
    ()=>ThreadPrimitiveSuggestions,
    "ThreadPrimitiveSuggestionsImpl",
    ()=>ThreadPrimitiveSuggestionsImpl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$suggestion$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/suggestion-by-index-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const SuggestionComponent = ({ components })=>{
    const Component = components.Suggestion;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {}, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread/thread-suggestions.tsx",
        lineNumber: 25,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_c = SuggestionComponent;
const ThreadPrimitiveSuggestionByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(({ index, components })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$suggestion$2d$by$2d$index$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SuggestionByIndexProvider"], {
        index: index,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SuggestionComponent, {
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
_c1 = ThreadPrimitiveSuggestionByIndex;
ThreadPrimitiveSuggestionByIndex.displayName = "ThreadPrimitive.SuggestionByIndex";
const ThreadPrimitiveSuggestionsImpl = ({ components })=>{
    _s();
    const suggestionsLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ThreadPrimitiveSuggestionsImpl.useAuiState[suggestionsLength]": ({ suggestions })=>suggestions.suggestions.length
    }["ThreadPrimitiveSuggestionsImpl.useAuiState[suggestionsLength]"]);
    const suggestionElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ThreadPrimitiveSuggestionsImpl.useMemo[suggestionElements]": ()=>{
            if (suggestionsLength === 0) return null;
            return Array.from({
                length: suggestionsLength
            }, {
                "ThreadPrimitiveSuggestionsImpl.useMemo[suggestionElements]": (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadPrimitiveSuggestionByIndex, {
                        index: index,
                        components: components
                    }, index, false, {
                        fileName: "[project]/packages/react/src/primitives/thread/thread-suggestions.tsx",
                        lineNumber: 93,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
            }["ThreadPrimitiveSuggestionsImpl.useMemo[suggestionElements]"]);
        }
    }["ThreadPrimitiveSuggestionsImpl.useMemo[suggestionElements]"], [
        suggestionsLength,
        components
    ]);
    return suggestionElements;
};
_s(ThreadPrimitiveSuggestionsImpl, "+hEyTe75Gfxh7Mx4COQLdPMUSng=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c2 = ThreadPrimitiveSuggestionsImpl;
ThreadPrimitiveSuggestionsImpl.displayName = "ThreadPrimitive.Suggestions";
const ThreadPrimitiveSuggestions = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(ThreadPrimitiveSuggestionsImpl, (prev, next)=>prev.components.Suggestion === next.components.Suggestion);
_c3 = ThreadPrimitiveSuggestions;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "SuggestionComponent");
__turbopack_context__.k.register(_c1, "ThreadPrimitiveSuggestionByIndex");
__turbopack_context__.k.register(_c2, "ThreadPrimitiveSuggestionsImpl");
__turbopack_context__.k.register(_c3, "ThreadPrimitiveSuggestions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Empty",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveEmpty"],
    "If",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveIf"],
    "MessageByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$messages$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveMessageByIndex"],
    "Messages",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$messages$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveMessages"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveRoot"],
    "ScrollToBottom",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveScrollToBottom"],
    "Suggestion",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$suggestion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveSuggestion"],
    "SuggestionByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$suggestions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveSuggestionByIndex"],
    "Suggestions",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$suggestions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveSuggestions"],
    "Viewport",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewport"],
    "ViewportFooter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportFooter"],
    "ViewportProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportProvider"],
    "ViewportSlack",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$slack$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadPrimitiveViewportSlack"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-root.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$empty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-empty.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$if$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-if.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-viewport.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$viewport$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/thread-viewport-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-viewport-footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$viewport$2d$slack$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-viewport-slack.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$messages$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-messages.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$scroll$2d$to$2d$bottom$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-scroll-to-bottom.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$suggestion$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-suggestion.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$thread$2d$suggestions$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/thread-suggestions.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread/index.ts [app-client] (ecmascript) <export * as ThreadPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread/index.ts [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list-item-more/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDropdownMenuScope",
    ()=>useDropdownMenuScope
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
;
const useDropdownMenuScope = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createDropdownMenuScope"]();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitiveRoot",
    ()=>ThreadListItemMorePrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const ThreadListItemMorePrimitiveRoot = ({ __scopeThreadListItemMore, ...rest })=>{
    _s();
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeThreadListItemMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ...scope,
        ...rest
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-root.tsx",
        lineNumber: 19,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThreadListItemMorePrimitiveRoot, "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
});
_c = ThreadListItemMorePrimitiveRoot;
ThreadListItemMorePrimitiveRoot.displayName = "ThreadListItemMorePrimitive.Root";
var _c;
__turbopack_context__.k.register(_c, "ThreadListItemMorePrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-trigger.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitiveTrigger",
    ()=>ThreadListItemMorePrimitiveTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ThreadListItemMorePrimitiveTrigger = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ __scopeThreadListItemMore, ...rest }, ref)=>{
    _s();
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeThreadListItemMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-trigger.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
}, "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
})), "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
});
_c1 = ThreadListItemMorePrimitiveTrigger;
ThreadListItemMorePrimitiveTrigger.displayName = "ThreadListItemMorePrimitive.Trigger";
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadListItemMorePrimitiveTrigger$forwardRef");
__turbopack_context__.k.register(_c1, "ThreadListItemMorePrimitiveTrigger");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitiveContent",
    ()=>ThreadListItemMorePrimitiveContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ThreadListItemMorePrimitiveContent = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ __scopeThreadListItemMore, portalProps, sideOffset = 4, ...props }, forwardedRef)=>{
    _s();
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeThreadListItemMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        ...scope,
        ...portalProps,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
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
}, "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
})), "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
});
_c1 = ThreadListItemMorePrimitiveContent;
ThreadListItemMorePrimitiveContent.displayName = "ThreadListItemMorePrimitive.Content";
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadListItemMorePrimitiveContent$forwardRef");
__turbopack_context__.k.register(_c1, "ThreadListItemMorePrimitiveContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-item.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitiveItem",
    ()=>ThreadListItemMorePrimitiveItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ThreadListItemMorePrimitiveItem = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ __scopeThreadListItemMore, ...rest }, ref)=>{
    _s();
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeThreadListItemMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-item.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
}, "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
})), "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
});
_c1 = ThreadListItemMorePrimitiveItem;
ThreadListItemMorePrimitiveItem.displayName = "ThreadListItemMorePrimitive.Item";
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadListItemMorePrimitiveItem$forwardRef");
__turbopack_context__.k.register(_c1, "ThreadListItemMorePrimitiveItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitiveSeparator",
    ()=>ThreadListItemMorePrimitiveSeparator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dropdown-menu@2.1.16_@types+react-dom@19.2.3_@types+react@19.2.10__@typ_292e07ad4d6f23c210a3c040c01e35d6/node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/scope.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ThreadListItemMorePrimitiveSeparator = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ __scopeThreadListItemMore, ...rest }, ref)=>{
    _s();
    const scope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"])(__scopeThreadListItemMore);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dropdown$2d$menu$40$2$2e$1$2e$16_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$typ_292e07ad4d6f23c210a3c040c01e35d6$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dropdown$2d$menu$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ...scope,
        ...rest,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-separator.tsx",
        lineNumber: 27,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
}, "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
})), "Gn1AklvXZ8hIQ+apLybC/cE8b4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$scope$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDropdownMenuScope"]
    ];
});
_c1 = ThreadListItemMorePrimitiveSeparator;
ThreadListItemMorePrimitiveSeparator.displayName = "ThreadListItemMorePrimitive.Separator";
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadListItemMorePrimitiveSeparator$forwardRef");
__turbopack_context__.k.register(_c1, "ThreadListItemMorePrimitiveSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item-more/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Content",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemMorePrimitiveContent"],
    "Item",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$item$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemMorePrimitiveItem"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemMorePrimitiveRoot"],
    "Separator",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemMorePrimitiveSeparator"],
    "Trigger",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$trigger$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemMorePrimitiveTrigger"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-root.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$trigger$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-trigger.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-content.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$item$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-item.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$thread$2d$list$2d$item$2d$more$2d$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/thread-list-item-more-separator.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list-item-more/index.ts [app-client] (ecmascript) <export * as ThreadListItemMorePrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemMorePrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2d$more$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item-more/index.ts [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list-item/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveRoot",
    ()=>ThreadListItemPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ThreadListItemPrimitiveRoot = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s((props, ref)=>{
    _s();
    const isMain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ThreadListItemPrimitiveRoot.useAuiState[isMain]": ({ threads, threadListItem })=>threads.mainThreadId === threadListItem.id
    }["ThreadListItemPrimitiveRoot.useAuiState[isMain]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
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
}, "D8zekYKpXX5F9pNx3ccxvuJ/Qk4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
})), "D8zekYKpXX5F9pNx3ccxvuJ/Qk4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c1 = ThreadListItemPrimitiveRoot;
ThreadListItemPrimitiveRoot.displayName = "ThreadListItemPrimitive.Root";
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadListItemPrimitiveRoot$forwardRef");
__turbopack_context__.k.register(_c1, "ThreadListItemPrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-archive.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveArchive",
    ()=>ThreadListItemPrimitiveArchive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useThreadListItemArchive = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useThreadListItemArchive.useCallback": ()=>{
            aui.threadListItem().archive();
        }
    }["useThreadListItemArchive.useCallback"], [
        aui
    ]);
};
_s(useThreadListItemArchive, "5N/bv2XrmYkRA4DFTEj7pqvHKTg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
const ThreadListItemPrimitiveArchive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadListItemPrimitive.Archive", useThreadListItemArchive);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-unarchive.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveUnarchive",
    ()=>ThreadListItemPrimitiveUnarchive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useThreadListItemUnarchive = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useThreadListItemUnarchive.useCallback": ()=>{
            aui.threadListItem().unarchive();
        }
    }["useThreadListItemUnarchive.useCallback"], [
        aui
    ]);
};
_s(useThreadListItemUnarchive, "5N/bv2XrmYkRA4DFTEj7pqvHKTg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
const ThreadListItemPrimitiveUnarchive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadListItemPrimitive.Unarchive", useThreadListItemUnarchive);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-delete.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveDelete",
    ()=>ThreadListItemPrimitiveDelete
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useThreadListItemDelete = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useThreadListItemDelete.useCallback": ()=>{
            aui.threadListItem().delete();
        }
    }["useThreadListItemDelete.useCallback"], [
        aui
    ]);
};
_s(useThreadListItemDelete, "5N/bv2XrmYkRA4DFTEj7pqvHKTg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
const ThreadListItemPrimitiveDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadListItemPrimitive.Delete", useThreadListItemDelete);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-trigger.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveTrigger",
    ()=>ThreadListItemPrimitiveTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/utils/create-action-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useThreadListItemTrigger = ()=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useThreadListItemTrigger.useCallback": ()=>{
            aui.threadListItem().switchTo();
        }
    }["useThreadListItemTrigger.useCallback"], [
        aui
    ]);
};
_s(useThreadListItemTrigger, "5N/bv2XrmYkRA4DFTEj7pqvHKTg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
const ThreadListItemPrimitiveTrigger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$utils$2f$create$2d$action$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createActionButton"])("ThreadListItemPrimitive.Trigger", useThreadListItemTrigger);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item/thread-list-item-title.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitiveTitle",
    ()=>ThreadListItemPrimitiveTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const ThreadListItemPrimitiveTitle = ({ fallback })=>{
    _s();
    const title = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ThreadListItemPrimitiveTitle.useAuiState[title]": ({ threadListItem })=>threadListItem.title
    }["ThreadListItemPrimitiveTitle.useAuiState[title]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: title || fallback
    }, void 0, false);
};
_s(ThreadListItemPrimitiveTitle, "6r8jTJt1uWprix5+J6TSO0gDsW0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c = ThreadListItemPrimitiveTitle;
ThreadListItemPrimitiveTitle.displayName = "ThreadListItemPrimitive.Title";
var _c;
__turbopack_context__.k.register(_c, "ThreadListItemPrimitiveTitle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list-item/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Archive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$archive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveArchive"],
    "Delete",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$delete$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveDelete"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveRoot"],
    "Title",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$title$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveTitle"],
    "Trigger",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$trigger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveTrigger"],
    "Unarchive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$unarchive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemPrimitiveUnarchive"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-root.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$archive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-archive.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$unarchive$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-unarchive.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$delete$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-delete.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$trigger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-trigger.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$thread$2d$list$2d$item$2d$title$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/thread-list-item-title.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list-item/index.ts [app-client] (ecmascript) <export * as ThreadListItemPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2d$item$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list-item/index.ts [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list/thread-list-new.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListPrimitiveNew",
    ()=>ThreadListPrimitiveNew
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+primitive@1.1.3/node_modules/@radix-ui/primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const ThreadListPrimitiveNew = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ onClick, disabled, ...props }, forwardedRef)=>{
    _s();
    const isMain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ThreadListPrimitiveNew.useAuiState[isMain]": ({ threads })=>threads.newThreadId === threads.mainThreadId
    }["ThreadListPrimitiveNew.useAuiState[isMain]"]);
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].button, {
        type: "button",
        ...isMain ? {
            "data-active": "true",
            "aria-current": "true"
        } : null,
        ...props,
        ref: forwardedRef,
        disabled: disabled,
        onClick: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$primitive$40$1$2e$1$2e$3$2f$node_modules$2f40$radix$2d$ui$2f$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["composeEventHandlers"])(onClick, ()=>{
            aui.threads().switchToNewThread();
        })
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list/thread-list-new.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "BSVIE31GCueWSaeG87vh3Z1i838=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
})), "BSVIE31GCueWSaeG87vh3Z1i838=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c1 = ThreadListPrimitiveNew;
ThreadListPrimitiveNew.displayName = "ThreadListPrimitive.New";
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadListPrimitiveNew$forwardRef");
__turbopack_context__.k.register(_c1, "ThreadListPrimitiveNew");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/context/providers/thread-list-item-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListItemByIndexProvider",
    ()=>ThreadListItemByIndexProvider,
    "ThreadListItemRuntimeProvider",
    ()=>ThreadListItemRuntimeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/utils/react-assistant-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/derived.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$item$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/legacy-runtime/client/thread-list-item-runtime-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const ThreadListItemByIndexProvider = ({ index, archived, children })=>{
    _s();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])({
        threadListItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$derived$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Derived"])({
            source: "threads",
            query: {
                type: "index",
                index,
                archived
            },
            get: {
                "ThreadListItemByIndexProvider.useAui[aui]": (aui)=>aui.threads().item({
                        index,
                        archived
                    })
            }["ThreadListItemByIndexProvider.useAui[aui]"]
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/thread-list-item-provider.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThreadListItemByIndexProvider, "BbJ1x+sAPxy/dizeIXhuPkzme6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c = ThreadListItemByIndexProvider;
const ThreadListItemRuntimeProvider = ({ runtime, children })=>{
    _s1();
    const aui = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"])({
        threadListItem: (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$legacy$2d$runtime$2f$client$2f$thread$2d$list$2d$item$2d$runtime$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemClient"])({
            runtime
        })
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$utils$2f$react$2d$assistant$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuiProvider"], {
        value: aui,
        children: children
    }, void 0, false, {
        fileName: "[project]/packages/react/src/context/providers/thread-list-item-provider.tsx",
        lineNumber: 34,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(ThreadListItemRuntimeProvider, "BbJ1x+sAPxy/dizeIXhuPkzme6M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAui"]
    ];
});
_c1 = ThreadListItemRuntimeProvider;
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadListItemByIndexProvider");
__turbopack_context__.k.register(_c1, "ThreadListItemRuntimeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list/thread-list-items.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListPrimitiveItemByIndex",
    ()=>ThreadListPrimitiveItemByIndex,
    "ThreadListPrimitiveItems",
    ()=>ThreadListPrimitiveItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/store/src/use-aui-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$list$2d$item$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/context/providers/thread-list-item-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const ThreadListPrimitiveItemByIndex = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(({ index, archived = false, components })=>{
    const ThreadListItemComponent = components.ThreadListItem;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$context$2f$providers$2f$thread$2d$list$2d$item$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListItemByIndexProvider"], {
        index: index,
        archived: archived,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadListItemComponent, {}, void 0, false, {
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
_c = ThreadListPrimitiveItemByIndex;
ThreadListPrimitiveItemByIndex.displayName = "ThreadListPrimitive.ItemByIndex";
const ThreadListPrimitiveItems = ({ archived = false, components })=>{
    _s();
    const contentLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"])({
        "ThreadListPrimitiveItems.useAuiState[contentLength]": ({ threads })=>archived ? threads.archivedThreadIds.length : threads.threadIds.length
    }["ThreadListPrimitiveItems.useAuiState[contentLength]"]);
    const listElements = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ThreadListPrimitiveItems.useMemo[listElements]": ()=>{
            return Array.from({
                length: contentLength
            }, {
                "ThreadListPrimitiveItems.useMemo[listElements]": (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreadListPrimitiveItemByIndex, {
                        index: index,
                        archived: archived,
                        components: components
                    }, index, false, {
                        fileName: "[project]/packages/react/src/primitives/thread-list/thread-list-items.tsx",
                        lineNumber: 69,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
            }["ThreadListPrimitiveItems.useMemo[listElements]"]);
        }
    }["ThreadListPrimitiveItems.useMemo[listElements]"], [
        contentLength,
        archived,
        components
    ]);
    return listElements;
};
_s(ThreadListPrimitiveItems, "i6f9eJIizg7p0j+SmNZE3DMJICM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$store$2f$src$2f$use$2d$aui$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuiState"]
    ];
});
_c1 = ThreadListPrimitiveItems;
ThreadListPrimitiveItems.displayName = "ThreadListPrimitive.Items";
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadListPrimitiveItemByIndex");
__turbopack_context__.k.register(_c1, "ThreadListPrimitiveItems");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list/thread-list-root.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListPrimitiveRoot",
    ()=>ThreadListPrimitiveRoot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-primitive@2.1.4_@types+react-dom@19.2.3_@types+react@19.2.10__@types+re_c03ae1e81409297db11f5b545457f7ea/node_modules/@radix-ui/react-primitive/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.5_@babel+core@7.29.0_@opentelemetry+api@1.9.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use client";
;
;
;
const ThreadListPrimitiveRoot = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = (props, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$5_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$primitive$40$2$2e$1$2e$4_$40$types$2b$react$2d$dom$40$19$2e$2$2e$3_$40$types$2b$react$40$19$2e$2$2e$10_$5f40$types$2b$re_c03ae1e81409297db11f5b545457f7ea$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$primitive$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Primitive"].div, {
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/packages/react/src/primitives/thread-list/thread-list-root.tsx",
        lineNumber: 17,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = ThreadListPrimitiveRoot;
ThreadListPrimitiveRoot.displayName = "ThreadListPrimitive.Root";
var _c, _c1;
__turbopack_context__.k.register(_c, "ThreadListPrimitiveRoot$forwardRef");
__turbopack_context__.k.register(_c1, "ThreadListPrimitiveRoot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/react/src/primitives/thread-list/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ItemByIndex",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$items$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListPrimitiveItemByIndex"],
    "Items",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$items$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListPrimitiveItems"],
    "New",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$new$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListPrimitiveNew"],
    "Root",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreadListPrimitiveRoot"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$new$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list/thread-list-new.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$items$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list/thread-list-items.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$thread$2d$list$2d$root$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list/thread-list-root.tsx [app-client] (ecmascript)");
}),
"[project]/packages/react/src/primitives/thread-list/index.ts [app-client] (ecmascript) <export * as ThreadListPrimitive>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThreadListPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$react$2f$src$2f$primitives$2f$thread$2d$list$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/react/src/primitives/thread-list/index.ts [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=packages_deac20a2._.js.map