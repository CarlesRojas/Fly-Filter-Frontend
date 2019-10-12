import React, { Component } from "react";
import "./App.css";
import Typeform from "./jsx/Typeform";
import Explorer from "./jsx/Explorer";
import Map from "./jsx/Map";

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            hasRecievedData: false,
            city: "",
            departureDate: "",
            travelLenght: 0
        };
    }

    onTypeformSubmitted = () => {
        this.setState({
            hasRecievedData: true,
            city: "Barcelona",
            departureDate: "15-12-2019",
            travelLenght: 15
        });
    };

    render() {
        const { hasRecievedData } = this.state;

        var typeform = (
            <div className="app_main">
                <Typeform />
            </div>
        );

        var mainApp = (
            <div className="app_main">
                <Explorer />
                <Map />
            </div>
        );

        return <div className="app_main">{hasRecievedData ? mainApp : typeform}</div>;
    }

    componentDidMount() {
        window.setTimeout(() => {
            this.onTypeformSubmitted();
        }, 500);
    }
}
