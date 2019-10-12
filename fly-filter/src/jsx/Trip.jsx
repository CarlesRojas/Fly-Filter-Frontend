import React, { Component } from "react";
import "../css/Trip.css";
import Cards from "./Cards";
import Buy from "./Buy";

export default class Trip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            right: "-25%"
        };

        // Sub to events when this component is mounted
        window.PubSub.sub("onTripOpen", this.handleTripOpen);
        window.PubSub.sub("onTripClose", this.handleTripClose);

        window.setTimeout(() => {
            //this.handleTripOpen();
            /*
            window.setTimeout(() => {
                this.handleTripClose();
            }, 1000);
            */
        }, 1000);
    }

    handleTripOpen = () => {
        this.setState({
            right: "0%"
        });
    };

    handleTripClose = () => {
        this.setState({
            right: "-25%"
        });
    };

    render() {
        const { right } = this.state;

        return (
            <div className="trip_main" style={{ right: right }}>
                <Cards />
                <Buy />
            </div>
        );
    }

    // Stop listening to events
    componentWillUnmount() {
        window.PubSub.unsub("onTripOpen", this.handleTripOpen);
        window.PubSub.sub("onTripClose", this.handleTripClose);
    }
}
