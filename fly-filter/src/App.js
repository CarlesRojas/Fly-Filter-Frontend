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

    fetchFlights = () => {
        const { departureDate } = this.state;

        var date = new Date(departureDate);

        fetch("http://18.185.84.175/cities/info/", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {})
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

                var max_temperature = null,
                    min_temperature = null,
                    max_airQuality = null,
                    min_airQuality = null,
                    max_precipitation = null,
                    min_precipitation = null;

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

                    if (max_temperature == null) {
                        max_temperature = parsedData[i]["temperature"];
                        min_temperature = parsedData[i]["temperature"];
                        max_airQuality = parsedData[i]["airQuality"];
                        min_airQuality = parsedData[i]["airQuality"];
                        max_precipitation = parsedData[i]["precipitation"];
                        min_precipitation = parsedData[i]["precipitation"];
                    } else {
                        if (parsedData[i]["temperature"] > max_temperature) max_temperature = parsedData[i]["temperature"];
                        if (parsedData[i]["temperature"] < min_temperature) min_temperature = parsedData[i]["temperature"];

                        if (parsedData[i]["airQuality"] > max_airQuality) max_airQuality = parsedData[i]["airQuality"];
                        if (parsedData[i]["airQuality"] < min_airQuality) min_airQuality = parsedData[i]["airQuality"];

                        if (parsedData[i]["precipitation"] > max_precipitation) max_precipitation = parsedData[i]["precipitation"];
                        if (parsedData[i]["precipitation"] < min_precipitation) min_precipitation = parsedData[i]["precipitation"];
                    }
                }

                window.filterExtremes = {
                    max_temperature: max_temperature,
                    min_temperature: min_temperature,
                    max_airQuality: max_airQuality,
                    min_airQuality: min_airQuality,
                    max_precipitation: max_precipitation,
                    min_precipitation: min_precipitation
                };

                window.cityData = parsedData;

                window.PubSub.emit("onDataLoaded");
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
