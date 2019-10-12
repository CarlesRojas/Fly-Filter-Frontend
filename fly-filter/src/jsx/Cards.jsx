import React, { Component } from "react";
import "../css/Cards.css";
import CityCard from "./CityCard";
import HotelCard from "./HotelCard";
import FlyCard from "./FlyCard";
import CarCard from "./CarCard";
import AddCarCard from "./AddCarCard";
import Timeline from "./Timeline";

export default class Cards extends Component {
    constructor() {
        super();

        // Sub to events when this component is mounted
        window.PubSub.sub("onAddRentalCarClick", this.handleAddRentalCarClick);
    }

    handleAddRentalCarClick = ({ id }) => {};

    render() {
        // TimelineHeight = City * 7 + fly * 6.5 + car * 3.5 + addcar * 4 + hotel * 5
        return (
            <div className="cards_main">
                <Timeline height={28 + 19.5 + 3.5 + 4 + 10 + "em"} />
                <div className="cards_container">
                    <CityCard id={0} city={"BARCELONA"} image={"https://i.imgur.com/cXv9UiO.jpg"} center={false} />
                    <FlyCard id={1} />
                    <CityCard id={2} city={"PARIS"} days={"7 days"} image={"https://i.imgur.com/cXv9UiO.jpg"} center={false} />
                    <AddCarCard id={7} />
                    <HotelCard id={4} />
                    <FlyCard id={5} />
                    <CityCard id={6} city={"BERLIN"} days={"4 days"} image={"https://i.imgur.com/cXv9UiO.jpg"} center={false} />
                    <CarCard id={3} />
                    <HotelCard id={4} />
                    <FlyCard id={5} />
                    <CityCard id={6} city={"BARCELONA"} image={"https://i.imgur.com/cXv9UiO.jpg"} center={false} />
                </div>
            </div>
        );
    }

    // Stop listening to events
    componentWillUnmount() {
        window.PubSub.unsub("onAddRentalCarClick", this.handleAddRentalCarClick);
    }
}
