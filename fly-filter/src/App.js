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

    onTypeformSubmitted = () => {
        this.setState({
            hasRecievedData: true,
            city: "Barcelona",
            departureDate: "15-12-2019",
            travelLenght: 15
        });
    };

    fetchTypeformData = () => {
        // TODO fetch
        /*
        fetch("http://localhost:8888/refresh_token", {
            method: "POST",
            body: JSON.stringify({ refresh_token: window.info.refreshToken }),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);

                // TODO Treat dict
                this.onTypeformSubmitted();
            })
            .catch(error => {
                console.log(error);

                if (error === 500) {
                    window.setTimeout(() => {
                        this.fetchTypeformData();
                    }, 1000);
                }
            });

            */
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
