import React, { Component } from "react";
import "../css/Cards.css";
import CityCard from "./CityCard";
import HotelCard from "./HotelCard";
import FlyCard from "./FlyCard";


export default class Cards extends Component {
    render() {
        return (
            <div className="cards_main">
                <CityCard />
                <HotelCard />
                <FlyCard />
                <CityCard />
            </div>
        );
    }
}
