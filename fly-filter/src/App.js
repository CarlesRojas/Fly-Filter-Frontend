import React, { Component } from "react";
import "./App.css";
import Typeform from "./jsx/Typeform";
import Explorer from "./jsx/Explorer";
import Map from "./jsx/Map";

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            hasRecievedData: false,
            city: "",
            departureDate: "",
            travelLenght: 0
        };
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

        console.log(this.getUrlVars());

        if (this.getUrlVars()["user_id"]) {
            if (!hasRecievedData) {
                this.fetchTypeformData();
            } else {
                var app_content = (
                    <div className="app_main">
                        <Explorer city={city} departureDate={departureDate} travelLenght={travelLenght} />
                        <Map />
                    </div>
                );
            }
        } else {
            app_content = (
                <div className="app_main">
                    <Typeform />
                </div>
            );
        }

        return <div className="app_main">{app_content}</div>;
    }

    componentDidMount() {
        window.setTimeout(() => {
            this.onTypeformSubmitted();
        }, 500);
    }
}
