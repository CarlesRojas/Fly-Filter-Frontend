export default class EventsPubSub {
    events = {};

    sub(eventName, func) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(func);
    }

    unsub(eventName, func) {
        if (this.events[eventName])
            for (var i = 0; i < this.events[eventName].length; i++)
                if (this.events[eventName][i] === func) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
    }

    emit(eventName, data) {
        if (this.events[eventName])
            this.events[eventName].forEach(function(func) {
                func(data);
            });
    }
}

/*  EVENTS:

    onWindowResize:             Called when the window is resized               ()
    onTripOpen:                 Called when a trip is opened                    ({origCity, destCity})
    onTripClose:                Called when a trip is closed                    ()
    onAddRentalCarClick:        Called when a car is added                      ({id})
    onDataLoaded:               Called when all the data is loaded              ()
    onFilterChange:              Called when a filter changes                    ({filterId, values})


    */
