htmx.logger = function (elt, event, data) {
    if (console) {
        console.log(event, elt, data);
    }
}


const queryParams = new URLSearchParams(window.location.search)
htmx.find("#search-input").value = queryParams.get('search') || "";