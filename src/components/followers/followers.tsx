import React, { Component } from "react";
import "./followers.css";

interface FollowersProps {
    setFollowerInfo?: (vacationId:any)=> void;
    isFollowing: () => boolean;
    usersFollowing: number;
    vacationId?:any;
}

export class Followers extends Component<FollowersProps>{
    public constructor(props: FollowersProps) {
        super(props);
    };

    private follow = (vacationId) => {
        if (this.props.setFollowerInfo) {
            this.props.setFollowerInfo(this.props.vacationId);
        }
    };

    public render() {
        return (
            <div className="followers" id={this.props.vacationId}>
                <button onClick={this.follow}>{this.props.isFollowing() ? '❤ Unfollow' : '🤍 follow'}</button>
                <p>{this.props.usersFollowing} users following this vacation</p>
            </div>
        )
    }
}