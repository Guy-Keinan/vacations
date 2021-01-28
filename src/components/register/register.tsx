import React, { Component, ChangeEvent } from "react";
import "./register.css";
import { UserModel } from "../../models/user-model";
import axios from "axios";
import { withRouter } from "react-router-dom";

interface RegisterState {
    userInfo: UserModel;
    errors: { firstNameError: string, lastNameError: string, usernameError: string, passwordError: string };
}

 class RegisterComponent extends Component<any, RegisterState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            userInfo: new UserModel(),
            errors: { firstNameError: "*", lastNameError: "*", usernameError: "*", passwordError: "*" }
        }
    };

    private setFirstName = (args: ChangeEvent<HTMLInputElement>) => {
        const firstName = args.target.value;
        let firstNameError = "";

        if (firstName === "") {
            firstNameError = "Missing first name";
        } else if (firstName.length < 3) {
            firstNameError = "You have minimum characters of three letters";
        } else if (typeof firstName == "number") {
            firstNameError = "First name can't be numbers"
        }

        const errors = { ... this.state.errors };
        errors.firstNameError = firstNameError;
        this.setState({ errors });

        const userInfo = { ...this.state.userInfo };
        userInfo.firstName = firstName;
        this.setState({ userInfo });
    };

    private setLastName = (args: ChangeEvent<HTMLInputElement>) => {
        const lastName = args.target.value;
        let lastNameError = "";

        if (lastName === "") {
            lastNameError = "Missing last name";
        } else if (lastName.length < 3) {
            lastNameError = "You have minimum characters of three letters";
        } else if (typeof lastName == "number") {
            lastNameError = "Last name can't be numbers"
        }

        const errors = { ... this.state.errors };
        errors.lastNameError = lastNameError;
        this.setState({ errors });

        const userInfo = { ...this.state.userInfo };
        userInfo.lastName = lastName;
        this.setState({ userInfo });
    };

    private setUsername = (args: ChangeEvent<HTMLInputElement>) => {
        const username = args.target.value;
        let usernameError = "";

        if (username === "") {
            usernameError = "Missing username";
        } else if (username.length < 6) {
            usernameError = "You have minimum characters of six letters";
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
        } else if (password.length < 5) {
            passwordError = "You have minimum characters of five letters";
        }

        const errors = { ... this.state.errors };
        errors.passwordError = passwordError;
        this.setState({ errors });

        const userInfo = { ...this.state.userInfo };
        userInfo.password = password;
        this.setState({ userInfo });
    };

    private register = async () => {
        try {
            const response = await axios.post<UserModel>("http://localhost:5000/api/auth/register", this.state.userInfo);
            const user = response.data;
            alert("Succeed! New User: " + user.userId);
            this.props.history.push("/home");
        }
        catch (err) {
            alert("Failed!" + err.message);
        }
    };

    private isFormLegal = () => {
        for (const item in this.state.errors) {
            if (this.state.errors[item].toString() !== "") {
                return false;
            }
        }
        return true;
    };

    public render() {
        return (
            <div className="register">
                <h4>Registration:</h4>

                <form action="/login">
                    <p>First Name:</p>
                    <input onChange={this.setFirstName} value={this.state.userInfo.firstName || ""} type="text" placeholder="Enter First Name...." />
                    <span>{this.state.errors.firstNameError}</span>
                    <p>Last Name:</p>
                    <input onChange={this.setLastName} value={this.state.userInfo.lastName || ""} type="text" placeholder="Enter Last Name...." />
                    <span>{this.state.errors.lastNameError}</span>
                    <p>Username:</p>
                    <input onChange={this.setUsername} value={this.state.userInfo.username || ""} type="text" placeholder="Enter Username...." />
                    <span>{this.state.errors.usernameError}</span>
                    <p>Password:</p>
                    <input onChange={this.setPassword} value={this.state.userInfo.password || ""} type="text" placeholder="Enter Password...." />
                    <span>{this.state.errors.passwordError}</span>
                    <br />
                    <button disabled={!this.isFormLegal()} onClick={this.register}>Register</button>
                </form>
            </div>
        )
    }
};

export const Register = withRouter(RegisterComponent);