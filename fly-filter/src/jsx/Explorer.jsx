import React, { Component } from "react";
import Summary from "./Summary";
import Filters from "./Filters"
import "../css/Explorer.css";

export default class Explorer extends Component {

    render() {
        const { city, departureDate, travelLenght } = this.props;
        return (<div className="explorer_main">
            <Summary city = {city} departureDate = {departureDate} travelLenght = {travelLenght} />
            <Filters />
        </div>);
    }
}
