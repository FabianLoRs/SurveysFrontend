export type User = {
    email: string,
    token: string,
    isAuthenticated: boolean
};

export type RouteType = "PRIVATE" | "PUBLIC" | "GUEST";

export type Route = {
    path: string,
    component: any,
    routeType: RouteType
};