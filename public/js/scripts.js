const isMobile = window.orientation > -1 && 'ontouchstart' in window;

const Store = store.namespace('feeder');

function sendNotification(message) {
    checkPageStatus((enable) => {
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
    })
}


function checkPageStatus(cb = (status) => console.info(`Notification status: ${status ? 'on' : 'off'}`)) {
    const status = Store.get('notification');
    if (!status) {
        cb(false)
    }
    else if (!("Notification" in window)) {
        console.error("This browser does not support system notifications!")
        cb(false)
    }
    else if (Notification.permission === "granted") {
        cb(true)
    }
    else if (Notification.permission !== "denied") {
        Notification.requestPermission((permission) => {
            cb(permission === "granted")
        })
    }
}

const onLoad = () => {
    document.querySelectorAll('#theme-options').forEach((el) => el.addEventListener('click', changeTheme));
    function changeTheme(el) {
        const selectedTheme = el.target.getAttribute('data-value');
        document.querySelector('html').setAttribute('data-theme', selectedTheme);
        Store.set('theme', selectedTheme)
    }

    const theme = Store.get('theme')
    if (theme) {
        document.querySelector('html').setAttribute('data-theme', theme);
    }

    htmx.find('#sse').addEventListener('htmx:sseMessage', function (evt) {
        const data = JSON.parse(evt.detail.data)
        const el = document.createElement('div');
        el.innerHTML = data.html;
        htmx.find('#search-results').prepend(el);
        sendNotification(data.alert.title)
    });

    const notifyEl = document.querySelector('#notification-status');

    const notificationStatus = Store.get('notification')

    notifyEl.checked = notificationStatus;

    notifyEl.addEventListener('change', (e) => {
        if (e.target.checked) {
            Store.set('notification', true)
            checkPageStatus((enable) => {
                Store.set('notification', enable)
            });
        } else {
            Store.set('notification', false)
        }
    })

}


document.body.addEventListener('htmx:load', function (evt) {
    onLoad();
});