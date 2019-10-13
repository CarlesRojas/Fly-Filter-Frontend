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

        this.state = {
            hasCarRenter: false
        };

        this.lastDestCity = "";

        // Sub to events when this component is mounted
        window.PubSub.sub("onAddRentalCarClick", this.handleAddRentalCarClick);
    }

    handleAddRentalCarClick = () => {
        this.setState({
            hasCarRenter: true
        });
    };

    render() {
        const { origCity, destCity } = this.props;
        const { hasCarRenter } = this.state;

        var randomCarPrice = parseFloat((Math.random() * 20).toFixed(1)) + 10;
        var activeCarCard = !hasCarRenter || this.lastDestCity !== destCity.name ? <AddCarCard id={3} /> : <CarCard price={randomCarPrice} />;

        if (origCity && destCity) {
            this.lastDestCity = destCity.name;
            var flightPrice = (parseFloat(destCity.flight.price) / 2).toFixed(2);
            window.PubSub.emit("onPriceUpdate", randomCarPrice + flightPrice * 2 + 135.5);

            var cards = (
                <div className="cards_container">
                    <CityCard id={0} city={origCity.name.toUpperCase()} image={origCity.imatge} center={false} />
                    <FlyCard
                        id={1}
                        origCity={origCity.name.toUpperCase()}
                        destCity={destCity.name.toUpperCase()}
                        price={flightPrice + " €"}
                        date={destCity.flight.OutboundLeg.date}
                    />
                    <CityCard id={2} city={destCity.name.toUpperCase()} image={destCity.imatge} center={false} />
                    {activeCarCard}
                    <HotelCard id={4} price={135.5} />
                    <FlyCard
                        id={5}
                        origCity={destCity.name.toUpperCase()}
                        destCity={origCity.name.toUpperCase()}
                        price={flightPrice + " €"}
                        date={destCity.flight.InboundLeg.date}
                    />
                    <CityCard id={6} city={origCity.name.toUpperCase()} image={origCity.imatge} center={false} />
                </div>
            );
        } else {
            cards = <div className="cards_container"></div>;
        }

        // TimelineHeight = City * 7 + fly * 6.5 + car/addcar * 3.5 + hotel * 5
        return (
            <div className="cards_main">
                <Timeline height={21 + 13 + 3.5 + 5 + "em"} />
                {cards}
            </div>
        );
    }

    // Stop listening to events
    componentWillUnmount() {
        window.PubSub.unsub("onAddRentalCarClick", this.handleAddRentalCarClick);
    }
}
