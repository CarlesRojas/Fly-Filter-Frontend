import React, { Component } from "react";
import "../css/Cards.css";
import CityCard from "./CityCard";
import HotelCard from "./HotelCard";
import FlyCard from "./FlyCard";
import CarCard from "./CarCard";
import AddCarCard from "./AddCarCard";
import Timeline from "./Timeline";

export default class Cards extends Component {
    constructor(props) {
        super(props);

        // Sub to events when this component is mounted
        window.PubSub.sub("onAddRentalCarClick", this.handleAddRentalCarClick);
    }

    handleAddRentalCarClick = ({ id }) => {
        console.log(id);
    };

    render() {
        const { origCity, destCity } = this.props;
        console.log(origCity);
        if (origCity && destCity) {
            var cards = (
                <div className="cards_container">
                    <CityCard id={0} city={origCity.name.toUpperCase()} image={origCity.imatge} center={false} />
                    <FlyCard
                        id={1}
                        origCity={origCity.name.toUpperCase()}
                        destCity={destCity.name.toUpperCase()}
                        price={(parseFloat(destCity.flight.price) / 2).toFixed(2) + " €"}
                        date={destCity.flight.OutboundLeg.date}
                    />
                    <CityCard id={0} city={destCity.name.toUpperCase()} image={destCity.imatge} center={false} />
                    <AddCarCard id={7} />
                    <HotelCard id={4} />
                    <FlyCard
                        id={5}
                        origCity={destCity.name.toUpperCase()}
                        destCity={origCity.name.toUpperCase()}
                        price={(parseFloat(destCity.flight.price) / 2).toFixed(2) + " €"}
                        date={destCity.flight.InboundLeg.date}
                    />
                    <CityCard id={0} city={origCity.name.toUpperCase()} image={origCity.imatge} center={false} />
                </div>
            );
        } else {
            cards = <div className="cards_container"></div>;
        }

        // TimelineHeight = City * 7 + fly * 6.5 + car * 3.5 + addcar * 4 + hotel * 5
        return (
            <div className="cards_main">
                <Timeline height={21 + 13 + 4 + 5 + "em"} />
                {cards}
            </div>
        );
    }

    // Stop listening to events
    componentWillUnmount() {
        window.PubSub.unsub("onAddRentalCarClick", this.handleAddRentalCarClick);
    }
}
