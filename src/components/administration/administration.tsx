import React, { Component } from "react";
import "./administration.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { runInThisContext } from "vm";

interface AdministrationProps {
    deleteVacation?(vacationId): void;
    vacationId: any;
    id: any;
}

export class Administration extends Component<AdministrationProps>{

    constructor(props: AdministrationProps) {
        super(props);
    }

    private delete = (vacationId) => {
        if (this.props.deleteVacation) {
            this.props.deleteVacation(this.props.vacationId);
        }
    };

    public render() {
        return (
            <div className="administration">
                <NavLink to={"/edit-vacation/" + this.props.id} exact>
                    <img src="/assets/images/edit.png" alt="" />
                </NavLink>
                <img onClick={this.delete} src="/assets/images/delete.jpg" alt="" />
                {/* <button onClick={this.delete}>Delete</button> */}
            </div>
        )
    }
}


