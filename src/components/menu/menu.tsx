import React, { Component } from "react";
import "./menu.css";
import { NavLink } from "react-router-dom";

interface MenuState {
    isAdmin: string
}

export class Menu extends Component<any, MenuState> {

    constructor(props: any) {
        super(props);
        this.state = {
            isAdmin: "",
        }
    }

    private isAdmin():boolean {
        return this.state.isAdmin === "1"
    }

    async componentDidMount() {
        const isAdmin = sessionStorage.getItem("isAdmin");
        this.setState({ isAdmin });
    }

    public render() {
        return (
            <div className="menu">
                <NavLink to="/home" exact>Home</NavLink>
                <NavLink to="/login" exact>Login</NavLink>
                <NavLink to="/register" exact>Register</NavLink>
                {this.isAdmin() &&  <NavLink to="/chart" exact>Chart</NavLink>}
                {this.isAdmin() &&   <NavLink to="/add-new-vacation" exact>Add Vacation</NavLink>}
            </div>
        )
    }
}

