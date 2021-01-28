import React, { Component } from "react";
import "./layout.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Home } from "../home/home";
import { Login } from "../login/login";
import { Register } from "../register/register";
import { PrivateRoute } from "../private-route/private-route";
import { Chart } from "../chart/chart";
import { Edit } from "../edit/edit";
import { AddNewVacation } from "../add-new-vacation/add-new-vacation";

interface LayoutState {
    isAdmin: string
}

export class Layout extends Component<any, LayoutState> {

    constructor(props: any) {
        super(props);
        this.state = {
            isAdmin: "",
        }
    }

    async componentDidMount() {
        const isAdmin = sessionStorage.getItem("isAdmin");
        this.setState({ isAdmin });
    }

    render() {
        return (
            <div className="layout">
                <BrowserRouter>
                    <header>
                        <h1>Around The World</h1>
                    </header>
                    <main>
                        <Switch>
                            <PrivateRoute path="/home" exact>
                                <Home />
                            </PrivateRoute>
                            <PrivateRoute path="/add-new-vacation" exact>
                                <AddNewVacation />
                            </PrivateRoute>
                            <Route path="/login" component={Login} exact />
                            <Route path="/register" component={Register} exact />
                            <Route path="/chart" component={Chart} exact />
                            <Route path="/edit-vacation/:vacationId" component={Edit} exact />
                            <Redirect from="/" to="/home" exact />
                        </Switch>
                    </main>
                </BrowserRouter>
            </div>
            
        );
    };
};