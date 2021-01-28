import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import { UserModel } from "../../models/user-model";


export function PrivateRoute({ children, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                authService.isAuthenticated ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}

class AuthService {
    public isAuthenticated = false;

    constructor() {
        if (document.cookie.indexOf("vacationsSession") !== -1) {
            this.isAuthenticated = true;
        } else {
            this.isAuthenticated = false;
        }
    }


    public async authenticate(credentials: UserModel) {
        const response = await axios.post<UserModel>("http://localhost:5000/api/auth/login", credentials, { withCredentials: true });
        this.isAuthenticated = true;
        const userInfo =response.data;
        const isAdmin = userInfo.isAdmin.toString();
        sessionStorage.setItem("isAdmin", isAdmin);
        return response.data;
    }
}

export const authService = new AuthService();

