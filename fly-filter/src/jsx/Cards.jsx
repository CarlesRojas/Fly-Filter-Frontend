import React, { Component } from "react";
import "../css/Cards.css";
import CityCard from "./CityCard";

export default class Cards extends Component {
    render() {
        return (
            <div className="cards_main">
                <CityCard />
            </div>
        );
    }
}
