import React, { Component } from "react";
import "../css/Trip.css";
import Cards from "./Cards";
import Buy from "./Buy";

export default class Trip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            left: "100%"
        };

        // Sub to events when this component is mounted
        window.PubSub.sub("onTripOpen", this.handleTripOpen);
        window.PubSub.sub("onTripClose", this.handleTripClose);

        window.setTimeout(() => {
            //window.PubSub.emit("onTripOpen");
            window.setTimeout(() => {
                //window.PubSub.emit("onTripClose");
            }, 1000);
        }, 1000);
    }

    handleTripOpen = () => {
        this.setState({
            left: "75%"
        });
    };

    handleTripClose = () => {
        this.setState({
            left: "100%"
        });
    };

    render() {
        const { left } = this.state;

        return (
            <div className="trip_main" style={{ left: left }}>
                <Cards />
                <Buy />
            </div>
        );
    }

    // Stop listening to events
    componentWillUnmount() {
        window.PubSub.unsub("onTripOpen", this.handleTripOpen);
        window.PubSub.unsub("onTripClose", this.handleTripClose);
    }
}
