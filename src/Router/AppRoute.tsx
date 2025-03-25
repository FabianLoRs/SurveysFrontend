import { Route, Redirect, RouteProps, RouteComponentProps } from "react-router";
import { RouteType } from "../types";
import { useAuthState } from "../context/authContext";

interface AppRouteProps extends RouteProps {
    component: any,
    routeType: RouteType
}

const AppRoute = (props: AppRouteProps) => {
    const { component: Component, path, routeType, ...rest } = props;

    const user = useAuthState();

    const renderComponent = (routeProps: RouteComponentProps) => {
        switch (routeType) {
            case "PRIVATE":
                if (user.isAuthenticated) {
                    return <Component {...routeProps}></Component>
                } else {
                    return <Redirect to="/login"></Redirect>
                }
            case "GUEST":
                if (!user.isAuthenticated) {
                    return <Component {...routeProps}></Component>
                } else {
                    return <Redirect to="/user"></Redirect>
                }
            case "PUBLIC":
                return <Component {...routeProps}></Component>
        }
    }

    return(
        <Route {...rest} path={path} render={(routeProps) => renderComponent(routeProps)}></Route>
    );
}

export default AppRoute;