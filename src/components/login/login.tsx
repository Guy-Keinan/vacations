import React, { Component, ChangeEvent } from "react";
import "./login.css";
import { UserModel } from "../../models/user-model";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { authService } from "../private-route/private-route";
import { withRouter } from "react-router";

interface LoginState {
    userInfo: UserModel;
    errors: { usernameError: string, passwordError: string };
};

class LoginComponent extends Component<any, LoginState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            userInfo: new UserModel(),
            errors: { usernameError: "*", passwordError: "*" }
        }
    };

    private setUsername = (args: ChangeEvent<HTMLInputElement>) => {
        const username = args.target.value;
        let usernameError = "";

        if (username === "") {
            usernameError = "Missing username";
        } else if (username.length < 2) {
            usernameError = "You have minimum characters of two letters";
        } else if (typeof username == "number") {
            usernameError = "Username can't be numbers"
        }

        const errors = { ... this.state.errors };
        errors.usernameError = usernameError;
        this.setState({ errors });

        const userInfo = { ...this.state.userInfo };
        userInfo.username = username;
        this.setState({ userInfo });
    };

    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        let passwordError = "";

        if (password === "") {
            passwordError = "Missing password";
        }

        const errors = { ... this.state.errors };
        errors.passwordError = passwordError;
        this.setState({ errors });

        const userInfo = { ...this.state.userInfo };
        userInfo.password = password;
        this.setState({ userInfo });
    };

    private login = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.authenticate(this.state.userInfo);
            const response = await axios.get("http://localhost:5000/api/followers/userId/" + this.state.userInfo.username);
            let userId = response.data;
            userId = userId.userId;
            sessionStorage.setItem("userId", userId);
            this.props.history.replace("/home");
        }
        catch (err) {
            alert(err.message);
        }
    };

    private isLoginLegal = () => {
        for (const item in this.state.errors) {
            if (this.state.errors[item].toString() !== "") {
                return false;
            }
        }
        return true;
    };


    public render() {
        return (
            <div className="login">
                <form action="/home">
                    <p>Username:</p>
                    <input onChange={this.setUsername} value={this.state.userInfo.username || ""} type="text" placeholder="Enter Username..." />
                    <span>{this.state.errors.usernameError}</span>
                    <p>Password:</p>
                    <input onChange={this.setPassword} value={this.state.userInfo.password || ""} type="password" placeholder="Enter Password...." />
                    <span>{this.state.errors.passwordError}</span>
                    <br />
                    <button disabled={!this.isLoginLegal()} onClick={this.login}>Login</button>
                </form>
                <p>
                    Not a Member? <br />
                    Please <NavLink to="/register" exact>Sign Up</NavLink>
                </p>
            </div>
        )
    }
};

export const Login = withRouter(LoginComponent);
