import React, { Component } from "react";
import "./App.css";
import Typeform from "./jsx/Typeform";
import Explorer from "./jsx/Explorer";
import Map from "./jsx/Map";
import Trip from "./jsx/Trip";

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            hasRecievedData: false,
            city: "",
            departureDate: "",
            travelLenght: 0
        };

        // Loaded data
        window.loadedData = {};

        // Subscribe to events
        window.addEventListener("resize", () => window.PubSub.emit("onWindowResize"));
    }

    getUrlVars() {
        var vars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            vars[key] = value;
        });
        return vars;
    }

    cleanCities = () => {
        var dataCity = [];

        var max_temperature = null,
            min_temperature = null,
            max_airQuality = null,
            min_airQuality = null,
            max_precipitation = null,
            min_precipitation = null,
            max_price = null,
            min_price = null;

        for (var i = 0; i < window.dispFlights.length; i++) {
            for (var j = 0; j < window.parsData.length; j++) {
                if (window.dispFlights[i]["OutboundLeg"]["destination"] === window.parsData[j]["name"]) {
                    var aux = window.parsData[j];
                    aux["flight"] = window.dispFlights[i];
                    dataCity.push(aux);
                }
            }
        }

        for (var k = 0; k < dataCity.length; k++) {
            if (max_temperature == null) {
                max_temperature = dataCity[k]["temperature"];
                min_temperature = dataCity[k]["temperature"];
                max_airQuality = dataCity[k]["airQuality"];
                min_airQuality = dataCity[k]["airQuality"];
                max_precipitation = dataCity[k]["precipitation"];
                min_precipitation = dataCity[k]["precipitation"];
                max_price = dataCity[k]["flight"]["price"];
                min_price = dataCity[k]["flight"]["price"];
            } else {
                if (dataCity[k]["temperature"] > max_temperature) max_temperature = dataCity[k]["temperature"];
                if (dataCity[k]["temperature"] < min_temperature) min_temperature = dataCity[k]["temperature"];

                if (dataCity[k]["airQuality"] > max_airQuality) max_airQuality = dataCity[k]["airQuality"];
                if (dataCity[k]["airQuality"] < min_airQuality) min_airQuality = dataCity[k]["airQuality"];

                if (dataCity[k]["precipitation"] > max_precipitation) max_precipitation = dataCity[k]["precipitation"];
                if (dataCity[k]["precipitation"] < min_precipitation) min_precipitation = dataCity[k]["precipitation"];

                if (dataCity[k]["flight"]["price"] > max_price) max_price = dataCity[k]["flight"]["price"];
                if (dataCity[k]["flight"]["price"] < min_price) min_price = dataCity[k]["flight"]["price"];
            }
        }

        window.filterExtremes = {
            max_temperature: max_temperature,
            min_temperature: min_temperature,
            max_airQuality: max_airQuality,
            min_airQuality: min_airQuality,
            max_precipitation: max_precipitation,
            min_precipitation: min_precipitation,
            max_price: max_price,
            min_price: min_price
        };
        window.cityData = dataCity;
        window.PubSub.emit("onDataLoaded");
    };

    fetchFlights = () => {
        const { departureDate, travelLenght } = this.state;

        var dateEnd = new Date(departureDate);
        dateEnd.setDate(dateEnd.getDate() + travelLenght);

        fetch(
            "https://www.skyscanner.net/g/chiron/api/v1/flights/browse/browsequotes/v1.0/ES/EUR/en-GB/BCN/anywhere/" +
                departureDate +
                "/" +
                dateEnd.getFullYear() +
                "-" +
                (dateEnd.getMonth() + 1) +
                "-" +
                dateEnd.getDate(),
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "api-key": "skyscanner-hackupc2019" }
            }
        )
            .then(res => res.json())
            .then(data => {
                var countries = {};
                var places = data["Places"];
                for (var i = 0; i < places.length; i++) {
                    countries[places[i]["PlaceId"]] = places[i]["Name"];
                }
                var flights = [];
                var quotes = data["Quotes"];
                for (var j = 0; j < quotes.length; j++) {
                    var flight = {};
                    flight["price"] = quotes[j]["MinPrice"];
                    flight["OutboundLeg"] = {};
                    flight["OutboundLeg"]["destination"] = countries[quotes[j]["OutboundLeg"]["DestinationId"]];
                    flight["OutboundLeg"]["date"] = quotes[j]["OutboundLeg"]["DepartureDate"];
                    flight["InboundLeg"] = {};
                    flight["InboundLeg"]["destination"] = countries[quotes[j]["InboundLeg"]["DestinationId"]];
                    flight["InboundLeg"]["date"] = quotes[j]["InboundLeg"]["DepartureDate"];
                    flights.push(flight);
                }
                window.dispFlights = flights;
                this.cleanCities();
            })
            .catch(error => {
                console.log(error);

                if (error === 500) {
                    window.setTimeout(() => {
                        this.fetchCities();
                    }, 1000);
                }
            });
    };

    fetchCities = () => {
        const { departureDate } = this.state;

        var date = new Date(departureDate);
        var firstMonth = date.getMonth();

        fetch("http://18.185.84.175/cities/info/", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {
                var parsedData = [];

                for (var i = 0; i < data.length; i++) {
                    parsedData.push({});
                    parsedData[i]["temperature"] = parseFloat(data[i]["temperature"][firstMonth]);
                    parsedData[i]["airQuality"] = parseFloat(data[i]["airQuality"][firstMonth]);
                    parsedData[i]["precipitation"] = parseFloat(data[i]["precipitation"][firstMonth]);
                    parsedData[i]["country"] = data[i]["country"];
                    parsedData[i]["id"] = data[i]["id"];
                    parsedData[i]["imatge"] = data[i]["imatge"];
                    parsedData[i]["location"] = data[i]["location"];
                    parsedData[i]["name"] = data[i]["name"];
                }

                window.parsData = parsedData;
                this.fetchFlights();
            })
            .catch(error => {
                console.log(error);

                if (error === 500) {
                    window.setTimeout(() => {
                        this.fetchCities();
                    }, 1000);
                }
            });
    };

    fetchTypeformData = () => {
        fetch("http://18.185.84.175/filters/final/", {
            method: "POST",
            body: JSON.stringify({ user_id: this.getUrlVars()["user_id"] }),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {
                var city, departureDate, travelLenght;
                for (var i = 0; i < data.length; ++i) {
                    if (data[i]["type"] === "choice") city = data[i]["choice"]["label"];
                    else if (data[i]["type"] === "date") departureDate = data[i]["date"];
                    else if (data[i]["type"] === "number") travelLenght = data[i]["number"];
                }
                this.setState({
                    hasRecievedData: true,
                    city: city,
                    departureDate: departureDate,
                    travelLenght: travelLenght
                });

                this.fetchCities();
            })
            .catch(error => {
                console.log(error);

                if (error === 500) {
                    window.setTimeout(() => {
                        this.fetchTypeformData();
                    }, 1000);
                }
            });
    };

    render() {
        const { hasRecievedData, city, departureDate, travelLenght } = this.state;
        if (this.getUrlVars()["user_id"]) {
            if (!hasRecievedData) {
                this.fetchTypeformData();
            } else {
                var app_content = (
                    <React.Fragment>
                        <Explorer city={city} departureDate={departureDate} travelLenght={travelLenght} />
                        <Map city={city} />
                        <Trip />
                    </React.Fragment>
                );
            }
        } else {
            app_content = (
                <React.Fragment>
                    <Typeform />
                </React.Fragment>
            );
        }

        return <div className="app_main">{app_content}</div>;
    }

    componentWillUnmount() {
        window.removeEventListener("resize", () => window.PubSub.emit("onWindowResize"));
    }
}
