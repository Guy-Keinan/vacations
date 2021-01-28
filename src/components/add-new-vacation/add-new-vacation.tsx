import React, { Component, ChangeEvent } from "react";
import "./add-new-vacation.css";
import axios from "axios";
import { VacationModel } from "../../models/vacation-model";
import { Menu } from "../menu/menu";
import { withRouter } from "react-router-dom";

interface AddNewVacationState {
    vacation: VacationModel;
    errors: { destinationError: string, descriptionError: string, dateFromError: string, dateToError: string, priceError: string };
    selectedFile: any;
}

class AddNewVacationComponent extends Component<any, AddNewVacationState>{

    constructor(props: any) {
        super(props);
        this.state = {
            vacation: new VacationModel(),
            errors: { destinationError: "*", descriptionError: "*", dateFromError: "*", dateToError: "*", priceError: "*" },
            selectedFile: null,
        }
    }


    private setDestination = (args: ChangeEvent<HTMLInputElement>) => {
        const destination = args.target.value;
        let destinationError = "";
        console.log(typeof destination);


        if (destination === "") {
            destinationError = "Missing Destination";
        } else if (destination.length < 3) {
            destinationError = "You have minimum characters of three letters";
        } else if (typeof destination == "number") {
            destinationError = "Destination can't be numbers"
        }

        const errors = { ...this.state.errors };
        errors.destinationError = destinationError;
        this.setState({ errors });

        const vacation = { ...this.state.vacation };
        vacation.destination = destination;
        this.setState({ vacation });
    };


    private setDescription = (args: ChangeEvent<HTMLInputElement>) => {
        const description = args.target.value;
        let descriptionError = "";

        if (description === "") {
            descriptionError = "Missing Description";
        } else if (description.length < 3) {
            descriptionError = "You have minimum characters of three letters";
        } else if (typeof description === "number") {
            descriptionError = "Description can't be numbers"
        }

        const errors = { ...this.state.errors };
        errors.descriptionError = descriptionError;
        this.setState({ errors });

        const vacation = { ...this.state.vacation };
        vacation.description = description;
        this.setState({ vacation });
    };


    private setDateFrom = (args: ChangeEvent<HTMLInputElement>) => {
        const dateFrom = args.target.value;
        let dateFromError = "";

        if (dateFrom === "" || dateFrom === undefined) {
            dateFromError = "Missing Description";
        } else if (this.checkDate(dateFrom)) {
            dateFromError = "Time travel is forbidden!";
        }

        const errors = { ...this.state.errors };
        errors.dateFromError = dateFromError;
        this.setState({ errors });

        const vacation = { ...this.state.vacation };
        vacation.dateFrom = dateFrom;
        this.setState({ vacation });
    };

    private setDateTo = (args: ChangeEvent<HTMLInputElement>) => {
        const dateTo = args.target.value;
        let dateToError = "";

        if (dateTo === "" || dateTo === undefined) {
            dateToError = "Missing Description";
        } else if (this.checkDate(dateTo)) {
            dateToError = "Time travel is forbidden!";
        }

        const errors = { ...this.state.errors };
        errors.dateToError = dateToError;
        this.setState({ errors });

        const vacation = { ...this.state.vacation };
        vacation.dateTo = dateTo;
        this.setState({ vacation });
    };

    private setPrice = (args: ChangeEvent<HTMLInputElement>) => {
        const price = args.target.value === "" ? undefined : +args.target.value;
        let priceError = "";

        if (price === undefined) {
            priceError = "Missing Price";
        } else if (price < 0) {
            priceError = "Price can't be negative";
        } else if (price > 1500) {
            priceError = "Price Too high";
        }

        const errors = { ...this.state.errors };
        errors.priceError = priceError;
        this.setState({ errors });

        const vacation = { ...this.state.vacation };
        vacation.price = price;
        this.setState({ vacation });
    };

    private addVacation = async () => {
        try {
            const response = await axios.post<VacationModel>("http://localhost:5000/api/vacations", this.state.vacation);
            await this.sendFile();
            const vacation = response.data;
            alert("vacation " + vacation.vacationId + " successfully added!");
            this.props.history.push("/home");
        }
        catch (err) {
            alert(err.message + " Baga");
        }
    }

    private checkDate = (selectedDate): boolean => {
        const dateToCheck = new Date(selectedDate);
        const now = new Date();
        if (dateToCheck < now) {
            return true;
        }
    }

    private isFormLegal = () => {
        for (const prop in this.state.errors) {
            if (this.state.errors[prop].toString() !== "") {
                console.log(this.state.errors[prop]);
                return false;
            }
        }
        if (!this.state.selectedFile) {
            return false;
        }
        return true;
    }

    private setFile = async (e) => {
        const selectedFile = e.target.files[0];
        this.setState({ selectedFile });
        const vacation = { ...this.state.vacation };
        vacation.imageFile = e.target.files[0].name;
        this.setState({ vacation });
    }

    private sendFile = async () => {
        if (!this.state.selectedFile) {
            return false;
        }
        const formData = new FormData();
        formData.append("file", this.state.selectedFile, this.state.selectedFile.name);
        try {
            const response = await axios.post("http://localhost:5000/images", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }
        catch (err) {
            alert(err.message);
        }
    }

    public render() {
        return (
            <div className="edit">
                <Menu />
                <h4>Add New Vacation</h4>
                <p>Destination:</p>
                <input onChange={this.setDestination} type="text" value={this.state.vacation.destination || ""} placeholder="Destination..." />
                <span>{this.state.errors.destinationError}</span>
                <p>Description:</p>
                <input onChange={this.setDescription} type="text" value={this.state.vacation.description || ""} placeholder="Description..." />
                <span>{this.state.errors.descriptionError}</span>
                <p>From:</p>
                <input onChange={this.setDateFrom} type="date" value={this.state.vacation.dateFrom || ""} />
                <span>{this.state.errors.dateFromError}</span>
                <p>To:</p>
                <input onChange={this.setDateTo} type="date" value={this.state.vacation.dateTo || ""} />
                <span>{this.state.errors.dateToError}</span>
                <p>Price:</p>
                <input onChange={this.setPrice} type="text" value={this.state.vacation.price || ""} placeholder="Price..." />
                <span>{this.state.errors.priceError}</span>
                <p>Image:</p>
                <input onChange={this.setFile} type="file" />
                <br />
                <button disabled={!this.isFormLegal()} onClick={this.addVacation} >Add</button>
            </div>
        )
    }
}


export const AddNewVacation = withRouter(AddNewVacationComponent);