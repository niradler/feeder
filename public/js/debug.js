htmx.logger = function (elt, event, data) {
    if (console && window.isDev) {
        console.log(event, elt, data);
    }
}