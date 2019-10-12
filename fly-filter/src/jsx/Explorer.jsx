import React, { Component } from "react";
import Summary from "./Summary";
import Filters from "./Filters";
import "../css/Explorer.css";

export default class Explorer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            left: "0%"
        };

        // Sub to events when this component is mounted
        window.PubSub.sub("onTripOpen", this.handleTripOpen);
        window.PubSub.sub("onTripClose", this.handleTripClose);
    }

    handleTripOpen = () => {
        this.setState({
            left: "-25%"
        });
    };

    handleTripClose = () => {
        this.setState({
            left: "0%"
        });
    };

    render() {
        const { left } = this.state;
        const { city, departureDate, travelLenght } = this.props;
        return (
            <div className="explorer_main" style={{ left: left }}>
                <Summary city={city} departureDate={departureDate} travelLenght={travelLenght} center={true} />
                <Filters />
            </div>
        );
    }

    // Stop listening to events
    componentWillUnmount() {
        window.PubSub.unsub("onTripOpen", this.handleTripOpen);
        window.PubSub.unsub("onTripClose", this.handleTripClose);
    }
}
