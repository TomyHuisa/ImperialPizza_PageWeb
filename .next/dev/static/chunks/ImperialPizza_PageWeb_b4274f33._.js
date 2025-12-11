(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProtectedRoute",
    ()=>ProtectedRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ProtectedRoute({ children, allowedRoles }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isAuthorized, setIsAuthorized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentRole, setCurrentRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProtectedRoute.useEffect": ()=>{
            // Check role from localStorage or URL params for demo purposes
            const urlParams = new URLSearchParams(window.location.search);
            const roleFromUrl = urlParams.get("role");
            const savedRole = localStorage.getItem("imperial-user-role");
            const role = roleFromUrl || savedRole || "customer";
            if (roleFromUrl) {
                localStorage.setItem("imperial-user-role", roleFromUrl);
            }
            setCurrentRole(role);
            setIsAuthorized(allowedRoles.includes(role));
        }
    }["ProtectedRoute.useEffect"], [
        allowedRoles
    ]);
    if (isAuthorized === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                className: "flex flex-col items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "h-8 w-8 animate-spin text-primary"
                    }, void 0, false, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                        lineNumber: 41,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "Verifying access..."
                    }, void 0, false, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                lineNumber: 40,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this);
    }
    if (!isAuthorized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-background flex items-center justify-center px-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    scale: 0.9,
                    opacity: 0
                },
                animate: {
                    scale: 1,
                    opacity: 1
                },
                className: "text-center max-w-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                            className: "h-10 w-10 text-destructive"
                        }, void 0, false, {
                            fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "font-serif text-2xl font-bold text-foreground mb-2",
                        children: "Access Restricted"
                    }, void 0, false, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground mb-6",
                        children: [
                            "This area is restricted to authorized staff only.",
                            currentRole && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "block mt-2 text-sm",
                                children: [
                                    "Your current role: ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium capitalize",
                                        children: currentRole
                                    }, void 0, false, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                                        lineNumber: 64,
                                        columnNumber: 36
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                                lineNumber: 63,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground",
                        children: [
                            "Access with: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                className: "bg-muted px-1 py-0.5 rounded",
                                children: "?role=kitchen"
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                                lineNumber: 69,
                                columnNumber: 26
                            }, this),
                            " or",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                className: "bg-muted px-1 py-0.5 rounded",
                                children: "?role=driver"
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/ImperialPizza_PageWeb/components/auth/protected-route.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(ProtectedRoute, "Iv5RuGlx5CrHSsr4qh0CVO4NDSo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProtectedRoute;
var _c;
__turbopack_context__.k.register(_c, "ProtectedRoute");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/lib/store/kitchen-store.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KitchenStoreProvider",
    ()=>KitchenStoreProvider,
    "useKitchenDispatch",
    ()=>useKitchenDispatch,
    "useKitchenState",
    ()=>useKitchenState,
    "useKitchenStore",
    ()=>useKitchenStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
const initialState = {
    orderQueue: [],
    completedOrders: []
};
function kitchenReducer(state, action) {
    switch(action.type){
        case "ADD_ORDER":
            // Add to queue sorted by timestamp
            const newQueue = [
                ...state.orderQueue,
                action.payload
            ].sort((a, b)=>new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            return {
                ...state,
                orderQueue: newQueue
            };
        case "MARK_READY":
            {
                const order = state.orderQueue.find((o)=>o.id === action.payload);
                if (!order) return state;
                return {
                    orderQueue: state.orderQueue.filter((o)=>o.id !== action.payload),
                    completedOrders: [
                        {
                            ...order,
                            status: "ready"
                        },
                        ...state.completedOrders
                    ]
                };
            }
        case "SET_ORDERS":
            return {
                ...state,
                orderQueue: action.payload.filter((o)=>o.status === "preparing" || o.status === "confirmed")
            };
        default:
            return state;
    }
}
const KitchenStateContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const KitchenDispatchContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function KitchenStoreProvider({ children }) {
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(kitchenReducer, initialState);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KitchenStateContext.Provider, {
        value: state,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KitchenDispatchContext.Provider, {
            value: dispatch,
            children: children
        }, void 0, false, {
            fileName: "[project]/ImperialPizza_PageWeb/lib/store/kitchen-store.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/lib/store/kitchen-store.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(KitchenStoreProvider, "6JWkGZ32UPfojeNx+xqn8ZU8A0Q=");
_c = KitchenStoreProvider;
function useKitchenState() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(KitchenStateContext);
    if (!context) {
        throw new Error("useKitchenState must be used within KitchenStoreProvider");
    }
    return context;
}
_s1(useKitchenState, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function useKitchenDispatch() {
    _s2();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(KitchenDispatchContext);
    if (!context) {
        throw new Error("useKitchenDispatch must be used within KitchenStoreProvider");
    }
    return context;
}
_s2(useKitchenDispatch, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function useKitchenStore() {
    _s3();
    return {
        state: useKitchenState(),
        dispatch: useKitchenDispatch()
    };
}
_s3(useKitchenStore, "Z978zmpGXS04wvY/ZsOVernplc4=", false, function() {
    return [
        useKitchenState,
        useKitchenDispatch
    ];
});
var _c;
__turbopack_context__.k.register(_c, "KitchenStoreProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/hooks/use-websocket.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mockWS",
    ()=>mockWS,
    "useWebSocket",
    ()=>useWebSocket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
// Mock WebSocket simulation
class MockWebSocket {
    listeners = new Map();
    intervalIds = [];
    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        return ()=>{
            this.listeners.get(event)?.delete(callback);
        };
    }
    emit(event, message) {
        this.listeners.get(event)?.forEach((cb)=>cb(message));
        this.listeners.get("*")?.forEach((cb)=>cb(message));
    }
    startDriverSimulation(orderId, startLat, startLng, endLat, endLng) {
        let progress = 0;
        const steps = 20;
        const intervalId = setInterval(()=>{
            progress++;
            const lat = startLat + (endLat - startLat) * (progress / steps);
            const lng = startLng + (endLng - startLng) * (progress / steps);
            this.emit("driver-location", {
                type: "driver-location",
                payload: {
                    orderId,
                    lat,
                    lng
                }
            });
            if (progress >= steps) {
                clearInterval(intervalId);
                this.emit("order-update", {
                    type: "order-update",
                    payload: {
                        id: orderId,
                        status: "delivered"
                    }
                });
            }
        }, 2000);
        this.intervalIds.push(intervalId);
    }
    cleanup() {
        this.intervalIds.forEach((id)=>clearInterval(id));
        this.intervalIds = [];
    }
}
const mockWS = new MockWebSocket();
function useWebSocket() {
    _s();
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const callbacksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWebSocket.useEffect": ()=>{
            const timeout = setTimeout({
                "useWebSocket.useEffect.timeout": ()=>setIsConnected(true)
            }["useWebSocket.useEffect.timeout"], 500);
            return ({
                "useWebSocket.useEffect": ()=>{
                    clearTimeout(timeout);
                    mockWS.cleanup();
                }
            })["useWebSocket.useEffect"];
        }
    }["useWebSocket.useEffect"], []);
    const subscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWebSocket.useCallback[subscribe]": (event, callback)=>{
            callbacksRef.current.set(event, callback);
            return mockWS.subscribe(event, callback);
        }
    }["useWebSocket.useCallback[subscribe]"], []);
    const emit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWebSocket.useCallback[emit]": (event, data)=>{
            mockWS.emit(event, data);
        }
    }["useWebSocket.useCallback[emit]"], []);
    const simulateOrderProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWebSocket.useCallback[simulateOrderProgress]": (order, isTakeaway = false)=>{
            const deliveryStatuses = [
                "confirmed",
                "preparing",
                "ready",
                "out-for-delivery",
                "delivered"
            ];
            const takeawayStatuses = [
                "confirmed",
                "preparing",
                "ready"
            ];
            const statuses = isTakeaway ? takeawayStatuses : deliveryStatuses;
            let currentIndex = 0;
            const progressOrder = {
                "useWebSocket.useCallback[simulateOrderProgress].progressOrder": ()=>{
                    if (currentIndex >= statuses.length) return;
                    const updatedOrder = {
                        ...order,
                        status: statuses[currentIndex],
                        updatedAt: new Date().toISOString()
                    };
                    mockWS.emit("order-update", {
                        type: "order-update",
                        payload: updatedOrder
                    });
                    // For takeaway orders, emit notification when ready
                    if (isTakeaway && statuses[currentIndex] === "ready") {
                        mockWS.emit("takeaway-ready", {
                            type: "takeaway-ready",
                            payload: {
                                orderId: order.id,
                                phone: order.customerPhone
                            }
                        });
                        return; // Stop progression for takeaway - customer picks up
                    }
                    if (!isTakeaway && statuses[currentIndex] === "out-for-delivery") {
                        mockWS.startDriverSimulation(order.id, 40.7128 + Math.random() * 0.01, -74.006 + Math.random() * 0.01, order.coordinates.lat, order.coordinates.lng);
                    }
                    currentIndex++;
                    if (currentIndex < statuses.length) {
                        setTimeout(progressOrder, 5000 + Math.random() * 3000);
                    }
                }
            }["useWebSocket.useCallback[simulateOrderProgress].progressOrder"];
            setTimeout(progressOrder, 2000);
        }
    }["useWebSocket.useCallback[simulateOrderProgress]"], []);
    return {
        isConnected,
        subscribe,
        emit,
        simulateOrderProgress
    };
}
_s(useWebSocket, "H3FjJZvf7AD7sYFyRj88K//98GM=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KitchenOrderCard",
    ()=>KitchenOrderCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chef$2d$hat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChefHat$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/chef-hat.js [app-client] (ecmascript) <export default as ChefHat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const KitchenOrderCard = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function KitchenOrderCard({ order, onMarkReady, style }) {
    _s();
    const [isMarking, setIsMarking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleMarkReady = async ()=>{
        setIsMarking(true);
        // Optimistic UI update
        onMarkReady(order.id);
    };
    const timeElapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    const isUrgent = timeElapsed > 15;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        layout: true,
        initial: {
            x: -20,
            opacity: 0
        },
        animate: {
            x: 0,
            opacity: 1
        },
        exit: {
            x: 20,
            opacity: 0
        },
        style: style,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card border rounded-xl p-4 shadow-sm", isUrgent ? "border-destructive/50 bg-destructive/5" : "border-border"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-sm font-bold text-primary",
                                children: [
                                    "#",
                                    order.id.slice(-6)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            isUrgent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "px-2 py-0.5 text-xs font-medium rounded-full bg-destructive/10 text-destructive",
                                children: "Urgent"
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 text-sm text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    timeElapsed,
                                    "m ago"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 mb-3 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                className: "h-3.5 w-3.5"
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: order.customerName
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-muted-foreground truncate",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                className: "h-3.5 w-3.5 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                children: order.deliveryAddress
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 mb-4",
                children: order.items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-2 p-2 rounded-lg bg-muted/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold text-primary min-w-[1.5rem]",
                                children: [
                                    item.quantity,
                                    "x"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium text-sm text-foreground",
                                        children: item.pizza.name
                                    }, void 0, false, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                        lineNumber: 77,
                                        columnNumber: 15
                                    }, this),
                                    item.selectedToppings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground mt-0.5",
                                        children: [
                                            "+ ",
                                            item.selectedToppings.map((t)=>t.name).join(", ")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                        lineNumber: 79,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        ]
                    }, `${item.id}-${index}`, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                whileHover: {
                    scale: 1.02
                },
                whileTap: {
                    scale: 0.98
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    onClick: handleMarkReady,
                    disabled: isMarking,
                    className: "w-full bg-green-600 hover:bg-green-700 text-white",
                    children: isMarking ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chef$2d$hat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChefHat$3e$__["ChefHat"], {
                                className: "h-4 w-4 mr-2 animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 97,
                                columnNumber: 15
                            }, this),
                            "Marking..."
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                className: "h-4 w-4 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                                lineNumber: 102,
                                columnNumber: 15
                            }, this),
                            "Mark as Ready"
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}, "yKVMuGdGGnknbwmgkUYRs+81Ql4=")), "yKVMuGdGGnknbwmgkUYRs+81Ql4=");
_c1 = KitchenOrderCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "KitchenOrderCard$memo");
__turbopack_context__.k.register(_c1, "KitchenOrderCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KitchenDashboard",
    ()=>KitchenDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chef$2d$hat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChefHat$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/chef-hat.js [app-client] (ecmascript) <export default as ChefHat>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/bell.js [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$kitchen$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/store/kitchen-store.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$websocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/hooks/use-websocket.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$data$2f$pizzas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/data/pizzas.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$kitchen$2f$kitchen$2d$order$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-order-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/hooks/use-toast.ts [app-client] (ecmascript)");
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
function KitchenDashboardContent() {
    _s();
    const { state, dispatch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$kitchen$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useKitchenStore"])();
    const { isConnected, subscribe, emit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$websocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWebSocket"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        pending: 0,
        completed: 0,
        avgTime: 0
    });
    // Subscribe to new orders
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KitchenDashboardContent.useEffect": ()=>{
            const unsubscribe = subscribe("new-order", {
                "KitchenDashboardContent.useEffect.unsubscribe": (msg)=>{
                    if (msg.type === "new-order") {
                        dispatch({
                            type: "ADD_ORDER",
                            payload: msg.payload
                        });
                        toast({
                            title: "New Order!",
                            description: `Order #${msg.payload.id.slice(-6)} received`
                        });
                    }
                }
            }["KitchenDashboardContent.useEffect.unsubscribe"]);
            return unsubscribe;
        }
    }["KitchenDashboardContent.useEffect"], [
        subscribe,
        dispatch,
        toast
    ]);
    // Update stats
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KitchenDashboardContent.useEffect": ()=>{
            setStats({
                pending: state.orderQueue.length,
                completed: state.completedOrders.length,
                avgTime: state.completedOrders.length > 0 ? 12 : 0
            });
        }
    }["KitchenDashboardContent.useEffect"], [
        state.orderQueue,
        state.completedOrders
    ]);
    const handleMarkReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "KitchenDashboardContent.useCallback[handleMarkReady]": (orderId)=>{
            // Optimistic update
            dispatch({
                type: "MARK_READY",
                payload: orderId
            });
            // Emit WebSocket event
            emit("order-ready", {
                type: "order-ready",
                payload: {
                    orderId
                }
            });
            toast({
                title: "Order Ready!",
                description: `Order #${orderId.slice(-6)} is ready for delivery`
            });
        }
    }["KitchenDashboardContent.useCallback[handleMarkReady]"], [
        dispatch,
        emit,
        toast
    ]);
    // Demo: Add mock order
    const addMockOrder = ()=>{
        const randomPizza = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$data$2f$pizzas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pizzas"][Math.floor(Math.random() * __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$data$2f$pizzas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pizzas"].length)];
        const mockOrder = {
            id: `ORD-${Date.now()}`,
            items: [
                {
                    id: `item-${Date.now()}`,
                    pizza: randomPizza,
                    quantity: Math.floor(Math.random() * 3) + 1,
                    selectedToppings: [],
                    totalPrice: randomPizza.price
                }
            ],
            status: "confirmed",
            totalPrice: randomPizza.price,
            discountApplied: 0,
            pointsUsed: 0,
            pointsEarned: Math.floor(randomPizza.price),
            customerName: [
                "John Doe",
                "Jane Smith",
                "Mike Johnson",
                "Sarah Wilson"
            ][Math.floor(Math.random() * 4)],
            customerPhone: "+1 555-0123",
            deliveryAddress: "123 Main St, Apt 4B",
            coordinates: {
                lat: 40.7128,
                lng: -74.006
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString()
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$websocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockWS"].emit("new-order", {
            type: "new-order",
            payload: mockOrder
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-4 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chef$2d$hat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChefHat$3e$__["ChefHat"], {
                                            className: "h-5 w-5 text-primary"
                                        }, void 0, false, {
                                            fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                            lineNumber: 102,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 101,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "font-serif text-xl font-bold text-foreground",
                                                children: "Kitchen Dashboard"
                                            }, void 0, false, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 105,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Imperial Pizzeria"
                                            }, void 0, false, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 106,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 104,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`
                                            }, void 0, false, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 113,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-muted-foreground",
                                                children: isConnected ? "Connected" : "Connecting..."
                                            }, void 0, false, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 112,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: addMockOrder,
                                        size: "sm",
                                        variant: "outline",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "h-4 w-4 mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 119,
                                                columnNumber: 17
                                            }, this),
                                            "Demo Order"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 py-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-4 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    y: 20,
                                    opacity: 0
                                },
                                animate: {
                                    y: 0,
                                    opacity: 1
                                },
                                className: "bg-card border border-border rounded-xl p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                                className: "h-5 w-5 text-orange-500"
                                            }, void 0, false, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-foreground",
                                                    children: stats.pending
                                                }, void 0, false, {
                                                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                    lineNumber: 140,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Pending Orders"
                                                }, void 0, false, {
                                                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                            lineNumber: 139,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    y: 20,
                                    opacity: 0
                                },
                                animate: {
                                    y: 0,
                                    opacity: 1
                                },
                                transition: {
                                    delay: 0.1
                                },
                                className: "bg-card border border-border rounded-xl p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "h-5 w-5 text-green-500"
                                            }, void 0, false, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 154,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                            lineNumber: 153,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-foreground",
                                                    children: stats.completed
                                                }, void 0, false, {
                                                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Completed Today"
                                                }, void 0, false, {
                                                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                            lineNumber: 156,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    y: 20,
                                    opacity: 0
                                },
                                animate: {
                                    y: 0,
                                    opacity: 1
                                },
                                transition: {
                                    delay: 0.2
                                },
                                className: "bg-card border border-border rounded-xl p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                className: "h-5 w-5 text-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xl font-bold text-foreground",
                                                    children: [
                                                        stats.avgTime,
                                                        "m"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                    lineNumber: 174,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: "Avg. Prep Time"
                                                }, void 0, false, {
                                                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                            lineNumber: 173,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-semibold text-lg text-foreground mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 184,
                                        columnNumber: 13
                                    }, this),
                                    "Order Queue",
                                    state.orderQueue.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-primary-foreground",
                                        children: state.orderQueue.length
                                    }, void 0, false, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 187,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            state.orderQueue.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: 1
                                },
                                className: "text-center py-16 bg-card border border-border rounded-xl",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chef$2d$hat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChefHat$3e$__["ChefHat"], {
                                        className: "h-16 w-16 text-muted-foreground/30 mx-auto mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 199,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-medium text-foreground mb-1",
                                        children: "No pending orders"
                                    }, void 0, false, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 200,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-muted-foreground",
                                        children: "New orders will appear here automatically"
                                    }, void 0, false, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: addMockOrder,
                                        variant: "outline",
                                        className: "mt-4 bg-transparent",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "h-4 w-4 mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 203,
                                                columnNumber: 17
                                            }, this),
                                            "Add Demo Order"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 202,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                    mode: "popLayout",
                                    children: state.orderQueue.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$kitchen$2f$kitchen$2d$order$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KitchenOrderCard"], {
                                            order: order,
                                            onMarkReady: handleMarkReady
                                        }, order.id, false, {
                                            fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                            lineNumber: 211,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                    lineNumber: 209,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    state.completedOrders.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-semibold text-lg text-foreground mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                        className: "h-5 w-5 text-green-500"
                                    }, void 0, false, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, this),
                                    "Recently Completed"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: state.completedOrders.slice(0, 5).map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            y: -10
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        className: "flex items-center justify-between p-3 bg-card border border-border rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                        className: "h-5 w-5 text-green-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-mono text-sm font-medium",
                                                        children: [
                                                            "#",
                                                            order.id.slice(-6)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                        lineNumber: 235,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-muted-foreground",
                                                        children: order.customerName
                                                    }, void 0, false, {
                                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 233,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Ready for pickup"
                                            }, void 0, false, {
                                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                                lineNumber: 238,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, order.id, true, {
                                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                        lineNumber: 227,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                                lineNumber: 225,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_s(KitchenDashboardContent, "Fd8ipLJDOxE8Nm4oH08Cn6MJpTY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$kitchen$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useKitchenStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$websocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWebSocket"],
        __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = KitchenDashboardContent;
function KitchenDashboard() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$kitchen$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KitchenStoreProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KitchenDashboardContent, {}, void 0, false, {
            fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
            lineNumber: 252,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/components/kitchen/kitchen-dashboard.tsx",
        lineNumber: 251,
        columnNumber: 5
    }, this);
}
_c1 = KitchenDashboard;
var _c, _c1;
__turbopack_context__.k.register(_c, "KitchenDashboardContent");
__turbopack_context__.k.register(_c1, "KitchenDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=ImperialPizza_PageWeb_b4274f33._.js.map