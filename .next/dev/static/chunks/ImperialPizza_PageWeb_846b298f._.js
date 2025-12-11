(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/ImperialPizza_PageWeb/lib/data/users.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "demoUsers",
    ()=>demoUsers
]);
const demoUsers = [
    {
        id: "user-1",
        name: "John Customer",
        email: "customer@imperial.pizza",
        phone: "+1 555-0100",
        role: "customer",
        points: 250,
        password: "customer123"
    },
    {
        id: "admin-1",
        name: "Maria Admin",
        email: "admin@imperial.pizza",
        phone: "+1 555-0101",
        role: "admin",
        points: 250,
        password: "admin123"
    },
    {
        id: "kitchen-1",
        name: "Chef Antonio",
        email: "kitchen@imperial.pizza",
        phone: "+1 555-0102",
        role: "kitchen",
        points: 250,
        password: "kitchen123"
    },
    {
        id: "driver-1",
        name: "Marco Driver",
        email: "driver@imperial.pizza",
        phone: "+1 555-0103",
        role: "driver",
        points: 250,
        password: "driver123"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/hooks/use-toast.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reducer",
    ()=>reducer,
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST'
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case 'DISMISS_TOAST':
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case 'REMOVE_TOAST':
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: 'UPDATE_TOAST',
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: 'DISMISS_TOAST',
            toastId: id
        });
    dispatch({
        type: 'ADD_TOAST',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    _s();
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: 'DISMISS_TOAST',
                toastId
            })
    };
}
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/lib/store/auth-store.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth,
    "useAuthDispatch",
    ()=>useAuthDispatch,
    "useAuthState",
    ()=>useAuthState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$data$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/data/users.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/hooks/use-toast.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
;
// Creamos un mock inicial para pb
const createPbClient = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        // Intentar importar PocketBase dinámicamente
        const PocketBase = __turbopack_context__.r("[project]/ImperialPizza_PageWeb/node_modules/pocketbase/dist/pocketbase.es.mjs [app-client] (ecmascript)").default;
        const POCKETBASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        const pb = new PocketBase(POCKETBASE_URL);
        pb.autoCancellation(false);
        return pb;
    } catch (error) {
        console.warn('No se pudo crear cliente PocketBase:', error);
        return null;
    }
};
const initialState = {
    user: null,
    is_authenticated: false,
    is_loading: true
};
function authReducer(state, action) {
    switch(action.type){
        case "LOGIN":
            return {
                ...state,
                user: action.payload,
                is_authenticated: true,
                is_loading: false
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                is_authenticated: false,
                is_loading: false
            };
        case "SET_LOADING":
            return {
                ...state,
                is_loading: action.payload
            };
        case "LOAD_FROM_STORAGE":
            return {
                ...state,
                user: action.payload,
                is_authenticated: !!action.payload,
                is_loading: false
            };
        default:
            return state;
    }
}
const AuthStateContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const AuthDispatchContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(authReducer, initialState);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const loadSession = {
                "AuthProvider.useEffect.loadSession": async ()=>{
                    try {
                        // Primero intentar con PocketBase si está disponible
                        const pb = createPbClient();
                        if (pb?.authStore?.isValid) {
                            try {
                                await pb.collection('users').authRefresh();
                                const userModel = pb.authStore.model;
                                if (userModel) {
                                    const authUser = {
                                        id: userModel.id,
                                        name: userModel.name,
                                        email: userModel.email,
                                        role: userModel.role,
                                        points: userModel.points || 250
                                    };
                                    dispatch({
                                        type: "LOAD_FROM_STORAGE",
                                        payload: authUser
                                    });
                                    return;
                                }
                            } catch (pbError) {
                                console.warn('Sesión de PocketBase expirada:', pbError);
                                pb.authStore.clear();
                            }
                        }
                        // Fallback a localStorage
                        const savedUser = localStorage.getItem("imperial_auth_user");
                        if (savedUser) {
                            try {
                                const user = JSON.parse(savedUser);
                                dispatch({
                                    type: "LOAD_FROM_STORAGE",
                                    payload: user
                                });
                            } catch  {
                                dispatch({
                                    type: "LOAD_FROM_STORAGE",
                                    payload: null
                                });
                            }
                        } else {
                            dispatch({
                                type: "SET_LOADING",
                                payload: false
                            });
                        }
                    } catch (error) {
                        console.error('Error cargando sesión:', error);
                        dispatch({
                            type: "SET_LOADING",
                            payload: false
                        });
                    }
                }
            }["AuthProvider.useEffect.loadSession"];
            loadSession();
        }
    }["AuthProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (state.user) {
                localStorage.setItem("imperial_auth_user", JSON.stringify(state.user));
            } else if (!state.is_loading) {
                localStorage.removeItem("imperial_auth_user");
            }
        }
    }["AuthProvider.useEffect"], [
        state.user,
        state.is_loading
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthStateContext.Provider, {
        value: state,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthDispatchContext.Provider, {
            value: dispatch,
            children: children
        }, void 0, false, {
            fileName: "[project]/ImperialPizza_PageWeb/lib/store/auth-store.tsx",
            lineNumber: 127,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/lib/store/auth-store.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "xSEdQ1MqmcDmeEwov6kb32YS1J8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = AuthProvider;
function useAuthState() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthStateContext);
    if (!context) {
        throw new Error("useAuthState debe usarse dentro de AuthProvider");
    }
    return context;
}
_s1(useAuthState, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function useAuthDispatch() {
    _s2();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthDispatchContext);
    if (!context) {
        throw new Error("useAuthDispatch debe usarse dentro de AuthProvider");
    }
    return context;
}
_s2(useAuthDispatch, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function useAuth() {
    _s3();
    const state = useAuthState();
    const dispatch = useAuthDispatch();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const login = async (email, password)=>{
        try {
            dispatch({
                type: "SET_LOADING",
                payload: true
            });
            // Primero intentar con PocketBase
            try {
                const pb = createPbClient();
                if (pb) {
                    const authData = await pb.collection('users').authWithPassword(email, password);
                    const authUser = {
                        id: authData.record.id,
                        name: authData.record.name,
                        email: authData.record.email,
                        role: authData.record.role,
                        points: authData.record.points || 250
                    };
                    dispatch({
                        type: "LOGIN",
                        payload: authUser
                    });
                    toast({
                        title: "Inicio de sesión exitoso",
                        description: `Bienvenido ${authData.record.name}`
                    });
                    return {
                        success: true
                    };
                }
            } catch (pbError) {
                console.warn('Autenticación con PocketBase falló, probando usuarios demo:', pbError);
            }
            // Fallback a usuarios demo
            const user = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$data$2f$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["demoUsers"].find((u)=>u.email === email && u.password === password);
            if (user) {
                const authUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    points: user.points
                };
                dispatch({
                    type: "LOGIN",
                    payload: authUser
                });
                toast({
                    title: "Modo demo activado",
                    description: `Bienvenido ${user.name} (modo demo)`
                });
                return {
                    success: true
                };
            }
            return {
                success: false,
                error: "Correo o contraseña incorrectos"
            };
        } catch (err) {
            console.error('Error en login:', err);
            return {
                success: false,
                error: "Ocurrió un error durante el inicio de sesión"
            };
        } finally{
            dispatch({
                type: "SET_LOADING",
                payload: false
            });
        }
    };
    const logout = ()=>{
        // Intentar limpiar PocketBase
        try {
            const pb = createPbClient();
            if (pb) pb.authStore.clear();
        } catch (error) {
            console.warn('Error limpiando PocketBase:', error);
        }
        // Limpiar estado local
        dispatch({
            type: "LOGOUT"
        });
        toast({
            title: "Sesión cerrada",
            description: "Has cerrado sesión exitosamente"
        });
    };
    const register = async (name, email, password, phone)=>{
        try {
            // Intentar registro con PocketBase
            try {
                const pb = createPbClient();
                if (pb) {
                    const userData = {
                        name,
                        email,
                        password,
                        passwordConfirm: password,
                        role: 'customer',
                        points: 250,
                        phone: phone || ''
                    };
                    await pb.collection('users').create(userData);
                    // Autenticar después del registro
                    return await login(email, password);
                }
            } catch (pbError) {
                console.warn('Registro con PocketBase falló, creando usuario local:', pbError);
            }
            // Fallback a usuario local
            const newUser = {
                id: `user-${Date.now()}`,
                name,
                email,
                role: 'customer',
                points: 250
            };
            dispatch({
                type: "LOGIN",
                payload: newUser
            });
            return {
                success: true
            };
        } catch (error) {
            console.error('Error en registro:', error);
            return {
                success: false,
                error: "El registro falló"
            };
        }
    };
    return {
        user: state.user,
        is_authenticated: state.is_authenticated,
        is_loading: state.is_loading,
        login,
        logout,
        register
    };
}
_s3(useAuth, "W8g4O4/6cFFd1KNAnmje49tp+Ag=", false, function() {
    return [
        useAuthState,
        useAuthDispatch,
        __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/lib/store/app-store.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PointsProvider",
    ()=>PointsProvider,
    "usePoints",
    ()=>usePoints
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$auth$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/store/auth-store.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/hooks/use-toast.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
// Función para obtener cliente PocketBase
const getPbClient = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const PocketBase = __turbopack_context__.r("[project]/ImperialPizza_PageWeb/node_modules/pocketbase/dist/pocketbase.es.mjs [app-client] (ecmascript)").default;
        const POCKETBASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
        const pb = new PocketBase(POCKETBASE_URL);
        pb.autoCancellation(false);
        return pb;
    } catch (error) {
        return null;
    }
};
const PointsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function PointsProvider({ children }) {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$auth$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [points, setPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(250);
    const [is_loading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [points_history, setPointsHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Cargar puntos del usuario
    const refreshPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PointsProvider.useCallback[refreshPoints]": async ()=>{
            try {
                setIsLoading(true);
                if (!user?.id) {
                    // Si no hay usuario, cargar del localStorage
                    const savedPoints = localStorage.getItem("imperial_points");
                    if (savedPoints) {
                        setPoints(Number.parseInt(savedPoints, 10));
                    }
                    return;
                }
                // Intentar con PocketBase
                const pb = getPbClient();
                if (pb) {
                    try {
                        const userRecord = await pb.collection('users').getOne(user.id);
                        setPoints(userRecord.points || 250);
                        // Obtener historial de puntos
                        const history = await pb.collection('points_history').getFullList({
                            filter: `user = "${user.id}"`,
                            sort: '-created'
                        });
                        setPointsHistory(history.map({
                            "PointsProvider.useCallback[refreshPoints]": (record)=>({
                                    amount: record.amount,
                                    type: record.type,
                                    description: record.description || '',
                                    timestamp: record.created
                                })
                        }["PointsProvider.useCallback[refreshPoints]"]));
                        return;
                    } catch (error) {
                        console.warn('No se pudo conectar a PocketBase, usando puntos locales:', error);
                    }
                }
                // Fallback a localStorage
                const savedPoints = localStorage.getItem("imperial_points");
                const savedHistory = localStorage.getItem("imperial_points_history");
                if (savedPoints) setPoints(Number.parseInt(savedPoints, 10));
                if (savedHistory) setPointsHistory(JSON.parse(savedHistory));
                toast({
                    title: "Modo offline",
                    description: "Usando puntos locales",
                    variant: "default"
                });
            } catch (error) {
                console.error('Error refrescando puntos:', error);
            } finally{
                setIsLoading(false);
            }
        }
    }["PointsProvider.useCallback[refreshPoints]"], [
        user?.id,
        toast
    ]);
    // Obtener puntos actuales del usuario
    const getCurrentUserPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PointsProvider.useCallback[getCurrentUserPoints]": async ()=>{
            try {
                if (!user?.id) {
                    const savedPoints = localStorage.getItem("imperial_points");
                    return savedPoints ? Number.parseInt(savedPoints, 10) : 250;
                }
                const pb = getPbClient();
                if (pb) {
                    try {
                        const userRecord = await pb.collection('users').getOne(user.id);
                        return userRecord.points || 250;
                    } catch (error) {
                        console.warn('Error obteniendo puntos de PocketBase:', error);
                    }
                }
                const savedPoints = localStorage.getItem("imperial_points");
                return savedPoints ? Number.parseInt(savedPoints, 10) : 250;
            } catch (error) {
                console.error('Error en getCurrentUserPoints:', error);
                return 250;
            }
        }
    }["PointsProvider.useCallback[getCurrentUserPoints]"], [
        user?.id
    ]);
    // Agregar puntos
    const addPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PointsProvider.useCallback[addPoints]": async (amount, description)=>{
            try {
                if (amount <= 0) return;
                if (!user?.id) {
                    // Modo local
                    const newPoints = points + amount;
                    setPoints(newPoints);
                    localStorage.setItem("imperial_points", newPoints.toString());
                    const newHistory = [
                        ...points_history,
                        {
                            amount,
                            type: "earned",
                            description: description || "Puntos ganados",
                            timestamp: new Date().toISOString()
                        }
                    ];
                    setPointsHistory(newHistory);
                    localStorage.setItem("imperial_points_history", JSON.stringify(newHistory));
                    return;
                }
                // Intentar con PocketBase
                const pb = getPbClient();
                if (pb) {
                    try {
                        const userRecord = await pb.collection('users').getOne(user.id);
                        const newPoints = (userRecord.points || 250) + amount;
                        await pb.collection('users').update(user.id, {
                            points: newPoints
                        });
                        setPoints(newPoints);
                        // Registrar en historial
                        if (pb.authStore.token) {
                            await pb.collection('points_history').create({
                                user: user.id,
                                amount,
                                type: 'earned',
                                description: description || "Puntos ganados del pedido"
                            });
                        }
                        return;
                    } catch (pbError) {
                        console.warn('Error con PocketBase, usando modo local:', pbError);
                    }
                }
                // Fallback local
                const newPoints = points + amount;
                setPoints(newPoints);
                localStorage.setItem("imperial_points", newPoints.toString());
            } catch (error) {
                console.error('Error agregando puntos:', error);
                throw error;
            }
        }
    }["PointsProvider.useCallback[addPoints]"], [
        points,
        points_history,
        user?.id
    ]);
    // Usar puntos
    const usePoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PointsProvider.useCallback[usePoints]": async (amount, description)=>{
            try {
                if (amount <= 0) return true;
                if (!user?.id) {
                    // Modo local
                    if (points >= amount) {
                        const newPoints = points - amount;
                        setPoints(newPoints);
                        localStorage.setItem("imperial_points", newPoints.toString());
                        const newHistory = [
                            ...points_history,
                            {
                                amount,
                                type: "spent",
                                description: description || "Puntos usados",
                                timestamp: new Date().toISOString()
                            }
                        ];
                        setPointsHistory(newHistory);
                        localStorage.setItem("imperial_points_history", JSON.stringify(newHistory));
                        return true;
                    }
                    return false;
                }
                // Intentar con PocketBase
                const pb = getPbClient();
                if (pb) {
                    try {
                        const userRecord = await pb.collection('users').getOne(user.id);
                        if (userRecord.points >= amount) {
                            const newPoints = userRecord.points - amount;
                            await pb.collection('users').update(user.id, {
                                points: newPoints
                            });
                            setPoints(newPoints);
                            // Registrar en historial
                            if (pb.authStore.token) {
                                await pb.collection('points_history').create({
                                    user: user.id,
                                    amount,
                                    type: 'spent',
                                    description: description || "Puntos usados para descuento"
                                });
                            }
                            return true;
                        }
                        return false;
                    } catch (pbError) {
                        console.warn('Error con PocketBase, usando modo local:', pbError);
                    }
                }
                // Fallback local
                if (points >= amount) {
                    const newPoints = points - amount;
                    setPoints(newPoints);
                    localStorage.setItem("imperial_points", newPoints.toString());
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Error usando puntos:', error);
                return false;
            }
        }
    }["PointsProvider.useCallback[usePoints]"], [
        points,
        points_history,
        user?.id
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PointsProvider.useEffect": ()=>{
            refreshPoints();
        }
    }["PointsProvider.useEffect"], [
        refreshPoints
    ]);
    const value = {
        points,
        is_loading,
        addPoints,
        usePoints,
        points_history,
        refreshPoints,
        getCurrentUserPoints
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PointsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/lib/store/app-store.tsx",
        lineNumber: 267,
        columnNumber: 5
    }, this);
}
_s(PointsProvider, "M9outn5QBwMd09NVH3WZFVwieN0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$auth$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = PointsProvider;
function usePoints() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PointsContext);
    if (!context) {
        throw new Error("usePoints debe usarse dentro de PointsProvider");
    }
    return context;
}
_s1(usePoints, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "PointsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/lib/store/points-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PointsProvider",
    ()=>PointsProvider,
    "usePoints",
    ()=>usePoints
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const PointsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function PointsProvider({ children }) {
    _s();
    const [points, setPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(250);
    const [pointsHistory, setPointsHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PointsProvider.useEffect": ()=>{
            const savedPoints = localStorage.getItem("imperial-points");
            const savedHistory = localStorage.getItem("imperial-points-history");
            if (savedPoints) {
                setPoints(Number.parseInt(savedPoints, 10));
            }
            if (savedHistory) {
                setPointsHistory(JSON.parse(savedHistory));
            }
        }
    }["PointsProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PointsProvider.useEffect": ()=>{
            localStorage.setItem("imperial-points", points.toString());
            localStorage.setItem("imperial-points-history", JSON.stringify(pointsHistory));
        }
    }["PointsProvider.useEffect"], [
        points,
        pointsHistory
    ]);
    const addPoints = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PointsProvider.useCallback[addPoints]": (amount)=>{
            setPoints({
                "PointsProvider.useCallback[addPoints]": (prev)=>prev + amount
            }["PointsProvider.useCallback[addPoints]"]);
            setPointsHistory({
                "PointsProvider.useCallback[addPoints]": (prev)=>[
                        ...prev,
                        {
                            amount,
                            type: "earned",
                            timestamp: new Date().toISOString()
                        }
                    ]
            }["PointsProvider.useCallback[addPoints]"]);
        }
    }["PointsProvider.useCallback[addPoints]"], []);
    const usePointsFunc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PointsProvider.useCallback[usePointsFunc]": (amount)=>{
            if (points >= amount) {
                setPoints({
                    "PointsProvider.useCallback[usePointsFunc]": (prev)=>prev - amount
                }["PointsProvider.useCallback[usePointsFunc]"]);
                setPointsHistory({
                    "PointsProvider.useCallback[usePointsFunc]": (prev)=>[
                            ...prev,
                            {
                                amount,
                                type: "spent",
                                timestamp: new Date().toISOString()
                            }
                        ]
                }["PointsProvider.useCallback[usePointsFunc]"]);
                return true;
            }
            return false;
        }
    }["PointsProvider.useCallback[usePointsFunc]"], [
        points
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PointsContext.Provider, {
        value: {
            points,
            addPoints,
            usePoints: usePointsFunc,
            pointsHistory
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/lib/store/points-context.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(PointsProvider, "sPn1a/SIOc+14bXH+FCePtrP/jw=");
_c = PointsProvider;
function usePoints() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(PointsContext);
    if (!context) {
        throw new Error("usePoints must be used within PointsProvider");
    }
    return context;
}
_s1(usePoints, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "PointsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/lib/data/pizzas.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "desserts",
    ()=>desserts,
    "drinks",
    ()=>drinks,
    "pizzas",
    ()=>pizzas,
    "toppings",
    ()=>toppings
]);
const pizzas = [
    {
        id: "margherita",
        name: "Margherita Imperiale",
        description: "San Marzano tomatoes, fresh mozzarella di bufala, basil, and extra virgin olive oil",
        price: 14.99,
        image: "/margherita-pizza-fresh-basil-mozzarella.jpg",
        category: "classic",
        available: true,
        toppings: [
            "Tomato Sauce",
            "Mozzarella",
            "Basil"
        ],
        stock: 50,
        popular: true
    },
    {
        id: "pepperoni",
        name: "Pepperoni Reale",
        description: "Spicy pepperoni, premium mozzarella, and our signature tomato sauce",
        price: 16.99,
        image: "/pepperoni-pizza-crispy-edges-melted-cheese.jpg",
        category: "classic",
        available: true,
        toppings: [
            "Tomato Sauce",
            "Mozzarella",
            "Pepperoni"
        ],
        stock: 50,
        popular: true
    },
    {
        id: "quattro-formaggi",
        name: "Quattro Formaggi",
        description: "Mozzarella, gorgonzola, parmesan, and fontina on a crispy base",
        price: 18.99,
        image: "/four-cheese-pizza-melted-gourmet.jpg",
        category: "premium",
        available: true,
        toppings: [
            "Mozzarella",
            "Gorgonzola",
            "Parmesan",
            "Fontina"
        ],
        stock: 15,
        popular: true
    },
    {
        id: "diavola",
        name: "Diavola Inferno",
        description: "Spicy salami, calabrian chili, roasted peppers, and fresh mozzarella",
        price: 17.99,
        image: "/spicy-diavola-pizza-with-peppers-chili.jpg",
        category: "specialty",
        available: true,
        toppings: [
            "Tomato Sauce",
            "Mozzarella",
            "Spicy Salami",
            "Chili"
        ],
        stock: 20
    },
    {
        id: "vegetariana",
        name: "Giardino Verde",
        description: "Grilled zucchini, bell peppers, eggplant, cherry tomatoes, and goat cheese",
        price: 15.99,
        image: "/vegetarian-grilled-vegetables-pizza.jpg",
        category: "vegetarian",
        available: true,
        toppings: [
            "Zucchini",
            "Bell Peppers",
            "Eggplant",
            "Cherry Tomatoes",
            "Goat Cheese"
        ],
        stock: 18
    },
    {
        id: "truffle",
        name: "Tartufo Nero",
        description: "Black truffle cream, wild mushrooms, fontina cheese, and fresh arugula",
        price: 24.99,
        image: "/truffle-mushroom-pizza-gourmet-luxury.jpg",
        category: "premium",
        available: true,
        toppings: [
            "Truffle Cream",
            "Wild Mushrooms",
            "Fontina",
            "Arugula"
        ],
        stock: 10
    },
    {
        id: "hawaiian",
        name: "Hawaiian Paradise",
        description: "Ham, pineapple, mozzarella, and a touch of oregano",
        price: 15.99,
        image: "/hawaiian-pizza-ham-pineapple.jpg",
        category: "classic",
        available: true,
        toppings: [
            "Tomato Sauce",
            "Mozzarella",
            "Ham",
            "Pineapple"
        ],
        stock: 22
    },
    {
        id: "mediterranean",
        name: "Mediterranean Dream",
        description: "Feta cheese, olives, sun-dried tomatoes, artichokes, and fresh oregano",
        price: 17.99,
        image: "/mediterranean-pizza-feta-olives.jpg",
        category: "vegetarian",
        available: true,
        toppings: [
            "Feta",
            "Olives",
            "Sun-dried Tomatoes",
            "Artichokes"
        ],
        stock: 15
    },
    {
        id: "bbq-chicken",
        name: "BBQ Chicken Supreme",
        description: "Grilled chicken, BBQ sauce, red onions, cilantro, and smoked gouda",
        price: 18.99,
        image: "/bbq-chicken-pizza-grilled-onions.jpg",
        category: "specialty",
        available: true,
        toppings: [
            "BBQ Sauce",
            "Grilled Chicken",
            "Red Onions",
            "Smoked Gouda"
        ],
        stock: 16
    },
    {
        id: "seafood",
        name: "Frutti di Mare",
        description: "Shrimp, calamari, mussels, garlic butter, and fresh parsley",
        price: 26.99,
        image: "/seafood-pizza-shrimp-calamari-gourmet.jpg",
        category: "premium",
        available: true,
        toppings: [
            "Garlic Butter",
            "Shrimp",
            "Calamari",
            "Mussels",
            "Parsley"
        ],
        stock: 8
    }
];
const toppings = [
    {
        id: "pepperoni",
        name: "Pepperoni",
        price: 2.0,
        category: "meat"
    },
    {
        id: "italian-sausage",
        name: "Italian Sausage",
        price: 2.5,
        category: "meat"
    },
    {
        id: "bacon",
        name: "Crispy Bacon",
        price: 2.5,
        category: "meat"
    },
    {
        id: "ham",
        name: "Smoked Ham",
        price: 2.0,
        category: "meat"
    },
    {
        id: "mushrooms",
        name: "Fresh Mushrooms",
        price: 1.5,
        category: "vegetable"
    },
    {
        id: "onions",
        name: "Caramelized Onions",
        price: 1.0,
        category: "vegetable"
    },
    {
        id: "bell-peppers",
        name: "Bell Peppers",
        price: 1.0,
        category: "vegetable"
    },
    {
        id: "olives",
        name: "Kalamata Olives",
        price: 1.5,
        category: "vegetable"
    },
    {
        id: "jalapenos",
        name: "Fresh Jalapenos",
        price: 1.0,
        category: "vegetable"
    },
    {
        id: "extra-mozzarella",
        name: "Extra Mozzarella",
        price: 2.0,
        category: "cheese"
    },
    {
        id: "parmesan",
        name: "Aged Parmesan",
        price: 2.5,
        category: "cheese"
    },
    {
        id: "goat-cheese",
        name: "Goat Cheese",
        price: 3.0,
        category: "cheese"
    }
];
const drinks = [
    {
        id: "cola",
        name: "Imperial Cola",
        description: "Classic refreshing cola",
        price: 2.99,
        image: "/cola-soda-glass-ice.jpg",
        size: "medium",
        stock: 50
    },
    {
        id: "lemonade",
        name: "Fresh Lemonade",
        description: "Homemade with real lemons",
        price: 3.49,
        image: "/fresh-lemonade-glass-lemon.jpg",
        size: "medium",
        stock: 30
    },
    {
        id: "iced-tea",
        name: "Peach Iced Tea",
        description: "Refreshing peach flavored tea",
        price: 3.29,
        image: "/peach-iced-tea-glass.jpg",
        size: "medium",
        stock: 35
    },
    {
        id: "sparkling-water",
        name: "San Pellegrino",
        description: "Italian sparkling mineral water",
        price: 2.49,
        image: "/sparkling-water-bottle-glass.jpg",
        size: "medium",
        stock: 40
    },
    {
        id: "wine-red",
        name: "House Red Wine",
        description: "Smooth Italian red wine (Glass)",
        price: 7.99,
        image: "/red-wine-glass-elegant.jpg",
        size: "medium",
        stock: 25
    },
    {
        id: "wine-white",
        name: "House White Wine",
        description: "Crisp Italian white wine (Glass)",
        price: 7.99,
        image: "/white-wine-glass-elegant.jpg",
        size: "medium",
        stock: 25
    }
];
const desserts = [
    {
        id: "tiramisu",
        name: "Classic Tiramisu",
        description: "Layers of coffee-soaked ladyfingers and mascarpone cream",
        price: 6.99,
        image: "/tiramisu-dessert-italian-coffee.jpg",
        stock: 20
    },
    {
        id: "panna-cotta",
        name: "Vanilla Panna Cotta",
        description: "Silky Italian custard with berry compote",
        price: 5.99,
        image: "/placeholder.svg?height=300&width=300",
        stock: 15
    },
    {
        id: "cannoli",
        name: "Sicilian Cannoli",
        description: "Crispy shells filled with sweet ricotta cream",
        price: 4.99,
        image: "/placeholder.svg?height=300&width=300",
        stock: 25
    },
    {
        id: "gelato",
        name: "Artisan Gelato",
        description: "Two scoops of authentic Italian gelato",
        price: 5.49,
        image: "/placeholder.svg?height=300&width=300",
        stock: 30
    },
    {
        id: "chocolate-lava",
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center",
        price: 7.49,
        image: "/placeholder.svg?height=300&width=300",
        stock: 18
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/lib/store/stock-store.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StockProvider",
    ()=>StockProvider,
    "useStock",
    ()=>useStock,
    "useStockDispatch",
    ()=>useStockDispatch,
    "useStockState",
    ()=>useStockState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$data$2f$pizzas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/data/pizzas.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
"use client";
;
;
const getInitialState = ()=>({
        pizzaStock: Object.fromEntries(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$data$2f$pizzas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pizzas"].map((p)=>[
                p.id,
                p.stock
            ])),
        drinkStock: Object.fromEntries(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$data$2f$pizzas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["drinks"].map((d)=>[
                d.id,
                d.stock
            ])),
        dessertStock: Object.fromEntries(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$data$2f$pizzas$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["desserts"].map((d)=>[
                d.id,
                d.stock
            ]))
    });
function stockReducer(state, action) {
    switch(action.type){
        case "DECREASE_PIZZA_STOCK":
            return {
                ...state,
                pizzaStock: {
                    ...state.pizzaStock,
                    [action.payload.id]: Math.max(0, (state.pizzaStock[action.payload.id] || 0) - action.payload.quantity)
                }
            };
        case "INCREASE_PIZZA_STOCK":
            return {
                ...state,
                pizzaStock: {
                    ...state.pizzaStock,
                    [action.payload.id]: (state.pizzaStock[action.payload.id] || 0) + action.payload.quantity
                }
            };
        case "DECREASE_DRINK_STOCK":
            return {
                ...state,
                drinkStock: {
                    ...state.drinkStock,
                    [action.payload.id]: Math.max(0, (state.drinkStock[action.payload.id] || 0) - action.payload.quantity)
                }
            };
        case "INCREASE_DRINK_STOCK":
            return {
                ...state,
                drinkStock: {
                    ...state.drinkStock,
                    [action.payload.id]: (state.drinkStock[action.payload.id] || 0) + action.payload.quantity
                }
            };
        case "DECREASE_DESSERT_STOCK":
            return {
                ...state,
                dessertStock: {
                    ...state.dessertStock,
                    [action.payload.id]: Math.max(0, (state.dessertStock[action.payload.id] || 0) - action.payload.quantity)
                }
            };
        case "INCREASE_DESSERT_STOCK":
            return {
                ...state,
                dessertStock: {
                    ...state.dessertStock,
                    [action.payload.id]: (state.dessertStock[action.payload.id] || 0) + action.payload.quantity
                }
            };
        case "LOAD_FROM_STORAGE":
            return action.payload;
        default:
            return state;
    }
}
const StockStateContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const StockDispatchContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function StockProvider({ children }) {
    _s();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"])(stockReducer, getInitialState());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StockProvider.useEffect": ()=>{
            const saved = localStorage.getItem("imperial-stock");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    dispatch({
                        type: "LOAD_FROM_STORAGE",
                        payload: parsed
                    });
                } catch  {
                // Use initial state
                }
            }
        }
    }["StockProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StockProvider.useEffect": ()=>{
            localStorage.setItem("imperial-stock", JSON.stringify(state));
        }
    }["StockProvider.useEffect"], [
        state
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StockStateContext.Provider, {
        value: state,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StockDispatchContext.Provider, {
            value: dispatch,
            children: children
        }, void 0, false, {
            fileName: "[project]/ImperialPizza_PageWeb/lib/store/stock-store.tsx",
            lineNumber: 108,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/lib/store/stock-store.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_s(StockProvider, "7CAsary8bwHvaZ+qkn9evO4zbts=");
_c = StockProvider;
function useStockState() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(StockStateContext);
    if (!context) {
        throw new Error("useStockState must be used within StockProvider");
    }
    return context;
}
_s1(useStockState, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function useStockDispatch() {
    _s2();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(StockDispatchContext);
    if (!context) {
        throw new Error("useStockDispatch must be used within StockProvider");
    }
    return context;
}
_s2(useStockDispatch, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function useStock() {
    _s3();
    return {
        state: useStockState(),
        dispatch: useStockDispatch()
    };
}
_s3(useStock, "GdQHNicml+Ys1oZPZ2cbvHdaaiE=", false, function() {
    return [
        useStockState,
        useStockDispatch
    ];
});
var _c;
__turbopack_context__.k.register(_c, "StockProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/components/providers/app-providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProviders",
    ()=>AppProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$app$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/store/app-store.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$points$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/store/points-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$auth$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/store/auth-store.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$stock$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/store/stock-store.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
function AppProviders({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$auth$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$stock$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StockProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$app$2d$store$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AppStoreProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$store$2f$points$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointsProvider"], {
                    children: children
                }, void 0, false, {
                    fileName: "[project]/ImperialPizza_PageWeb/components/providers/app-providers.tsx",
                    lineNumber: 14,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/ImperialPizza_PageWeb/components/providers/app-providers.tsx",
                lineNumber: 13,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/ImperialPizza_PageWeb/components/providers/app-providers.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/components/providers/app-providers.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = AppProviders;
var _c;
__turbopack_context__.k.register(_c, "AppProviders");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/components/ui/toast.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toast",
    ()=>Toast,
    "ToastAction",
    ()=>ToastAction,
    "ToastClose",
    ()=>ToastClose,
    "ToastDescription",
    ()=>ToastDescription,
    "ToastProvider",
    ()=>ToastProvider,
    "ToastTitle",
    ()=>ToastTitle,
    "ToastViewport",
    ()=>ToastViewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/@radix-ui/react-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = ToastViewport;
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full', {
    variants: {
        variant: {
            default: 'border bg-background text-foreground',
            destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
const Toast = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
_c3 = Toast;
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = ToastAction;
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600', className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/ImperialPizza_PageWeb/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = ToastClose;
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = ToastTitle;
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sm opacity-90', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/ImperialPizza_PageWeb/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = ToastDescription;
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "ToastViewport$React.forwardRef");
__turbopack_context__.k.register(_c1, "ToastViewport");
__turbopack_context__.k.register(_c2, "Toast$React.forwardRef");
__turbopack_context__.k.register(_c3, "Toast");
__turbopack_context__.k.register(_c4, "ToastAction$React.forwardRef");
__turbopack_context__.k.register(_c5, "ToastAction");
__turbopack_context__.k.register(_c6, "ToastClose$React.forwardRef");
__turbopack_context__.k.register(_c7, "ToastClose");
__turbopack_context__.k.register(_c8, "ToastTitle$React.forwardRef");
__turbopack_context__.k.register(_c9, "ToastTitle");
__turbopack_context__.k.register(_c10, "ToastDescription$React.forwardRef");
__turbopack_context__.k.register(_c11, "ToastDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/ImperialPizza_PageWeb/components/ui/toaster.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/ImperialPizza_PageWeb/components/ui/toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Toaster() {
    _s();
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/ImperialPizza_PageWeb/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/ImperialPizza_PageWeb/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/ImperialPizza_PageWeb/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/ImperialPizza_PageWeb/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/ImperialPizza_PageWeb/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/ImperialPizza_PageWeb/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/ImperialPizza_PageWeb/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(Toaster, "1YTCnXrq2qRowe0H/LBWLjtXoYc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$ImperialPizza_PageWeb$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = Toaster;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=ImperialPizza_PageWeb_846b298f._.js.map