import React, { Component } from "react";
import "./chart.css";
import { Doughnut } from "react-chartjs-2";
import { FollowerModel } from "../../models/follower-model";
import axios from "axios";
import { VacationModel } from "../../models/vacation-model";
import { Menu } from "../menu/menu";

interface ChartState {
    data: {};
    followers: FollowerModel[];
    vacations: VacationModel[]
}

export class Chart extends Component<any, ChartState>{

    constructor(props: any) {
        super(props);
        this.state = {
            data: {},
            followers: [],
            vacations: [],
        }
    }

    async componentDidMount() {
        try {
            const response2 = await axios.get<VacationModel[]>("http://localhost:5000/api/vacations");
            const vacations = response2.data;
            this.setState({ vacations });

            const response = await axios.get<FollowerModel[]>("http://localhost:5000/api/followers");
            const followers = response.data;
            this.setState({ followers });

            this.setData();
        }
        catch (err) {
            alert(err.message);
        }
    }

    private setData = () => {
        const data = {
            labels: [],
            datasets: [
                {
                    label: "Followers Chart",
                    data: [],
                    backgroundColor: []
                }
            ]
        }
        const arr = this.state.followers.map(f => f.vacationId);
        const set = new Set(arr);
        const objToArr = [];
        set.forEach(n => objToArr.push(n));
        set.forEach(n => {
            const dataForChart = this.followersPerVacation(n);
            data.datasets[0].data.push(dataForChart);
        });
        objToArr.map(n => {
            const labelsChart = this.setLabels(n);
            data.labels.push(labelsChart);
        });
        this.setColors(data.datasets[0].data.length, data.datasets[0].backgroundColor);
        this.setState({ data });
        console.log(this.state.data);

    }

    private setLabels = (vacationId) => {
        let destination = "";
        const x = this.state.vacations.map(v => v);
        for (let item of x) {
            if (item.vacationId === vacationId) {
                destination = item.destination;
            }
        }
        return destination;
    }

    private followersPerVacation = (vacationId): number => {
        const arr = [];
        const x = this.state.followers.map(f => f.vacationId);
        for (let item of x) {
            if (item === vacationId) {
                arr.push(item);
            }
        }
        return arr.length;
    }

    private setColors = (number, array) => {
        for (let i = 1; i <= number; i++) {
            const color = this.getRandomColor();
            array.push(color);
        }
    }

    private getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    render() {
        return (
            <div className="chart">
                <div className="menu">
                    <Menu />
                </div>
                <h1>Chart</h1>
                <Doughnut
                    options={{
                        responsive: true
                    }}
                    data={this.state.data} />
            </div>
        )
    }
}