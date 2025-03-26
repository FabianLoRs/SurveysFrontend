import CreatePoll from "../Pages/CreatePoll";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import User from "../Pages/User";
import { Route } from "../types";

const routes: Route[] = [
    {
        path: "/",
        component: Home,
        routeType: "PUBLIC"
    },
    {
        path: "/login",
        component: Login,
        routeType: "GUEST"
    },
    {
        path: "/register",
        component: Register,
        routeType: "GUEST"
    },
    {
        path: "/user",
        component: User,
        routeType: "PRIVATE"
    },
    {
        path: "/createpoll",
        component: CreatePoll,
        routeType: "PRIVATE"
    }
];

export default routes;