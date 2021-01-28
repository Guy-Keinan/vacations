import React, { Component } from "react";
import "./home.css";
import { VacationModel } from "../../models/vacation-model";
import axios from "axios";
import { Followers } from "../followers/followers";
import io from 'socket.io-client';
import { FollowerModel } from "../../models/follower-model";
import { Menu } from "../menu/menu";
import { Administration } from "../administration/administration";

let socket;

interface HomeState {
    vacations: VacationModel[];
    followers: FollowerModel[];
    followVacation: FollowerModel;
    isAdmin: String;
}

export class Home extends Component<any, HomeState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: [],
            followers: [],
            followVacation: new FollowerModel(),
            isAdmin: "",
        }
    };

    async componentDidMount() {
        try {
            const response = await axios.get<VacationModel[]>("http://localhost:5000/api/vacations");
            const vacations = response.data;
            this.setState({ vacations });

            const response2 = await axios.get<FollowerModel[]>("http://localhost:5000/api/followers");
            const followers = response2.data;
            this.setState({ followers });

            const isAdmin = sessionStorage.getItem("isAdmin");
            this.setState({ isAdmin });

            this.connect();
        }
        catch (err) {
            alert(err.message);
        }
    }

    public connect = () => {
        socket = io('localhost:5000');
        socket.on("updating-followers", followers => {
            this.setState({ followers });
        });

        socket.on("updating-vacations", vacations => {
            this.setState({ vacations });
        });
    }


    private setFollowerInfo = async (vacationId: number) => {
        const followVacation = { ...this.state.followVacation };
        followVacation.vacationId = vacationId;
        const userId = +sessionStorage.getItem("userId");
        followVacation.userId = userId;
        
        const followInfo = this.getFollower(userId, vacationId);
        if(followInfo) {
            this.unfollowVacation(followInfo.followerId);
            return false;
        }

        await this.setState({ followVacation });
        this.sendFollowerToDateBase();
    }

    private getFollower = (userId: number, vacationId: number) => {
        return this.state.followers.find((followerInfo) => followerInfo.vacationId === vacationId && followerInfo.userId === userId);
    }

    private isFollowing = (vacationId: number) => {
        const userId = +sessionStorage.getItem("userId");
        return typeof this.getFollower(userId, vacationId) !== "undefined";
    }

    private sendFollowerToDateBase = async () => {
        try {
            await axios.post<FollowerModel>("http://localhost:5000/api/followers", this.state.followVacation);
            socket.emit("change-from-client-followers");
        }
        catch (err) {
            alert(err.message);
        }
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

    private isAdmin(): boolean {
        return this.state.isAdmin === "1"
    }


    private deleteVacation = async (vacationId) => {
        try {
            await axios.delete("http://localhost:5000/api/vacations/" + vacationId);
            socket.emit("change-from-client-vacations");
        }
        catch (err) {
            alert(err.message);
        }
    }

    private unfollowVacation = async (id) => {
        try {
            await axios.delete("http://localhost:5000/api/followers/" + id);
            socket.emit("change-from-client-followers");
        }
        catch (err) {
            alert(err.message);
        }
    }


    public render() {
        return (
            <div className="home">
                <div className="menu">
                    <Menu />
                </div>
                <div className="vacations">
                    {this.state.vacations.map(v =>
                        <div className="card" key={v.vacationId}>
                            {this.isAdmin() && <Administration id={v.vacationId} vacationId={v.vacationId} deleteVacation={this.deleteVacation} />}
                            {this.isAdmin() == false && <Followers
                                vacationId={v.vacationId}
                                usersFollowing={this.followersPerVacation(v.vacationId)}
                                setFollowerInfo={this.setFollowerInfo}
                                isFollowing={() => this.isFollowing(v.vacationId)}
                            />}
                            <p>Destination: {v.destination}</p>
                            <p>From: {new Date(v.dateFrom).toLocaleDateString()}</p>
                            <p>To: {new Date(v.dateTo).toLocaleDateString()}</p>
                            <p>Price: {v.price}$</p>
                            <p className="description">Description: {v.description}</p>
                            <p>
                                <img className="pic" src={"http://localhost:5000/static/" + v.imageFile} alt="" />
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}