const isMobile = window.orientation > -1 && 'ontouchstart' in window;
const themeKey = "FEEDER_THEME"
document.querySelectorAll('#theme-options').forEach((el) => el.addEventListener('click', changeTheme));
function changeTheme(el) {
    const selectedTheme = el.target.getAttribute('data-value');
    document.querySelector('html').setAttribute('data-theme', selectedTheme);
    localStorage.setItem(themeKey, selectedTheme);
}

const theme = localStorage.getItem(themeKey);
if (theme) {
    document.querySelector('html').setAttribute('data-theme', theme);
}

function sendNotification(message) {
    const enable = checkPageStatus()
    const trigger = (isMobile && enable) || (document.hidden && enable);
    if (trigger) {
        const notification = new Notification("Feeder: New alert", {
            icon: "https://cdn-icons-png.flaticon.com/512/2058/2058658.png",
            body: message
        })
        notification.onclick = () => function () {
            window.open(location.origin)
        }
    }
}


function checkPageStatus() {
    if (!("Notification" in window)) {
        console.error("This browser does not support system notifications!")
        return false
    }
    else if (Notification.permission === "granted") {
        return true
    }
    else if (Notification.permission !== "denied") {
        Notification.requestPermission((permission) => {
            if (permission === "granted") {
                return true
            }
        })
    }
}

document.body.addEventListener('htmx:load', function (evt) {
    htmx.find('#sse').addEventListener('htmx:sseMessage', function (evt) {
        const data = JSON.parse(evt.detail.data)
        const el = document.createElement('div');
        el.innerHTML = data.html;
        htmx.find('#search-results').prepend(el);
        sendNotification(data.alert.title)
    });
});
