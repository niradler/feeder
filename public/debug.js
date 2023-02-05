htmx.logger = function (elt, event, data) {
    if (console) {
        console.log(event, elt, data);
    }
}
