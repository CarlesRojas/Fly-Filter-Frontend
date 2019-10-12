import React, { Component } from "react";
import "../css/Cards.css";
import CityCard from "./CityCard";
import FlyCard from "./FlyCard";
import CarCard from "./CarCard";

export default class Cards extends Component {
    render() {
        return (
            <div className="cards_main">
                <CityCard />
                <CarCard />
                <FlyCard />
                <CityCard />
                <CarCard />
            </div>
        );
    }
}
