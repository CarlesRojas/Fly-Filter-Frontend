import React, { Component } from "react";
import  * as crossfilter from "crossfilter" 
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

    onTypeformSubmitted = () => {
        this.setState({
            hasRecievedData: true,
            city: "BARCELONA",
            departureDate: "15-12-2019",
            travelLenght: 15
        });
    };

    fetchCities = () => {
        const { departureDate } = this.state;

        var isoDate = departureDate.substring(6, 10) + "-" + departureDate.substring(3, 5) + "-" + departureDate.substring(0, 2);
        var date = new Date(isoDate);

        var firstMonth = date.getMonth()
        


        fetch("http://18.184.89.193/cities/info/", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {
                var parsedData = []
                for (var i = 0; i < data.length; i++) {
                    parsedData.push({})
                    parsedData[i]["temperature"] = data[i]["temperature"][firstMonth]
                    parsedData[i]["airQuality"] = data[i]["airQuality"][firstMonth]
                    parsedData[i]["precipitation"] = data[i]["precipitation"][firstMonth]
                    parsedData[i]["country"] = data[i]["country"]
                    parsedData[i]["id"] = data[i]["id"]
                    parsedData[i]["imatge"] = data[i]["imatge"]
                    parsedData[i]["location"] = data[i]["location"]
                    parsedData[i]["name"] = data[i]["name"]
                }
                window.cityData = parsedData
                console.log(parsedData)
                this.onTypefo.rmSubmitted();
            })
            .catch(error => {
                console.log(error);

                if (error === 500) {
                    window.setTimeout(() => {
                        this.fetchTypeformData();
                    }, 1000);
                }
            });
    }   


    fetchTypeformData = () => {
        // TODO fetch
        const { departureDate, travelLenght } = this.state;

        var isoDate = departureDate.substring(6, 10) + "-" + departureDate.substring(3, 5) + "-" + departureDate.substring(0, 2);
        var date = new Date(isoDate);

        var firstMonth = date.getMonth()
        


        fetch("http://18.184.89.193/filters/final/", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    hasRecievedData: true,
                    city: data["form_response"]["answers"][],
                    departureDate: "15-12-2019",
                    travelLenght: 15
                })
                window.cityData = parsedData
                console.log(parsedData)
                this.onTypefo.rmSubmitted();

                fetchCities()
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
                        <Map />
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

    componentDidMount() {
        window.setTimeout(() => {
            this.onTypeformSubmitted();
        }, 500);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", () => window.PubSub.emit("onWindowResize"));
    }
}
